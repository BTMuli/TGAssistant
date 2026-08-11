/**
 * 材料组件转换
 * @since 2.6.0
 */

import path from "node:path";

import hutaoTool from "@hutao/hutao.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import yattaTool from "@yatta/yatta.ts";
import fs from "fs-extra";
import sharp from "sharp";

import { imgDir, jsonDir } from "./constant.ts";
import { shouldConvertMaterial } from "./filter.ts";
import fetchMaterialIcon from "./utils.ts";

logger.init();
Counter.Init("[components][material][download]");
logger.default.info("[components][material][download] 运行 download.ts");

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

let rawMaterial: Array<TGACore.Plugins.Yatta.Material.MaterialItem> = [];
let rawFood: Array<TGACore.Plugins.Yatta.Food.FoodItem> = [];

logger.default.info("[components][material][download] 开始下载 JSON 数据");
try {
  const res =
    await yattaTool.fetchJson<TGACore.Plugins.Yatta.Material.MaterialResponse>("CHS/material");
  if (res.response !== 200) throw new Error(`Yatta 材料索引响应异常：${res.response}`);
  logger.default.info("[components][material][download] JSON 数据下载完成");
  const savePath = path.join(jsonDir.src, "material.json");
  rawMaterial = Object.values(res.data.items);
  await fs.writeJson(savePath, rawMaterial, { spaces: 2 });
} catch (error) {
  logger.default.error("[components][material][download] 下载 JSON 数据失败");
  logger.console.error(error);
  Counter.Fail();
}

logger.default.info("[components][material][download] 开始下载食物索引数据");
try {
  const res = await yattaTool.fetchJson<TGACore.Plugins.Yatta.Food.FoodResponse>("CHS/food");
  if (res.response !== 200) throw new Error(`Yatta 食物索引响应异常：${res.response}`);
  rawFood = Object.values(res.data.items);
  const savePath = path.join(jsonDir.src, "food.json");
  await fs.writeJson(savePath, rawFood, { spaces: 2 });
  logger.default.info("[components][material][download] 食物索引数据下载完成");
} catch (error) {
  logger.default.error("[components][material][download] 下载食物索引数据失败");
  logger.console.error(error);
  Counter.Fail();
}

logger.default.info("[components][material][download] 开始记录 Metadata 类型描述");
const hasMetadata = hutaoTool.check(hutaoTool.enum.file.Material);
const rawMetadata = hasMetadata
  ? hutaoTool.read<TGACore.Plugins.Hutao.Material.FullInfo>(hutaoTool.enum.file.Material)
  : [];
if (!hasMetadata) {
  logger.default.warn(
    "[components][material][download] Metadata Material.json 不存在，跳过记录 TypeDescription",
  );
} else {
  try {
    const typeDescriptions = [...new Set(rawMetadata.map((item) => item.TypeDescription))];
    await fs.writeJson(path.join(jsonDir.src, "typedesc.json"), typeDescriptions, { spaces: 2 });
    logger.default.info(
      `[components][material][download] Metadata 类型描述记录完成，共 ${typeDescriptions.length} 项`,
    );
  } catch (e) {
    logger.default.error("[components][material][download] Metadata 类型描述记录失败");
    logger.default.error(e);
    Counter.Fail();
  }
}

logger.default.info("[components][material][download] 开始下载材料数据");
type DownloadItem = { id: number; name: string; icon: string; detailPath: string };
const downloadMap = new Map<number, DownloadItem>();
for (const item of rawMaterial) {
  downloadMap.set(Number(item.id), {
    id: Number(item.id),
    name: item.name,
    icon: item.icon,
    detailPath: `CHS/material/${item.id}`,
  });
}
for (const item of rawFood) {
  downloadMap.set(item.id, {
    id: item.id,
    name: item.name,
    icon: item.icon,
    detailPath: `CHS/food/${item.id}`,
  });
}
for (const item of rawMetadata) {
  if (!shouldConvertMaterial(item)) continue;
  downloadMap.set(item.Id, {
    id: item.Id,
    name: item.Name,
    icon: item.Icon,
    detailPath: item.TypeDescription === "食物" ? `CHS/food/${item.Id}` : `CHS/material/${item.Id}`,
  });
}
const downloadList = [...downloadMap.values()];
Counter.addTotal(downloadList.length * 2);

function validJsonFile(filePath: string): boolean {
  if (!fileCheck(filePath, false)) return false;
  try {
    const data = fs.readJsonSync(filePath);
    return typeof data === "object" && data !== null && !Array.isArray(data);
  } catch {
    return false;
  }
}

for (const item of downloadList) {
  const savePathJ = path.join(jsonDir.src, `${item.id}.json`);
  const savePathI = path.join(imgDir.src, `${item.id}.png`);
  const checkJ = validJsonFile(savePathJ);
  const checkI = fileCheck(savePathI, false);
  if (checkJ && checkI) {
    logger.console.mark(`[components][material][download][${item.id}] JSON 已存在，跳过下载`);
    logger.console.mark(`[components][material][download][${item.id}] 图片已存在，跳过下载`);
    Counter.Skip(2);
    continue;
  }
  if (checkJ) {
    logger.console.mark(`[components][material][download][${item.id}] JSON 已存在，跳过下载`);
    Counter.Skip();
  }
  if (checkI) {
    logger.console.mark(`[components][material][download][${item.id}] 图片已存在，跳过下载`);
    Counter.Skip();
  }
  if (!checkJ) {
    try {
      const res = await yattaTool.fetchJson<
        TGACore.Plugins.Yatta.Material.DetailResponse | TGACore.Plugins.Yatta.Food.DetailResponse
      >(item.detailPath);
      if (res.response !== 200) throw new Error(`Yatta 详情响应异常：${res.response}`);
      await fs.writeJson(savePathJ, res.data, { spaces: 2 });
      logger.default.info(
        `[components][material][download][${item.id}] ${item.name} JSON 下载完成`,
      );
      Counter.Success();
    } catch (e) {
      logger.default.warn(
        `[components][material][download][${item.id}] ${item.name} JSON 下载失败`,
      );
      logger.default.error(e);
      Counter.Fail();
    }
  }
  if (!checkI) {
    let buffer: Buffer;
    try {
      buffer = await fetchMaterialIcon(`${item.icon}.png`);
    } catch (e) {
      logger.default.warn(
        `[components][material][download][${item.id}] ${item.name} 图片下载失败，ItemIcon-Minimum 和 ItemIcon 中均不存在`,
      );
      logger.default.error(e);
      Counter.Fail();
      continue;
    }
    try {
      await sharp(buffer).toFile(savePathI);
      logger.default.info(`[components][material][download][${item.id}] ${item.name} 图片下载完成`);
      Counter.Success();
    } catch (e) {
      logger.default.warn(`[components][material][download][${item.id}] ${item.name} 图片保存失败`);
      logger.default.error(e);
      Counter.Fail();
    }
  }
}
Counter.End();

logger.default.info(`[components][material][download] 数据更新完成，耗时 ${Counter.getTime()}`);
Counter.EndAll();
Counter.Output();
