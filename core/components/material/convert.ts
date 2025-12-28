/**
 * @file core/components/material/convert.ts
 * @description 材料组件转换
 * @since 2.4.0
 */

import path from "node:path";
import process from "node:process";

import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import fetchSgBuffer from "@utils/fetchSgBuffer.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import yattaTool from "@yatta/yatta.ts";
import fs from "fs-extra";
import sharp from "sharp";

import { imgDir, jsonDir, wikiDir } from "./constant.ts";

logger.init();
Counter.Init("[components][material][convert]");
logger.default.info("[components][material][convert] 运行 convert.ts");

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

const rawPath = path.join(jsonDir.src, "material.json");
if (!fileCheck(rawPath, false)) {
  logger.default.error("[components][material][convert] JSON 数据文件不存在");
  process.exit(1);
}

const rawData: Array<TGACore.Plugins.Yatta.Material.MaterialItem> = await fs.readJson(rawPath);
const rawList = Object.values(rawData);
const transJson: Array<TGACore.Components.Material.WikiItem> = [];
// 转换json
for (const item of rawList) {
  const oriPath = path.join(jsonDir.src, `${item.id}.json`);
  if (!fileCheck(oriPath, false)) {
    logger.default.error(`[components][material][convert][${item.id}] ${item.name} JSON 不存在`);
    Counter.Fail();
    continue;
  }
  const oriData: TGACore.Plugins.Yatta.Material.MaterialDetail = await fs.readJson(oriPath);
  const transData = await transMaterial(item, oriData);
  transJson.push(transData);
  logger.console.info(`[components][material][convert][${item.id}] ${item.name} JSON 转换完成`);
}
Counter.End();
Counter.Output();
const savePath = path.join(wikiDir.out, "Wiki", "material.json");
await fs.writeJson(savePath, transJson);
logger.default.info(`[components][material][convert] JSON 转换完成，耗时${Counter.getTime()}`);

// 转换图片
Counter.Reset(rawList.length);
for (const item of rawList) {
  const oriPath = path.join(imgDir.src, `${item.id}.png`);
  const outPath = path.join(imgDir.out, `${item.id}.webp`);
  if (!fileCheck(oriPath, false)) {
    logger.default.error(`[components][material][convert][${item.id}] ${item.name} PNG 不存在`);
    Counter.Fail();
    continue;
  }
  if (fileCheck(outPath, false)) {
    logger.console.mark(`[components][material][convert][${item.id}] ${item.name} WEBP 已存在`);
    Counter.Skip();
    continue;
  }
  await sharp(oriPath).png().resize(256, 256).webp().toFile(outPath);
  logger.console.info(`[components][material][convert][${item.id}] ${item.name} WEBP 转换完成`);
}

Counter.End();
Counter.Output();
logger.default.info(`[components][material][convert] 图片转换完成，耗时${Counter.getTime()}`);

logger.default.info(`[components][material][convert] 转换完成，耗时${Counter.getTime()}`);
Counter.EndAll();

/**
 * @description 转换材料数据
 * @since 2.4.0
 * @param {TGACore.Plugins.Yatta.Material.MaterialItem} material 原始材料数据
 * @param {TGACore.Plugins.Yatta.Material.MaterialDetail} data 材料数据
 * @return {TGACore.Components.Material.WikiItem} 转换后的材料数据
 */
async function transMaterial(
  material: TGACore.Plugins.Yatta.Material.MaterialItem,
  data: TGACore.Plugins.Yatta.Material.MaterialDetail,
): Promise<TGACore.Components.Material.WikiItem> {
  // 处理合成
  const converts: Array<TGACore.Components.Material.Convert> = [];
  if (data.recipe) {
    const recipeAllKeys = Object.keys(data.recipe);
    for (const item of recipeAllKeys) {
      const convert: TGACore.Components.Material.Convert = { id: item, source: [] };
      const recipeItem = data.recipe[item];
      const recipeMaterials = Object.keys(recipeItem);
      for (const key of recipeMaterials) {
        const materialJson = path.join(jsonDir.src, `${key}.json`);
        if (!fileCheck(materialJson, false)) {
          logger.default.warn(
            `[components][material][convert][${material.id}] ${key} JSON 文件不存在，尝试下载`,
          );
          try {
            const json = await yattaTool.fetchJson<TGACore.Plugins.Yatta.Material.DetailResponse>(
              `CHS/material/${key}`,
            );
            fs.writeJSONSync(materialJson, json.data, { spaces: 2 });
            const savePath = path.join(imgDir.out, `${key}.webp`);
            if (!fileCheck(savePath, false)) {
              const iconBuffer = await fetchSgBuffer("ItemIcon", `${json.data.icon}.png`);
              await sharp(iconBuffer).png().resize(256, 256).webp().toFile(savePath);
            }
            logger.default.info(
              `[components][material][convert][${material.id}] ${key} 数据补充完成`,
            );
          } catch (e) {
            logger.default.error(
              `[components][material][convert][${material.id}] ${key} JSON 下载失败`,
            );
            logger.default.error(e);
            Counter.Fail();
            continue;
          }
        }
        const materialData: TGACore.Plugins.Yatta.Material.MaterialDetail =
          await fs.readJson(materialJson);
        convert.source.push({
          id: key,
          name: materialData.name,
          type: materialData.type,
          star: materialData.rank,
          count: recipeItem[key].count,
        });
      }
      converts.push(convert);
    }
  }
  // 处理来源
  let source: Array<TGACore.Components.Material.Source> = [];
  const dayList = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  if (data.source) {
    for (const item of data.source) {
      let days: Array<number> = [];
      if (item.days === undefined) {
        if (item.name === "前往采集") continue;
        if (item.name === "占位-可合成数量:{0}") continue;
        source.push({ name: item.name, type: item.type });
        continue;
      }
      item.days.forEach((day: string) => days.push(dayList.indexOf(day)));
      days = days.sort((a, b) => a - b);
      source.push({ name: item.name, type: item.type, days });
    }
  }
  // 移除摩拉获取方式
  if (["105", "102", "202"].includes(material.id.toString())) {
    source = source.filter((i) => i.type !== "domain");
    source.push({ type: "single", name: "秘境获取" });
  }
  return {
    id: Number(material.id),
    name: data.name,
    description: data.description,
    type: data.type,
    star: data.rank,
    source,
    convert: converts,
  };
}
