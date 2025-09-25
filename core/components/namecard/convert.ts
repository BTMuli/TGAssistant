/**
 * @file core/components/namecard/convert.ts
 * @description 名片组件数据转换
 * @since 2.4.0
 */

import path from "node:path";
import process from "node:process";

import hutaoTool from "@hutao/hutao.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import fs from "fs-extra";
import sharp from "sharp";

import { imgDetailDir, imgDir, jsonDir } from "./constant.ts";

logger.init();
Counter.Init("[components][namecard][convert]");
logger.default.info("[components][namecard][convert] 运行 convert.ts");

// 检测文件夹是否存在
fileCheckObj(imgDir);
fileCheckObj(jsonDir);
fileCheckObj(imgDetailDir);

// 检测源数据是否存在
if (!fileCheck(jsonDir.src, false) || !hutaoTool.check(hutaoTool.enum.file.NameCard)) {
  logger.default.error("[components][namecard][convert] 源数据不存在");
  logger.console.info("[components][namecard][convert] 请先运行 download.ts");
  process.exit(1);
}

// 处理 json 文件
logger.console.info("[components][namecard][convert] 处理 json 文件");
const rawNameCard = hutaoTool.read<TGACore.Plugins.Hutao.NameCard.RawNameCard>(
  hutaoTool.enum.file.NameCard,
);
const yattaJson: Array<TGACore.Plugins.Yatta.NameCard.NameCardDetail> = await fs.readJson(
  path.join(jsonDir.src, "namecard.json"),
);
const outData: Array<TGACore.Components.Namecard.WikiItem> = [];
for (const raw of rawNameCard) {
  const yattaFind = yattaJson.find((item) => item.id === raw.Id);
  if (!yattaFind) {
    logger.default.warn(`[components][namecard][convert] 名片 ${raw.Name} 在 Yatta 数据中未找到`);
    continue;
  }
  const res: TGACore.Components.Namecard.WikiItem = {
    id: raw.Id,
    name: raw.Name,
    type: getNamcardType(yattaFind.type),
    desc: raw.Description.replace(/\n/g, "").trim(),
    source: yattaFind.source ?? "",
  };
  outData.push(res);
}
// 先按 type 排序，再按 index 排序
outData.sort((a, b) => a.type.localeCompare(b.type) || a.id - b.id);
// 写入文件
await fs.writeJson(path.join(jsonDir.out, "app", "namecard.json"), outData);
logger.default.info(`[components][namecard][convert] 共处理 ${outData.length} 条名片数据`);

// 处理图像文件
Counter.Reset(rawNameCard.length * 3);
logger.console.mark("[components][namecard][convert] 处理图像文件");
for (const raw of rawNameCard) {
  await Promise.allSettled([
    convertNameCard(raw, "icon"),
    convertNameCard(raw, "bg"),
    convertNameCard(raw, "profile"),
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
 * @function getNamcardType
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
 * @since 2.4.0
 * @function convertNameCard
 * @param {TGACore.Plugins.Hutao.NameCard.NameCard} item 名片数据
 * @param {TGACore.Components.Namecard.ImageType} type 图像类型
 * @return {Promise<void>} 无返回值
 */
async function convertNameCard(
  item: TGACore.Plugins.Hutao.NameCard.NameCard,
  type: TGACore.Components.Namecard.ImageType,
): Promise<void> {
  let oriPath: string | undefined;
  let savePath: string | undefined;
  switch (type) {
    case "icon":
      oriPath = path.join(imgDetailDir.icon.src, `${item.Icon}.png`);
      savePath = path.join(imgDetailDir.icon.out, `${item.Name}.webp`);
      break;
    case "bg":
      oriPath = path.join(imgDetailDir.bg.src, `${item.Icon}.png`);
      savePath = path.join(imgDetailDir.bg.out, `${item.Name}.webp`);
      break;
    case "profile":
      oriPath = path.join(imgDetailDir.profile.src, `${item.Icon}.png`);
      savePath = path.join(imgDetailDir.profile.out, `${item.Name}.webp`);
      break;
  }
  if (type === "bg" && item.Pictures[1] === "") {
    logger.default.mark(
      `[components][namecard][convert] ${item.Name} ${type} 无背景图像，跳过转换`,
    );
    Counter.Skip();
    return;
  }
  if (!fileCheck(oriPath, false)) {
    logger.default.warn(`[components][namecard][convert] ${item.Name} ${type} 原始图像不存在`);
    logger.console.warn(`[components][namecard][convert] OriPath: ${oriPath}`);
    Counter.Fail();
    return;
  }
  if (fileCheck(savePath, false)) {
    logger.console.mark(
      `[components][namecard][convert] ${item.Name} ${type} 目标图像已存在，跳过`,
    );
    Counter.Skip();
    return;
  }
  try {
    switch (type) {
      case "icon":
        await sharp(oriPath)
          .resize(256, 256, { fit: "cover" })
          .extract({ left: 13, top: 53, width: 230, height: 150 })
          .toFormat("webp")
          .toFile(savePath);
        break;
      case "bg":
        await sharp(oriPath).resize(1024, 140).toFormat("webp").toFile(savePath);
        break;
      case "profile":
        await sharp(oriPath).resize(840, 400).toFormat("webp").toFile(savePath);
        break;
    }
  } catch (e) {
    console.error(e);
    logger.default.error(`[components][namecard][convert] ${item.Name} ${type} 转换失败`);
    logger.default.error(oriPath);
    Counter.Fail();
    return;
  }
  logger.default.mark(`[components][namecard][convert] ${item.Name} ${type} 转换成功`);
  Counter.Success();
}
