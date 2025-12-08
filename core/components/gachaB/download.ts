/**
 * 千星奇域资源下载脚本
 * @since 2.5.0
 */

import path from "node:path";

import hakushiTool from "@hakushi/hakushi.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import fs from "fs-extra";
import sharp from "sharp";

import { imgDir, jsonDetailDir, jsonDir } from "./constant.ts";

logger.init();
Counter.Init(`[components][gachaB][download]`);
logger.default.info(`[components][gachaB][download] 执行 download.ts`);

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

const rawItem: Array<TGACore.Plugins.Hakushi.Beyond.ItemInfo> = [];

logger.default.info(`[component][gachaB][download] 开始下载物品数据`);
try {
  const res = await hakushiTool.fetchJson<TGACore.Plugins.Hakushi.Beyond.ItemResp>(
    "data/zh/beyond/item.json",
  );
  logger.default.info(`[component][gachaB][download] 物品数据下载完成`);
  rawItem.push(...Object.values(res));
  const savePath = jsonDetailDir.item;
  await fs.writeJson(savePath, res, { spaces: 2 });
} catch (error) {
  logger.default.error(`[component][gachaB][download] 下载物品数据失败`);
  logger.console.error(error);
  Counter.Fail();
}

for (const item of rawItem) {
  await downloadImg(item.Icon, item.Name);
}

logger.default.info(`[components][gachaB][download] 数据下载完成，耗时 ${Counter.getTime()}`);
Counter.EndAll();
Counter.Output();

/**
 * 下载图片
 * @param {string} icon 图片名称
 * @param {string} name 名称
 * @return {Promise<void>}
 */
async function downloadImg(icon: string, name: string): Promise<void> {
  const savePath = path.join(imgDir.src, `${icon}.webp`);
  const check = fileCheck(savePath, false);
  if (check) {
    logger.console.mark(`[components][gachaB][download] ${name} ${icon} 已存在，跳过`);
    Counter.Skip();
    return;
  }
  try {
    const buffer = await hakushiTool.fetchBuffer(icon);
    await sharp(buffer).toFile(savePath);
    logger.default.info(`[components][gachaB][download] ${name} ${icon} 下载成功`);
    Counter.Success();
  } catch (e) {
    logger.default.warn(`[components][gachaB][download] ${name} ${icon} 下载失败`);
    logger.default.error(e);
    Counter.Fail();
  }
}
