/**
 * @file core/components/material/convert.ts
 * @description 材料组件转换
 * @since 2.0.1
 */

import path from "node:path";
import process from "node:process";

import fs from "fs-extra";
import sharp from "sharp";

import { imgDir, jsonDir, wikiDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";

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
  if (data.recipe !== false) {
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
        if (!fileCheck(materialJson, false)) {
          logger.default.error(
            `[components][material][convert][${material.id}] ${material.name} JSON 文件不存在`,
          );
          Counter.Fail();
          continue;
        }
        const materialData: TGACore.Components.Material.RawAmber = await fs.readJson(materialJson);
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
  return {
    id: material.id,
    name: data.name,
    description: data.description,
    type: data.type,
    star: data.rank,
    source: data.source ?? [],
    convert: converts,
  };
}
