/**
 * @file core components namecard download
 * @description 名片组件资源下载
 * @since 2.4.0
 */

import path from "node:path";
import process from "node:process";

import hutaoTool from "@hutao/hutao.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import fecthSgBuffer from "@utils/fetchSgBuffer.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import yattaTool from "@yatta/yatta.ts";
import fs from "fs-extra";
import sharp from "sharp";

import { imgDetailDir, imgDir, jsonDir } from "./constant.ts";

logger.init();
Counter.Init("[components][namecard][download]");
logger.default.info("[components][namecard][download] 运行 download.ts");

// 检测文件夹是否存在
fileCheckObj(imgDir);
fileCheckObj(jsonDir);
fileCheckObj(imgDetailDir);

// 下载 Metadata 数据
logger.default.info("[components][namecard][download] 开始更新 JSON 数据");
const meta = await hutaoTool.sync();
try {
  await hutaoTool.update(meta, hutaoTool.enum.file.NameCard);
} catch (e) {
  logger.default.error("[components][namecard][download] 下载 Snap.Metadata 名片数据失败");
  logger.console.error(`[components][namecard][download] ${e}`);
  process.exit(1);
}

logger.default.info("[components][namecard][download] 开始下载详细数据");
const nameCardRaw = hutaoTool.read<TGACore.Plugins.Hutao.NameCard.RawNameCard>(
  hutaoTool.enum.file.NameCard,
);
Counter.Reset(nameCardRaw.length);
const nameCardsData: Array<TGACore.Plugins.Yatta.NameCard.NameCardDetail> = [];
for (const raw of nameCardRaw) {
  try {
    const res = await yattaTool.fetchJson<TGACore.Plugins.Yatta.NameCard.DetailResponse>(
      `CHS/namecard/${raw.Id}`,
    );
    nameCardsData.push(res.data);
    logger.console.mark(`[components][namecard][download] ${raw.Id} 数据获取成功`);
    Counter.Success();
  } catch (e) {
    logger.default.error(`[components][namecard][download] ${raw.Id} 数据获取失败`);
    logger.default.error(e);
    Counter.Fail();
  }
}
nameCardsData.sort((a, b) => a.id - b.id);
fs.writeJSONSync(path.join(jsonDir.src, "namecard.json"), nameCardsData, { spaces: 2 });
Counter.End();

// 下载名片
Counter.Reset(nameCardRaw.length * 3);
logger.default.info("[components][namecard][download] 开始下载名片图片");
for (const raw of nameCardRaw) {
  try {
    const iconName = `${raw.Icon}.png`;
    const savePath = path.join(imgDetailDir.icon.src, iconName);
    if (fileCheck(savePath, false)) {
      logger.console.mark(`[components][namecard][download][icon] ${raw.Id} 已存在，跳过`);
      Counter.Skip();
    } else {
      const iconBuffer = await fecthSgBuffer("NameCardIcon", iconName);
      await sharp(iconBuffer).png().toFile(savePath);
      logger.default.info(`[components][namecard][download][icon] ${raw.Id} 下载成功`);
      Counter.Success();
    }
  } catch (e) {
    logger.default.error(`[components][namecard][download][icon] ${raw.Id} 下载失败`);
    logger.default.error(e);
    Counter.Fail();
  }
  try {
    if (raw.Pictures[1] === "") {
      logger.console.mark(`[components][namecard][download][bg] ${raw.Id} 为空，跳过`);
      Counter.Skip();
    } else {
      const bgName = `${raw.Pictures[1]}.png`;
      const savePath = path.join(imgDetailDir.bg.src, `${raw.Icon}.png`);
      if (fileCheck(savePath, false)) {
        logger.console.mark(`[components][namecard][download][bg] ${raw.Id} 已存在，跳过`);
        Counter.Skip();
      } else {
        const bgBuffer = await fecthSgBuffer("NameCardPicAlpha", bgName);
        await sharp(bgBuffer).png().toFile(savePath);
        logger.default.info(`[components][namecard][download][bg] ${raw.Id} 下载成功`);
        Counter.Success();
      }
    }
  } catch (e) {
    logger.default.error(`[components][namecard][download][bg] ${raw.Id} 下载失败`);
    logger.default.error(e);
    Counter.Fail();
  }
  try {
    const profileName = `${raw.Pictures[2]}.png`;
    const savePath = path.join(imgDetailDir.profile.src, `${raw.Icon}.png`);
    if (fileCheck(savePath, false)) {
      logger.console.mark(`[components][namecard][download][profile] ${raw.Id} 已存在，跳过`);
      Counter.Skip();
    } else {
      const profileBuffer = await fecthSgBuffer("NameCardPic", profileName);
      await sharp(profileBuffer).png().toFile(savePath);
      logger.default.info(`[components][namecard][download][profile] ${raw.Id} 下载成功`);
      Counter.Success();
    }
  } catch (e) {
    logger.default.error(`[components][namecard][download][profile] ${raw.Id} 下载失败`);
    logger.default.error(e);
    Counter.Fail();
  }
}
Counter.End();

logger.default.info(`[components][namecard][download] 数据获取完成，耗时：${Counter.getTime()}`);
Counter.Output();

Counter.EndAll();
logger.console.info("[components][namecard][download] 请执行 convert.ts 进行转换");
