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
  const type = getItemType(item.Type);
  if (type === item.Type) continue;
  if (type.startsWith("装扮")) {
    const nameStart = ["部件形录", "套装形录", "男性装扮", "女性装扮"];
    if (!nameStart.some((i) => item.Name.startsWith(i))) continue;
  }
  const res: TGACore.Components.Gacha.GachBMeta = {
    id: id,
    name: item.Name,
    icon: item.Icon,
    type: type,
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
 * @param {string} iconOri 图片路径
 * @param {string} name 名称
 * @return {Promise<void>}
 */
async function convertImg(iconOri: string, name: string): Promise<void> {
  let icon = iconOri;
  if (icon === "") {
    if (name === "套装形录·「橙叶苍藤」") icon = "UI_Beyd_Avatar_Optional_Suit_S0038";
    else if (name === "套装形录·「遨游远志」") icon = "UI_Beyd_Avatar_Optional_Suit_S0073";
    else {
      logger.default.warn(`[components][gachaB][convert] ${name} 图标为空，跳过`);
      Counter.Skip();
      return;
    }
  }
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

/**
 * 获取类型
 * @param typeStr - 类型
 * @returns 转换后的类型
 */
function getItemType(typeStr: string): string {
  const typeMap: Record<string, string> = {
    BEYOND_MATERIAL_COSTUME: "装扮部件",
    BEYOND_MATERIAL_COSTUME_DRAWING: "装扮形录",
    BEYOND_MATERIAL_POSE: "互动动作",
    BEYOND_MATERIAL_EMOJI: "互动表情",
    BEYOND_MATERIAL_COSTUME_SUIT: "装扮套装",
  };
  return typeMap[typeStr] ?? typeStr;
}
