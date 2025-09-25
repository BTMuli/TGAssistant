/**
 * @file core/components/material/convert.ts
 * @description 材料组件转换
 * @since 2.4.0
 */

import path from "node:path";

import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import fetchSgBuffer from "@utils/fetchSgBuffer.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import yattaTool from "@yatta/yatta.ts";
import fs from "fs-extra";
import sharp from "sharp";

import { imgDir, jsonDir } from "./constant.ts";

logger.init();
Counter.Init("[components][material][download]");
logger.default.info("[components][material][download] 运行 download.ts");

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

let rawMaterial: Array<TGACore.Plugins.Yatta.Material.MaterialItem> = [];

logger.default.info("[components][material][download] 开始下载 JSON 数据");
try {
  const res =
    await yattaTool.fetchJson<TGACore.Plugins.Yatta.Material.MaterialResponse>("CHS/material");
  logger.default.info("[components][material][download] JSON 数据下载完成");
  const savePath = path.join(jsonDir.src, "material.json");
  rawMaterial = Object.values(res.data.items);
  await fs.writeJson(savePath, rawMaterial, { spaces: 2 });
} catch (error) {
  logger.default.error("[components][material][download] 下载 JSON 数据失败");
  logger.console.error(error);
  Counter.Fail();
}

logger.default.info("[components][material][download] 开始下载材料数据");
Counter.addTotal(rawMaterial.length * 2);
for (const item of rawMaterial) {
  const savePathJ = path.join(jsonDir.src, `${item.id}.json`);
  const savePathI = path.join(imgDir.src, `${item.id}.png`);
  const checkJ = fileCheck(savePathJ, false);
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
      const res = await yattaTool.fetchJson<TGACore.Plugins.Yatta.Material.DetailResponse>(
        `CHS/material/${item.id}`,
      );
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
    try {
      const buffer = await fetchSgBuffer("ItemIcon", `${item.icon}.png`);
      await sharp(buffer).toFile(savePathI);
      logger.default.info(`[components][material][download][${item.id}] ${item.name} 图片下载完成`);
      Counter.Success();
    } catch (e) {
      logger.default.warn(`[components][material][download][${item.id}] ${item.name} 图片下载失败`);
      logger.default.error(e);
      Counter.Fail();
    }
  }
}
Counter.End();

logger.default.info(`[components][material][download] 数据更新完成，耗时 ${Counter.getTime()}`);
Counter.EndAll();
Counter.Output();
