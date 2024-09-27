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

import { imgDir, jsonDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";
import { readConfig } from "../../utils/readConfig.ts";

logger.init();
Counter.Init("[components][material][download]");
logger.default.info("[components][material][download] 运行 download.ts");

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

const amberConfig = readConfig("constant").amber;
const rawAmberData: TGACore.Plugins.Amber.Material[] = [];

logger.default.info("[components][material][download] 开始下载 JSON 数据");
try {
  const res: TGACore.Plugins.Amber.ResponseMaterial = await axios
    .get(`${amberConfig.api}chs/material`, {
      params: {
        vh: amberConfig.version,
      },
    })
    .then((res) => res.data);
  logger.default.info("[components][material][download] JSON 数据下载完成");
  const savePath = path.join(jsonDir.src, "material.json");
  await fs.writeJson(savePath, res.data.items, { spaces: 2 });
  rawAmberData.push(...Object.values(res.data.items));
} catch (error) {
  logger.default.error("[components][material][download] 下载 JSON 数据失败");
  logger.console.error(error);
  Counter.Fail();
}

if (rawAmberData.length === 0) {
  logger.default.error("[components][material][download] 下载 JSON 数据失败");
  Counter.Fail();
  process.exit(1);
}

for (const material of rawAmberData) {
  await downloadJson(material);
}
Counter.End();

// 下载图片
logger.default.info("[components][material][download] 开始下载图片");
Counter.Reset(rawAmberData.length);
for (const material of rawAmberData) {
  await downloadImg(material);
}
Counter.End();

logger.default.info(`[components][material][download] 数据更新完成，耗时 ${Counter.getTime()}`);
Counter.EndAll();
Counter.Output();

/**
 * @description 下载 JSON
 * @since 2.0.1
 * @param {TGACore.Plugins.Amber.Material} data 材料数据
 * @return {Promise<void>}
 */
async function downloadJson(data: TGACore.Plugins.Amber.Material): Promise<void> {
  const savePath = path.join(jsonDir.src, `${data.id}.json`);
  if (fileCheck(savePath, false)) {
    logger.console.mark(
      `[components][material][download][${data.id}] ${data.name} JSON 已存在，跳过下载`,
    );
    Counter.Skip();
    return;
  }
  let res: TGACore.Components.Material.Response;
  try {
    res = await axios
      .get(`${amberConfig.api}chs/material/${data.id}`, {
        params: {
          vh: amberConfig.version,
        },
      })
      .then((res) => res.data);
  } catch (e) {
    logger.default.warn(`[components][material][download][${data.id}] ${data.name} JSON 下载失败`);
    logger.default.error(e);
    Counter.Fail();
    return;
  }
  await fs.writeJson(savePath, res.data, { spaces: 2 });
  logger.default.info(`[components][material][download][${data.id}] ${data.name} JSON 下载完成`);
  Counter.Success();
}

/**
 * @description 下载图片
 * @since 2.2.0
 * @param {TGACore.Plugins.Amber.Material} data 材料数据
 * @return {Promise<void>}
 */
async function downloadImg(data: TGACore.Plugins.Amber.Material): Promise<void> {
  const savePath = path.join(imgDir.src, `${data.id}.png`);
  if (fileCheck(savePath, false)) {
    logger.console.mark(
      `[components][material][download][${data.id}] ${data.name} 图片已存在，跳过下载`,
    );
    Counter.Skip();
    return;
  }
  let res: ArrayBuffer;
  try {
    res = await axios
      .get(`${amberConfig.site}assets/UI/${data.icon}.png`, {
        responseType: "arraybuffer",
      })
      .then((res) => res.data);
  } catch (e) {
    logger.default.warn(`[components][material][download][${data.id}] ${data.name} 图片下载失败`);
    logger.default.error(e);
    Counter.Fail();
    return;
  }
  await sharp(res).toFile(savePath);
  logger.default.info(`[components][material][download][${data.id}] ${data.name} 图片下载完成`);
  Counter.Success();
}
