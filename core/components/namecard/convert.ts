/**
 * @file core/components/namecard/convert.ts
 * @description 名片组件数据转换
 * @since 2.3.0
 */

import path from "node:path";
import process from "node:process";

import fs from "fs-extra";
import sharp from "sharp";

import { imgDetailDir, imgDir, jsonDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";

logger.init();
Counter.Init("[components][namecard][convert]");
logger.default.info("[components][namecard][convert] 运行 convert.ts");

// 检测文件夹是否存在
fileCheckObj(imgDir);
fileCheckObj(jsonDir);
fileCheckObj(imgDetailDir);

// 检测源数据是否存在
if (!fileCheck(jsonDir.src, false)) {
  logger.default.error("[components][namecard][convert] 源数据不存在");
  logger.console.info("[components][namecard][convert] 请先运行 download.ts");
  process.exit(1);
}

// 处理 json 文件
logger.console.mark("[components][namecard][convert] 处理 json 文件");
const jsonFile: TGACore.Plugins.Amber.NameCardDetail[] = await fs.readJson(
  path.join(jsonDir.src, "namecard.json"),
);
const outData: TGACore.Components.Namecard.ConvertData[] = [];
jsonFile.forEach((item) => {
  const res = {
    id: item.id,
    name: item.name,
    type: getNamcardType(item.type),
    // 替换空格跟换行 xx\\nxx => xxxx
    desc: item.description.replace(/\\n/g, ""),
    source: item.source || "",
  };
  outData.push(res);
});
// 先按 type 排序，再按 index 排序
outData.sort((a, b) => a.type.localeCompare(b.type) || a.id - b.id);
await fs.writeJson(path.join(jsonDir.out, "app", "namecard.json"), outData);

// 处理图像文件
Counter.Reset();
logger.console.mark("[components][namecard][convert] 处理图像文件");
for (const item of jsonFile) {
  await Promise.allSettled([
    convertNameCard(item, "icon"),
    convertNameCard(item, "bg"),
    convertNameCard(item, "profile"),
  ]);
}
Counter.End();
logger.default.info(
  `[components][namecard][convert] 共处理 ${Counter.getTotal()} 张图像，耗时：${Counter.getTime()}`,
);
Counter.Output();

/**
 * @description 获取名片类型
 * @since 2.3.0
 * @param {string} type 名片类型
 * @return {number} 名片类型
 */
function getNamcardType(type: string): string {
  switch (type) {
    case "achievement":
      return "成就";
    case "battlePass":
      return "纪行";
    case "bond":
      return "好感";
    case "event":
      return "活动";
    case "other":
      return "其他";
    case "reputation":
      return "声望";
    default:
      return "未知";
  }
}

/**
 * @description 转换名片图像
 * @since 2.0.0
 * @param {TGACore.Components.Namecard.RawData} item 名片数据
 * @param {TGACore.Components.Namecard.ImageType} type 图像类型
 * @param {boolean} [force=false] 是否强制转换
 * @return {Promise<void>} 无返回值
 */
async function convertNameCard(
  item: TGACore.Plugins.Amber.NameCardDetail,
  type: TGACore.Components.Namecard.ImageType,
  force: boolean = false,
): Promise<void> {
  Counter.addTotal();
  // 210xxx => xxx
  const index = item.id % 1000;
  const oriPath = path.join(imgDir.src, type, `${index}.webp`);
  const savePath = path.join(imgDir.out, type, `${item.name}.webp`);
  const indexStr = index.toString().padStart(3, "0");
  if (!fileCheck(oriPath, false)) {
    logger.default.warn(
      `[components][namecard][convert] No.${indexStr} ${item.name} ${type} 原始图像不存在`,
    );
    logger.console.warn(`[components][namecard][convert] No.${indexStr} OriPath: ${oriPath}`);
    Counter.Fail();
    return;
  }
  if (fileCheck(savePath, false) && !force) {
    logger.console.mark(
      `[components][namecard][convert] No.${indexStr} ${item.name} ${type} 目标图像已存在，跳过`,
    );
    Counter.Skip();
    return;
  }
  switch (type) {
    case "icon":
      await sharp(oriPath).resize(250, 165).toFile(savePath);
      break;
    case "bg":
      await sharp(oriPath).resize(880, 140).toFile(savePath);
      break;
    case "profile":
      await sharp(oriPath).resize(840, 400).toFile(savePath);
      break;
  }
  logger.default.info(
    `[components][namecard][convert] No.${indexStr} ${item.name} ${type} 转换成功`,
  );
  Counter.Success();
}
