/**
 * @file core components namecard download
 * @description 名片组件资源下载
 * @since 2.4.0
 */

import path from "node:path";

import axios, { AxiosError } from "axios";
import fs from "fs-extra";

import { imgDetailDir, imgDir, jsonDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";
import { readConfig } from "../../utils/readConfig.ts";
import process from "node:process";
import { getImageFileName } from "./utils.ts";

logger.init();
Counter.Init("[components][namecard][download]");
logger.default.info("[components][namecard][download] 运行 download.ts");

const amberConfig = readConfig("constant").amber;

// 检测文件夹是否存在
fileCheckObj(imgDir);
fileCheckObj(jsonDir);
fileCheckObj(imgDetailDir);

const listData: TGACore.Plugins.Amber.NameCard[] = [];
const nameCardsData: TGACore.Plugins.Amber.NameCardDetail[] = [];

// 下载列表数据
try {
  const link = `${amberConfig.api}CHS/namecard?vh=${amberConfig.version}`;
  const resp = await fetch(link, {
    method: "GET",
    headers: { referer: amberConfig.site },
  });
  const res = (await resp.json()) as TGACore.Plugins.Amber.NameCardListResp;
  Object.keys(res.data.items).forEach((id) => listData.push(res.data.items[id]));
  logger.default.info(`[components][namecard][download] 成功获取 ${listData.length} 条名片数据`);
} catch (err) {
  logger.default.error(`[components][namecard][download] 获取名片列表数据失败`);
  logger.default.error(err);
  Counter.Fail();
  process.exit(1);
}

// 获取详细数据
for (const namecard of listData) {
  const nameCardData = await getNameCardData(namecard.id);
  if (typeof nameCardData !== "boolean") {
    nameCardsData.push(nameCardData);
    logger.default.mark(`[components][namecard][download] 名片 ${nameCardData.id} 数据获取成功`);
    Counter.Success();
  } else {
    Counter.Fail();
  }
}
nameCardsData.filter((i) => typeof i === "object").sort((a, b) => a.id - b.id);
fs.writeJSONSync(path.join(jsonDir.src, "namecard.json"), nameCardsData, { spaces: 2 });
Counter.End();

// 下载名片
Counter.Reset(nameCardsData.length * 3);
logger.default.info("[components][namecard][download] 开始下载名片图片");
for (const namecard of nameCardsData) {
  const iconName = namecard.icon.split("_").pop();
  if (!iconName) {
    logger.default.error(`[components][namecard][download] 名片 ${namecard.id} 图标名称解析失败`);
    Counter.Fail(3);
    continue;
  }
  await downloadNameCard("icon", iconName);
  await downloadNameCard("bg", iconName);
  await downloadNameCard("profile", iconName);
}
Counter.End();

logger.default.info(`[components][namecard][download] 数据获取完成，耗时：${Counter.getTime()}`);
Counter.Output();

Counter.EndAll();
logger.console.info("[components][namecard][download] 请执行 convert.ts 进行转换");

/**
 * @description 下载名片图片
 * @since 2.4.0
 * @param {string} dir 目录类型，icon、bg 或 profile
 * @param {string} name 名片名称
 * @return {Promise<void>} 无返回值
 */
async function downloadNameCard(dir: string, name: string): Promise<void> {
  const fullName = getImageFileName(dir, name);
  let savePath: string | undefined;
  let assetsDir: string | undefined;
  switch (dir) {
    case "icon":
      savePath = path.join(imgDetailDir.icon.src, `${fullName}.png`);
      assetsDir = "NameCardIcon";
      break;
    case "bg":
      savePath = path.join(imgDetailDir.bg.src, `${fullName}.png`);
      assetsDir = "NameCardPicAlpha";
      break;
    case "profile":
      savePath = path.join(imgDetailDir.profile.src, `${fullName}.png`);
      assetsDir = "NameCardPic";
      break;
    default:
      logger.default.error(`[components][namecard][download] 未知目录：${dir}`);
      return;
  }
  if (fileCheck(savePath, false)) {
    logger.console.mark(`[components][namecard][download] 名片 ${fullName} 已存在，跳过`);
    Counter.Skip();
    return;
  }
  const url = `https://static.snapgenshin.cn/${assetsDir}/${fullName}.png`;
  try {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    // 如果大小小于1KB，则认为下载失败
    const size = Buffer.byteLength(res.data);
    if (size < 1024) {
      logger.default.error(`[components][namecard][download] 名片 ${fullName} 下载失败，文件过小`);
      logger.default.error(`[components][namecard][download] URL：${url}`);
      Counter.Fail();
      return;
    }
    await fs.writeFile(savePath, res.data);
    logger.default.mark(`[components][namecard][download] 名片 ${fullName} 下载成功`);
    Counter.Success();
  } catch (err) {
    logger.default.error(`[components][namecard][download] 名片 ${fullName} 下载失败`);
    logger.default.error(`[components][namecard][download] URL：${url}`);
    logger.default.error(err);
    Counter.Fail();
  }
}

/**
 * @description 获取名片原始数据
 * @since 2.4.0
 * @param {number} index 名片编号
 * @return {Promise<TGACore.Plugins.Amber.NameCardDetail | boolean>} 名片原始数据
 */
async function getNameCardData(
  index: string,
): Promise<TGACore.Plugins.Amber.NameCardDetail | boolean> {
  const url = `${amberConfig.api}CHS/namecard/${index}?vh=${amberConfig.version}`;
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
