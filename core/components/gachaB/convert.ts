/**
 * 千星奇域资源转换脚本
 * @since 2.5.0
 */

import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import fs from "fs-extra";

import { jsonDir, jsonDetailDir } from "./constant.ts";

logger.init();
Counter.Init(`[GachaB][Convert]`);
logger.default.info(`[GachaB][Convert] 执行 convert.ts`);

fileCheckObj(jsonDir);
if (!fileCheck(jsonDetailDir.costume) || !fileCheck(jsonDetailDir.suit)) {
  logger.default.error(`[GachaB][Convert] 部件或套装数据文件不存在`);
  logger.console.info(`[GachaB][Convert] 请执行 download.ts`);
  process.exit(1);
}

const rawCostume: TGACore.Plugins.Hakushi.Beyond.CostumeResp = fs.readJsonSync(
  jsonDetailDir.costume,
);
const rawSuit: TGACore.Plugins.Hakushi.Beyond.SuitResp = fs.readJsonSync(jsonDetailDir.suit);
const convertData: Array<TGACore.Components.Gacha.GachBMeta> = [];
// 处理部件数据
for (const [id, costume] of Object.entries(rawCostume)) {
  const res: TGACore.Components.Gacha.GachBMeta = {
    id: id,
    name: costume.Name,
    icon: costume.Icon,
    type: "装扮部件",
    rank: transRank(costume.Rank),
  };
  convertData.push(res);
  Counter.Success();
}
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
logger.default.info(`[GachaB][Convert] 数据转换完成，耗时${Counter.getTime()}`);

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
