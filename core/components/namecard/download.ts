/**
 * @file core components namecard download
 * @description 名片组件资源下载
 * @since 2.1.1
 */

import path from "node:path";

import axios from "axios";
import { load } from "cheerio";
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
let nameCardsData: TGACore.Components.Namecard.RawData[] = [];
try {
  const jsonRead = fs.readJSONSync(path.join(jsonDir.src, "namecard.json"), "utf-8");
  if (Array.isArray(jsonRead)) {
    nameCardsData = jsonRead.filter((item) =>
      Object.values(<TGACore.Components.Namecard.RawData>item).every((value) => value !== ""),
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
const nameCardSet = new Set(nameCardsData.map((item) => item.index));
for (let i = 1; i <= honeyhunterConfig.namecard.endIndex; i++) {
  const index = i.toString().padStart(3, "0");
  if (i <= 117 || i >= 122) {
    Counter.addTotal();
    if (nameCardSet.has(i)) {
      logger.console.mark(
        `[components][namecard][download] 第 ${index} 张名片原始数据已存在，跳过`,
      );
      Counter.Skip();
    } else {
      const isOld = i <= 117;
      const nameCardData = await getNameCardData(i, isOld);
      if (typeof nameCardData !== "boolean") {
        if (nameCardData.name === "庆典·倾耳") {
          nameCardData.source = "「万籁协奏」礼包获取。";
        } else if (nameCardData.name === "塞索斯·跋灵") {
          nameCardData.name = nameCardData.name.replace("塞索斯", "赛索斯");
          nameCardData.source = nameCardData.source.replace("塞索斯", "赛索斯");
        }
        nameCardsData.push(nameCardData);
        Counter.Success();
      } else if (nameCardData) {
        logger.default.warn(`[components][namecard][download] 第 ${index} 张名片数据不完整`);
        Counter.Fail();
      } else {
        Counter.Fail();
      }
    }
  } else {
    logger.console.mark(`[components][namecard][download] 第 ${index} 张名片跳过`);
  }
}
nameCardsData.sort((a, b) => a.index - b.index);
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
 * @since 2.0.0
 * @param {number} index 名片编号
 * @param {boolean} isOld 是否为旧版名片
 * @return {Promise<TGACore.Components.Namecard.RawData | boolean>} 名片原始数据
 */
async function getNameCardData(
  index: number,
  isOld: boolean,
): Promise<TGACore.Components.Namecard.RawData | boolean> {
  let url;
  if (isOld) {
    url =
      honeyhunterConfig.url +
      honeyhunterConfig.namecard.prefix.old +
      index.toString().padStart(3, "0");
  } else {
    url =
      honeyhunterConfig.url +
      honeyhunterConfig.namecard.prefix.new +
      index.toString().padStart(3, "0");
  }
  try {
    const html = await axios.get(url, { params: { lang: "CHS" } });
    const tbSelector =
      "body > div.wp-site-blocks > div.wp-block-columns > div:nth-child(3) > div.entry-content.wp-block-post-content > table";
    const htmlDom = load(<string>html.data);
    const trsGet = htmlDom(tbSelector).find("tr");
    const namecard: TGACore.Components.Namecard.RawData = {
      index,
      name: "",
      description: "",
      source: "",
    };
    trsGet.each((index, element) => {
      isNaN(index);
      const tdsGet = htmlDom(element).find("td");
      if (tdsGet.length === 3 && htmlDom(tdsGet[1]).text().trim() === "Name") {
        namecard.name = htmlDom(tdsGet[2]).text().trim();
      }
      if (tdsGet.length === 2) {
        if (htmlDom(tdsGet[0]).text().trim().startsWith("Description")) {
          namecard.description = htmlDom(tdsGet[1]).text().trim();
        }
        if (htmlDom(tdsGet[0]).text().trim().startsWith("Item Source")) {
          namecard.source = htmlDom(tdsGet[1]).text().trim();
        }
      }
    });
    if (namecard.name === "？？？" || namecard.name === "") {
      return true;
    }
    logger.console.info(
      `[components][namecard][download] 第 ${index.toString().padStart(3, "0")} 张名片 ${
        namecard.name
      } 数据获取成功`,
    );
    return namecard;
  } catch (err) {
    logger.default.error(`[components][namecard][download] 第 ${index} 张名片数据获取失败`);
    logger.default.error(`[components][namecard][download] URL：${url}/?lang=CHS`);
    logger.default.error(err);
    return false;
  }
}
