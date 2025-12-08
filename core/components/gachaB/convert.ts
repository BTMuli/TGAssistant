/**
 * 千星奇域资源转换脚本
 * @since 2.5.0
 */

import path from "node:path";

import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import fs from "fs-extra";
import sharp from "sharp";

import { imgDir, jsonDetailDir, jsonDir } from "./constant.ts";

logger.init();
Counter.Init(`[components][gachaB][convert]`);
logger.default.info(`[gachaB][convert] 执行 convert.ts`);

fileCheckObj(jsonDir);
fileCheckObj(imgDir);
if (!fileCheck(jsonDetailDir.item)) {
  logger.default.error(`[components][gachaB][convert] 物品数据文件不存在`);
  logger.console.info(`[components][gachaB][convert] 请执行 download.ts`);
  process.exit(1);
}

const rawItem: TGACore.Plugins.Hakushi.Beyond.ItemResp = fs.readJsonSync(jsonDetailDir.item);
const convertData: Array<TGACore.Components.Gacha.GachBMeta> = [];

// 处理部件数据
for (const [id, item] of Object.entries(rawItem)) {
  const res: TGACore.Components.Gacha.GachBMeta = {
    id: id,
    name: item.Name,
    icon: item.Icon,
    type: item.Type,
    rank: item.Rank,
  };
  convertData.push(res);
}
Counter.End();
fs.writeJsonSync(jsonDetailDir.out, convertData);

Counter.addTotal(convertData.length);
for (const info of convertData) {
  await convertImg(info.icon, info.name);
}

Counter.End();
Counter.Output();

logger.default.info(`[components][gachaB][convert] 数据转换完成，耗时${Counter.getTime()}`);
Counter.EndAll();

/**
 * 转换图片
 * @param {string} icon 图片路径
 * @param {string} name 名称
 * @return {Promise<void>}
 */
async function convertImg(icon: string, name: string): Promise<void> {
  const oriPath = path.join(imgDir.src, `${icon}.webp`);
  const savePath = path.join(imgDir.out, `${icon}.webp`);
  if (!fileCheck(oriPath, false)) {
    logger.default.warn(`[components][gachaB][convert] ${name} ${icon}.webp 不存在`);
    Counter.Fail();
    return;
  }
  if (fileCheck(savePath, false)) {
    logger.console.mark(`[components][gachaB][convert] ${name} ${icon}.webp 已转化，跳过`);
    Counter.Skip();
    return;
  }
  await sharp(oriPath).webp().resize(512, 512).webp().toFile(savePath);
  logger.console.info(`[components][gachaB][convert] ${name} ${icon}.webp 转换成功`);
  Counter.Success();
}
