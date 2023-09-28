/**
 * @file core components namecard convert
 * @description 名片组件数据转换
 * @since 2.0.0
 */

import path from "node:path";
import process from "node:process";

import fs from "fs-extra";
import sharp from "sharp";

import { imgDir, jsonDir, imgDetailDir } from "./constant.ts";
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
const jsonFile: TGACore.Components.Namecard.RawData[] = await fs.readJson(
  path.join(jsonDir.src, "namecard.json"),
  {
    encoding: "utf-8",
  },
);
const outData: TGACore.Components.Namecard.ConvertData[] = [];
jsonFile.forEach((item) => {
  const res = {
    name: item.name,
    type: 0,
    desc: item.description,
    source: item.source,
    icon: `/source/nameCard/icon/${item.name}.webp`,
    bg: `/source/nameCard/bg/${item.name}.webp`,
    profile: `/source/nameCard/profile/${item.name}.webp`,
  };
  res.type = getNamcardType(item);
  outData.push(res);
});
outData.sort((a, b) => {
  // type
  if (a.type !== b.type) return a.type - b.type;
  // name
  return a.name.localeCompare(b.name);
});
await fs.writeJson(path.join(jsonDir.out, "namecard.json"), outData, { spaces: 2 });

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
logger.console.info(
  `[components][namecard][convert] 共处理 ${Counter.getTotal()} 张图像，耗时：${Counter.getTime()}`,
);
Counter.Output();

logger.console.info(
  "[components][namecard][convert] 名片数据转换完成，请执行 upload.ts 更新成就数据",
);

// 用到的函数

/**
 * @description 获取名片类型
 * @since 2.0.0
 * @param {TGACore.Components.Namecard.RawData} item 名片数据
 * @return {TGACore.Components.Namecard.NamecardType} 名片类型
 */
function getNamcardType(
  item: TGACore.Components.Namecard.RawData,
): TGACore.Components.Namecard.NamecardType {
  const sourceStr = item.source.toString();
  if (sourceStr.includes("成就")) {
    return TGACore.Components.Namecard.NamecardTypeEnum.achievement;
  } else if (sourceStr.includes("纪行")) {
    return TGACore.Components.Namecard.NamecardTypeEnum.journey;
  } else if (
    sourceStr.includes("活动") ||
    sourceStr.includes("庆典") ||
    sourceStr.includes("礼包")
  ) {
    return TGACore.Components.Namecard.NamecardTypeEnum.activity;
  } else if (sourceStr.includes("好感")) {
    return TGACore.Components.Namecard.NamecardTypeEnum.character;
  } else {
    return TGACore.Components.Namecard.NamecardTypeEnum.other;
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
  item: TGACore.Components.Namecard.RawData,
  type: TGACore.Components.Namecard.ImageType,
  force: boolean = false,
): Promise<void> {
  Counter.addTotal();
  const oriPath = path.join(imgDir.src, type, `${item.index}.webp`);
  const savePath = path.join(imgDir.out, type, `${item.name}.webp`);
  const indexStr = item.index.toString().padStart(3, "0");
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
