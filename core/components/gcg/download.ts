/**
 * @file core components gcg download.ts
 * @description GCG 组件资源下载
 * @since 2.0.0
 */

import path from "node:path";
import process from "node:process";

import axios from "axios";
import fs from "fs-extra";
import sharp from "sharp";

import { imgDir, jsonDetailDir, jsonDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";
import { readConfig } from "../../utils/readConfig.ts";

logger.init();
Counter.Init("[components][gcg][download]");
logger.default.info("[components][gcg][download] 运行 download.ts");

// 检测文件夹是否存在
fileCheckObj(imgDir);
fileCheckObj(jsonDir);

const amberVersion = readConfig(TGACore.Config.ConfigFileEnum.Constant).amber.version;
const requestData = {
  amber: {
    json: "https://api.ambr.top/v2/chs/gcg",
    img: "https://api.ambr.top/assets/UI/gcg/{img}.png",
    params: {
      vh: amberVersion,
    },
  },
  mys: {
    url: "https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/home/content/list",
    params: {
      app_sn: "ys_obc",
      channel_id: "231",
    },
  },
};

Counter.Reset(2);
logger.default.info("[components][gcg][download] 开始更新 JSON 数据");
// 下载 amber 数据
try {
  const res: TGACore.Plugins.Amber.ResponseGCG = await axios
    .get(requestData.amber.json, { params: requestData.amber.params })
    .then((res) => res.data);
  // 转成数组存到本地
  const amberData: TGACore.Plugins.Amber.GCG[] = [];
  Object.keys(res.data.items).forEach((id) => amberData.push(res.data.items[id]));
  await fs.writeJson(jsonDetailDir.amber, amberData, { spaces: 2 });
  Counter.Success();
  logger.default.info("[components][gcg][download] amber JSON 数据更新完成");
} catch (e) {
  logger.default.error("[components][gcg][download] amber JSON 数据更新失败");
  Counter.Fail();
}
// 下载 mys 数据
try {
  const resMG: TGACore.Plugins.Observe.ResponseWiki = await axios
    .get(requestData.mys.url, { params: requestData.mys.params })
    .then((res) => res.data);
  const mysData: TGACore.Plugins.Observe.WikiChildren[] = resMG.data.list[0].children;
  await fs.writeJson(jsonDetailDir.mys, mysData, { spaces: 2 });
  Counter.Success();
  logger.default.info("[components][gcg][download] mys JSON 数据更新完成");
} catch (e) {
  logger.default.error("[components][gcg][download] mys JSON 数据更新失败");
  Counter.Fail();
}
Counter.End();
logger.default.info("[components][gcg][download] JSON 数据更新完成");
Counter.Output();

// 下载图片
Counter.Reset();
logger.default.info("[components][gcg][download] 开始更新图片数据");
const amberJson: TGACore.Plugins.Amber.GCG[] = await fs.readJson(jsonDetailDir.amber);
const mysJson: TGACore.Plugins.Observe.WikiChildren[] = await fs.readJson(jsonDetailDir.mys);
// 处理 amber 数据，角色卡跟行动卡
Counter.addTotal(amberJson.length);
for (const item of amberJson) {
  const url = requestData.amber.img.replace("{img}", item.icon);
  const savePath = path.join(imgDir.src, `${item.name}.png`);
  if (fileCheck(savePath, false)) {
    logger.console.mark(`[components][gcg][download] ${item.name} 图片已存在，跳过`);
    Counter.Skip();
    continue;
  }
  let res;
  try {
    res = await axios.get(url, { responseType: "arraybuffer" });
  } catch (e) {
    logger.default.warn(`[components][gcg][download] ${item.name} 图片下载失败`);
    Counter.Fail();
    continue;
  }
  await sharp(<ArrayBuffer>res.data).toFile(savePath);
  logger.default.info(`[components][gcg][download] ${item.name} 图片下载完成`);
  Counter.Success();
}
// 处理 mys 数据，魔物卡

const findIndex = mysJson.findIndex((item) => item.name === "魔物牌");
if (findIndex === -1) {
  logger.default.error("[components][gcg][download] mys 数据中没有魔物牌");
  process.exit(1);
}
const monsterData: TGACore.Plugins.Observe.WikiItem[] = mysJson[findIndex].list;
Counter.addTotal(monsterData.length);
for (const item of monsterData) {
  const url = item.icon;
  const savePath = path.join(imgDir.src, `${item.title}.png`);
  if (fileCheck(savePath, false)) {
    logger.console.mark(`[components][gcg][download] ${item.title} 图片已存在，跳过`);
    Counter.Skip();
    continue;
  }
  let res;
  try {
    res = await axios.get(url, { responseType: "arraybuffer" });
  } catch (e) {
    logger.default.warn(`[components][gcg][download] ${item.title} 图片下载失败`);
    Counter.Fail();
    continue;
  }
  await sharp(<ArrayBuffer>res.data).toFile(savePath);
  logger.default.info(`[components][gcg][download] ${item.title} 图片下载完成`);
  Counter.Success();
}
Counter.End();
logger.default.info(`[components][gcg][download] 图片数据更新完成，耗时 ${Counter.getTime()}`);
Counter.Output();

logger.default.info("[components][gcg][download] 运行 download.ts 结束");
Counter.EndAll();
logger.console.info("[components][gcg][download] 请执行 convert.ts 转换数据");
