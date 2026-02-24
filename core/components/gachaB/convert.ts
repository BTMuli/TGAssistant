/**
 * 千星奇域资源转换脚本
 * @since 2.5.0
 */

import path from "node:path";

import hutaoTool from "@hutao/hutao.ts";
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
if (!fileCheck(jsonDetailDir.obc)) {
  logger.default.error(`[components][gachaB][convert] 物品数据文件不存在`);
  logger.console.info(`[components][gachaB][convert] 请执行 download.ts`);
  process.exit(1);
}

const rawHutao = hutaoTool.read<TGACore.Plugins.Hutao.Beyond.RawBeyondItem>(
  hutaoTool.enum.file.Beyond,
);
// const rawMys: Array<TGACore.Plugins.Mys.WikiItem> = await fs.readJSON(jsonDetailDir.obc);
const convertData: Array<TGACore.Components.Gacha.GachBMeta> = [];

// 处理部件数据 TODO：表情&动作需要额外处理
for (const item of rawHutao) {
  const type = getItemType(item.Type);
  if (Number(type) === item.Type) continue;
  if (type.startsWith("装扮")) {
    const nameStart = ["部件形录", "套装形录", "男性装扮", "女性装扮"];
    if (!nameStart.some((i) => item.Name.startsWith(i))) continue;
  } else {
    if (item.Icon === undefined) continue;
  }
  let icon = item.Icon;
  if (icon === undefined && item.Id.toString().startsWith("27")) {
    const iId = item.Id - 10000;
    const iFind = rawHutao.find((i) => i.Id === iId);
    if (iFind) {
      if (item.Name.startsWith("部件形录")) {
        icon = iFind.Icon;
      } else {
        icon = iFind.Icon?.replace("Girl", "Optional");
      }
    } else logger.console.warn(`[components][gachaB][convert] 未找到${item.Id} ${item.Name}的图标`);
  }
  const res: TGACore.Components.Gacha.GachBMeta = {
    id: item.Id.toString(),
    name: item.Name,
    icon: icon ?? "",
    type: type,
    rank: item.RankLevel,
  };
  convertData.push(res);
}
Counter.End();
convertData.sort((a, b) => Number(a.id) - Number(b.id));
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
  const icon = iconOri;
  if (icon === "") {
    logger.default.warn(`[components][gachaB][convert] ${name} 图标为空，跳过`);
    Counter.Skip();
    return;
  }
  const oriPath = path.join(imgDir.src, `${icon}.png`);
  const savePath = path.join(imgDir.out, `${icon}.webp`);
  if (!fileCheck(oriPath, false)) {
    logger.default.mark(`[components][gachaB][convert] ${name} ${icon}.png 不存在`);
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
 * @param typeNum - 类型
 * @returns 转换后的类型
 */
function getItemType(typeNum: number): string {
  const typeMap: Record<string, string> = {
    1: "装扮部件",
    2: "装扮套装",
    3: "装扮形录",
    6: "互动动作",
    5: "互动表情",
  };
  return typeMap[typeNum] ?? typeNum;
}
