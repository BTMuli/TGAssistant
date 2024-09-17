/**
 * @file core/components/material/convert.ts
 * @description 材料组件转换
 * @since 2.2.0
 */

import path from "node:path";
import process from "node:process";

import axios from "axios";
import fs from "fs-extra";
import sharp from "sharp";

import { imgDir, jsonDir, wikiDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";
import { readConfig } from "../../utils/readConfig.ts";

logger.init();
Counter.Init("[components][material][convert]");
logger.default.info("[components][material][convert] 运行 convert.ts");
const amberConfig = readConfig(TGACore.Config.ConfigFileEnum.Constant).amber;

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

const rawPath = path.join(jsonDir.src, "material.json");
if (!fileCheck(rawPath, false)) {
  logger.default.error("[components][material][convert] JSON 数据文件不存在");
  process.exit(1);
}

const rawData: Record<string, TGACore.Plugins.Amber.Material> = await fs.readJson(rawPath);
const rawList = Object.values(rawData);
const transJson: TGACore.Components.Material.WikiItem[] = [];
// 转换json
for (const material of rawList) {
  const oriPath = path.join(jsonDir.src, `${material.id}.json`);
  if (!fileCheck(oriPath, false)) {
    logger.default.error(
      `[components][material][convert][${material.id}] ${material.name} JSON 文件不存在`,
    );
    Counter.Fail();
    continue;
  }
  const oriData: TGACore.Components.Material.RawAmber = await fs.readJson(oriPath);
  const transData: TGACore.Components.Material.WikiItem = await transMaterial(material, oriData);
  transJson.push(transData);
  logger.console.info(
    `[components][material][convert][${material.id}] ${material.name} JSON 转换完成`,
  );
}
Counter.End();
Counter.Output();
const savePath = path.join(wikiDir.out, "Wiki", "material.json");
await fs.writeJson(savePath, transJson, { spaces: 2 });
logger.default.info(`[components][material][convert] JSON 转换完成，耗时${Counter.getTime()}`);

// 转换图片
Counter.Reset(rawList.length);
for (const material of rawList) {
  const oriPath = path.join(imgDir.src, `${material.id}.png`);
  const outPath = path.join(imgDir.out, `${material.id}.webp`);
  if (!fileCheck(oriPath, false)) {
    logger.default.error(
      `[components][material][convert][${material.id}] ${material.name} PNG 文件不存在`,
    );
    Counter.Fail();
    continue;
  }
  if (fileCheck(outPath, false)) {
    logger.console.mark(
      `[components][material][convert][${material.id}] ${material.name} WEBP 已存在`,
    );
    Counter.Skip();
    continue;
  }
  await sharp(oriPath).png().resize(256, 256).webp().toFile(outPath);
  logger.console.info(
    `[components][material][convert][${material.id}] ${material.name} WEBP 转换完成`,
  );
}

Counter.End();
Counter.Output();
logger.default.info(`[components][material][convert] 图片转换完成，耗时${Counter.getTime()}`);

logger.default.info(`[components][material][convert] 转换完成，耗时${Counter.getTime()}`);
Counter.EndAll();

/**
 * @description 转换材料数据
 * @since 2.0.1
 * @param {TGACore.Plugins.Amber.Material} material 原始材料数据
 * @param {TGACore.Components.Material.RawAmber} data 材料数据
 * @return {TGACore.Components.Material.WikiItem} 转换后的材料数据
 */
async function transMaterial(
  material: TGACore.Plugins.Amber.Material,
  data: TGACore.Components.Material.RawAmber,
): Promise<TGACore.Components.Material.WikiItem> {
  const converts: TGACore.Components.Material.Convert[] = [];
  if (data.recipe !== null && data.recipe != false) {
    const keys = Object.keys(data.recipe);
    for (const key of keys) {
      const convert: TGACore.Components.Material.Convert = {
        id: key,
        source: [],
      };
      const recipe = data.recipe[key];
      const recipeKeys = Object.keys(recipe);
      for (const recipeKey of recipeKeys) {
        const materialJson = path.join(jsonDir.src, `${recipeKey}.json`);
        let materialData: TGACore.Components.Material.RawAmber;
        if (!fileCheck(materialJson, false)) {
          logger.default.warn(
            `[components][material][convert][${material.id}] ${recipeKey} JSON 文件不存在，尝试下载`,
          );
          await convertImg(recipeKey);
          const data = await downloadJson(recipeKey);
          if (data === false) {
            logger.default.warn(
              `[components][material][convert][${material.id}] ${recipeKey} JSON 下载失败`,
            );
            continue;
          }
          materialData = data;
        } else {
          materialData = await fs.readJson(materialJson);
        }
        convert.source.push({
          id: recipeKey,
          name: materialData.name,
          type: materialData.type,
          star: materialData.rank,
          count: recipe[recipeKey].count,
        });
      }
      converts.push(convert);
    }
  }
  const source: TGACore.Components.Material.Source[] = [];
  const dayList = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  if (data.source !== null) {
    for (const item of data.source) {
      let days: number[] = [];
      if (item.days !== undefined) {
        item.days.map((day: string) => {
          const index = dayList.indexOf(day);
          return days.push(index);
        });
        days = days.sort((a, b) => a - b);
        source.push({
          name: item.name,
          type: item.type,
          days,
        });
      } else {
        source.push({
          name: item.name,
          type: item.type,
        });
      }
    }
  }
  return {
    id: material.id,
    name: data.name,
    description: data.description,
    type: data.type,
    star: data.rank,
    source,
    convert: converts,
  };
}

/**
 * @description 下载 JSON
 * @since 2.2.0
 * @param {string} id 材料 ID
 * @return {Promise<TGACore.Components.Material.RawAmber|false>}
 */
async function downloadJson(id: string): Promise<TGACore.Components.Material.RawAmber | false> {
  let res: TGACore.Components.Material.Response;
  try {
    res = await axios
      .get(`${amberConfig.api}chs/material/${id}`, {
        params: {
          vh: amberConfig.version,
        },
      })
      .then((res) => res.data);
  } catch (error) {
    logger.default.error(`[components][material][convert][${id}] 下载 JSON 数据失败`);
    logger.console.error(error);
    return false;
  }
  return res.data;
}

/**
 * @description 下载图片
 * @since 2.2.0
 * @param {string} id 材料 ID
 * @return {Promise<void>}
 */
async function convertImg(id: string): Promise<void> {
  const savePath = path.join(imgDir.out, `${id}.webp`);
  if (fileCheck(savePath, false)) {
    logger.console.mark(`[components][material][convert][${id}] 图片已存在，跳过下载`);
    return;
  }
  let res: ArrayBuffer;
  try {
    res = await axios
      .get(`${amberConfig.site}assets/UI/UI_ItemIcon_${id}.png`, {
        responseType: "arraybuffer",
      })
      .then((res) => res.data);
  } catch (error) {
    logger.default.error(`[components][material][convert][${id}] 下载图片失败`);
    logger.console.error(error);
    return;
  }
  await sharp(res).png().resize(256, 256).webp().toFile(savePath);
  logger.default.info(`[components][material][convert][${id}] 图片转换完成`);
}
