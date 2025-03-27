/**
 * @file core components namecard download
 * @description 名片组件资源下载
 * @since 2.1.1
 */

import path from "node:path";

import axios, { AxiosError } from "axios";
import fs from "fs-extra";
import sharp from "sharp";

import { imgDetailDir, imgDir, jsonDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";
import { readConfig } from "../../utils/readConfig.ts";

logger.init();
Counter.Init("[components][namecard][download]");
logger.default.info("[components][namecard][download] 运行 download.ts");

const honeyhunterConfig = readConfig("constant").honeyhunter;
const amberConfig = readConfig("constant").amber;

// 检测文件夹是否存在
fileCheckObj(imgDir);
fileCheckObj(jsonDir);
fileCheckObj(imgDetailDir);

// 下载名片
Counter.Reset();
logger.default.info("[components][namecard][download] 开始下载名片");
for (let i = 1; i <= honeyhunterConfig.namecard.endIndex; i++) {
  if (i <= 117) {
    await downloadOldImg(i);
  } else if (i >= 122) {
    await downloadNewImg(i);
  } else {
    const index = i.toString().padStart(3, "0");
    logger.console.mark(`[components][namecard][download] 不存在第 ${index} 张名片，跳过`);
  }
}
Counter.End();
logger.default.info(`[components][namecard][download] 名片下载完成，耗时：${Counter.getTime()}`);
Counter.Output();

// 获取原始数据
Counter.Reset();
logger.default.info("[components][namecard][download] 开始获取原始数据");
let nameCardsData: TGACore.Plugins.Amber.NameCardDetail[] = [];
try {
  const jsonRead = fs.readJSONSync(path.join(jsonDir.src, "namecard.json"), "utf-8");
  if (Array.isArray(jsonRead)) {
    nameCardsData = jsonRead.filter((item) =>
      Object.values(<TGACore.Plugins.Amber.NameCardDetail>item).every((value) => value !== ""),
    );
  }
} catch (err) {
  logger.default.error("[components][namecard][download] 获取原始数据失败，请检查 JSON 文件");
  logger.default.error(
    "[components][namecard][download] 文件路径：",
    path.join(jsonDir.src, "namecard.json"),
  );
  logger.default.error(err);
}
const nameCardSet = new Set(nameCardsData.map((item) => item.id % 1000));
for (let i = 1; i <= honeyhunterConfig.namecard.endIndex; i++) {
  const index = i.toString().padStart(3, "0");
  if (i > 33 && i < 38) {
    logger.console.mark(`[components][namecard][download] 第 ${index} 张名片跳过`);
    continue;
  }
  Counter.addTotal();
  if (nameCardSet.has(i)) {
    logger.console.mark(`[components][namecard][download] 第 ${index} 张名片原始数据已存在，跳过`);
    Counter.Skip();
    continue;
  }
  const nameCardData = await getNameCardData(i);
  if (typeof nameCardData !== "boolean") {
    nameCardsData.push(nameCardData);
    Counter.Success();
  } else {
    Counter.Fail();
  }
}
nameCardsData.filter((i) => typeof i === "object").sort((a, b) => a.id - b.id);
fs.writeJSONSync(path.join(jsonDir.src, "namecard.json"), nameCardsData, { spaces: 2 });
Counter.End();
logger.default.info(`[components][namecard][download] 数据获取完成，耗时：${Counter.getTime()}`);
Counter.Output();

Counter.EndAll();
logger.console.info("[components][namecard][download] 请执行 convert.ts 进行转换");

// 用到的函数

/**
 * @description 下载旧版名片
 * @since 2.0.0
 * @param {number} index 名片编号
 * @return {Promise<void>} 无返回值
 */
async function downloadOldImg(index: number): Promise<void> {
  const urlPrefix =
    honeyhunterConfig.url +
    honeyhunterConfig.namecard.prefix.old +
    index.toString().padStart(3, "0");
  await downloadImg(urlPrefix, index, "icon");
  await downloadImg(urlPrefix, index, "bg");
  await downloadImg(urlPrefix, index, "profile");
}

/**
 * @description 下载新版名片
 * @since 2.0.0
 * @param {number} index 名片编号
 * @return {Promise<void>} 无返回值
 */
async function downloadNewImg(index: number): Promise<void> {
  const urlPrefix =
    honeyhunterConfig.url +
    honeyhunterConfig.namecard.prefix.new +
    index.toString().padStart(3, "0");
  await downloadImg(urlPrefix, index, "icon");
  await downloadImg(urlPrefix, index, "bg");
  await downloadImg(urlPrefix, index, "profile");
}

/**
 * @description 下载名片图片
 * @since 2.0.0
 * @param {string} urlPrefix 名片图片前缀
 * @param {number} index 名片编号
 * @param {TGACore.Components.Namecard.ImageType} imgType 图片类型
 * @return {Promise<void>} 无返回值
 */
async function downloadImg(
  urlPrefix: string,
  index: number,
  imgType: TGACore.Components.Namecard.ImageType,
): Promise<void> {
  Counter.addTotal();
  const savePath = path.join(imgDetailDir[imgType].src, index.toString() + ".webp");
  const indexStr = index.toString().padStart(3, "0");
  if (fileCheck(savePath, false)) {
    logger.console.mark(
      `[components][namecard][download] 第 ${indexStr} 张名片 ${imgType} 已存在，跳过`,
    );
    Counter.Skip();
    return;
  }
  const url = urlPrefix + honeyhunterConfig.namecard.suffix[imgType];
  try {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    if (res.data.length === 2358) {
      logger.console.warn(
        `[components][namecard][download] 第 ${indexStr} 张名片 ${imgType} 不存在`,
      );
      Counter.Fail();
      return;
    }
    await sharp(<ArrayBuffer>res.data)
      .webp()
      .toFile(savePath);
    logger.default.info(
      `[components][namecard][download] 第 ${indexStr} 张名片 ${imgType} 下载成功`,
    );
    Counter.Success();
  } catch (err) {
    logger.default.error(
      `[components][namecard][download] 第 ${indexStr} 张名片 ${imgType} 下载失败`,
    );
    logger.default.error(`[components][namecard][download] URL：${url}`);
    logger.default.error(err);
    Counter.Fail();
  }
}

/**
 * @description 获取名片原始数据
 * @since 2.3.0
 * @param {number} index 名片编号
 * @return {Promise<TGACore.Plugins.Amber.NameCardDetail | boolean>} 名片原始数据
 */
async function getNameCardData(
  index: number,
): Promise<TGACore.Plugins.Amber.NameCardDetail | boolean> {
  const realIndex = 210000 + index;
  const url = `${amberConfig.api}CHS/namecard/${realIndex}?vh=${amberConfig.version}`;
  try {
    const resp = await fetch(url, {
      method: "GET",
      headers: { referer: amberConfig.site },
    });
    const res = (await resp.json()) as TGACore.Plugins.Amber.NameCardDetailResp;
    return res.data;
  } catch (err) {
    logger.default.error(`[components][namecard][download] 第 ${index} 张名片数据获取失败`);
    logger.default.error(`[components][namecard][download] URL：${url}`);
    if (err instanceof AxiosError) {
      logger.default.error(err.cause);
    } else {
      logger.default.error(err);
    }
    return false;
  }
}
