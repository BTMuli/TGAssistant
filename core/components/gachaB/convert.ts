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
Counter.Init(`[GachaB][Convert]`);
logger.default.info(`[GachaB][Convert] 执行 convert.ts`);

fileCheckObj(jsonDir);
fileCheckObj(imgDir);
if (!fileCheck(jsonDetailDir.suit)) {
  logger.default.error(`[GachaB][Convert] 套装数据文件不存在`);
  logger.console.info(`[GachaB][Convert] 请执行 download.ts`);
  process.exit(1);
}

const rawSuit: TGACore.Plugins.Hakushi.Beyond.SuitResp = fs.readJsonSync(jsonDetailDir.suit);
const convertData: Array<TGACore.Components.Gacha.GachBMeta> = [];

// 处理套装数据
for (const [id, suit] of Object.entries(rawSuit)) {
  const res: TGACore.Components.Gacha.GachBMeta = {
    id: id,
    name: suit.Name,
    icon: suit.Icon,
    type: "装扮套装",
    rank: transRank(suit.Rank),
  };
  convertData.push(res);
  Counter.Success();
}
Counter.End();
fs.writeJsonSync(jsonDetailDir.out, convertData);

const suitsInfo = Object.values(rawSuit);
Counter.addTotal(suitsInfo.length);
for (const suit of suitsInfo) {
  const oriPath = path.join(imgDir.src, `${suit.Icon}.webp`);
  const savePath = path.join(imgDir.out, `${suit.Icon}.webp`);
  if (!fileCheck(oriPath, false)) {
    logger.default.warn(`[components][gachaB][convert] ${suit.Icon}.webp 不存在`);
    Counter.Fail();
    continue;
  }
  if (fileCheck(savePath, false)) {
    logger.console.mark(`[components][gachaB][convert] ${suit.Icon}.webp 已转化，跳过`);
    Counter.Skip();
    continue;
  }
  await sharp(oriPath).webp().resize(256, 256).webp().toFile(savePath);
  logger.console.info(`[components][gachaB][convert] ${suit.Icon}.webp 转换成功`);
  Counter.Success();
}

Counter.End();
Counter.Output();

logger.default.info(`[GachaB][Convert] 数据转换完成，耗时${Counter.getTime()}`);
Counter.EndAll();

/**
 * 转换稀有度
 * @since 2.5.0
 * @param {TGACore.Plugins.Hakushi.Beyond.BeyondRank} rank
 * @returns {number} 稀有度
 */
function transRank(rank: TGACore.Plugins.Hakushi.Beyond.BeyondRank): number {
  switch (rank) {
    case "Green":
      return 2;
    case "Blue":
      return 3;
    case "Purple":
      return 4;
    case "Orange":
      return 5;
    default:
      return 1;
  }
}
