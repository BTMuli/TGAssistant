/**
 * @file core components calendar download.ts
 * @description 日历组件资源下载
 * @since 2.0.0
 */

import process from "node:process";

import axios from "axios";
import fs from "fs-extra";
import sharp from "sharp";

import { imgDir, jsonDetailDir, jsonDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";
import {
  checkMetadata,
  getMetadata,
  getSnapDownloadUrl,
  updateMetadata,
} from "../../utils/operGitRepo.ts";
import { readConfig } from "../../utils/readConfig.ts";

logger.init();
Counter.Init("[components][calendar][download]");
logger.default.info("[components][calendar][download] 运行 download.ts");

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

const amberVersion = readConfig(TGACore.Config.ConfigFileEnum.Constant).amber.version;
const requestData = {
  amber: {
    json: "https://api.ambr.top/v2/chs/dailyDungeon",
    img: "https://api.ambr.top/assets/UI/{img}.png",
    params: {
      vh: amberVersion,
    },
  },
  mys: {
    url: "https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/home/content/list",
    params: {
      app_sn: "ys_obc",
      channel_id: "189",
    },
  },
};

Counter.Reset(5);
logger.default.info("[components][calendar][download] 开始更新 JSON 数据");

// 为避免重复下载，metadata 的获取放在最前面
const metadata = await getMetadata().catch((e) => {
  logger.default.error("[components][calendar][download] 获取元数据失败");
  logger.console.error(e);
  process.exit(1);
});

// 下载 amber 数据
try {
  const res: TGACore.Components.Calendar.RawAmber = await axios
    .get(requestData.amber.json, { params: requestData.amber.params })
    .then((res) => res.data);
  await fs.writeJson(jsonDetailDir.amber, res, { spaces: 2 });
  logger.default.info("[components][calendar][download] Amber.top 日历数据下载完成");
  Counter.Success();
} catch (e) {
  logger.default.error("[components][calendar][download] Amber.top 日历数据下载失败");
  Counter.Fail();
}

// 下载米游社数据
try {
  const res: TGACore.Plugins.Observe.ResponseWiki = await axios
    .get(requestData.mys.url, { params: requestData.mys.params })
    .then((res) => res.data);
  const mysData: TGACore.Plugins.Observe.WikiChildren[] = res.data.list[0].children;
  await fs.writeJson(jsonDetailDir.mys, mysData, { spaces: 2 });
  logger.default.info("[components][calendar][download] 米游社 日历数据下载完成");
  Counter.Success();
} catch (e) {
  logger.default.error("[components][calendar][download] 米游社 日历数据下载失败");
  Counter.Fail();
}

// 下载 metadata 数据
const urlRes = getSnapDownloadUrl("Avatar", "Weapon", "Material");
for (const [key, value] of urlRes) {
  let savePath: string;
  if (key === "Avatar") {
    savePath = jsonDetailDir.character;
  } else if (key === "Weapon") {
    savePath = jsonDetailDir.weapon;
  } else {
    savePath = jsonDetailDir.material;
  }
  if (checkMetadata(key, metadata) && fileCheck(savePath, false)) {
    logger.console.mark(`[components][calendar][download] ${key} 数据已存在，跳过`);
    Counter.Skip();
    continue;
  }
  try {
    const res = await axios.get(value);
    await fs.writeJson(savePath, res.data, { spaces: 2 });
    logger.default.info(`[components][calendar][download] ${key} 数据下载完成`);
    Counter.Success();
    await updateMetadata(key, metadata);
  } catch (e) {
    logger.default.error(`[components][calendar][download] ${key} 数据下载失败`);
    console.error(e);
    Counter.Fail();
  }
}
Counter.End();
logger.default.info(
  `[components][calendar][download] JSON 数据更新完成，耗时 ${Counter.getTime()}`,
);
Counter.Output();

// 下载图片数据
Counter.Reset();
logger.default.info("[components][calendar][download] 开始更新图片数据");
const amberJson: TGACore.Components.Calendar.RawAmber = await fs.readJson(jsonDetailDir.amber);
const amberReward = getReward(amberJson.data.sunday);
Counter.addTotal(amberReward.size);
for (const id of amberReward) {
  try {
    const savePath = `${imgDir.src}/${id}.png`;
    if (fileCheck(savePath, false)) {
      logger.console.mark(`[components][calendar][download] ${id} 已存在，跳过`);
      Counter.Skip();
      continue;
    }
    const url = requestData.amber.img.replace("{img}", `UI_ItemIcon_${id}`);
    const res = await axios.get(url, { responseType: "arraybuffer" });
    await sharp(<ArrayBuffer>res.data).toFile(savePath);
    logger.console.info(`[components][calendar][download] ${id} 下载完成`);
    Counter.Success();
  } catch (e) {
    logger.default.error(`[components][calendar][download] 图片 ${id} 下载失败`);
    Counter.Fail();
  }
}
Counter.End();
logger.default.info(`[components][calendar][download] 图片数据更新完成，耗时 ${Counter.getTime()}`);
Counter.Output();

logger.default.info("[components][calendar][download] download.ts 运行完成");
Counter.EndAll();
logger.console.info("[components][calendar][download] 请执行 convert.ts 进行数据转换");

// 用到的函数

/**
 * @description 转换 Amber.top 数据
 * @since 2.0.0
 * @param {Record<string, TGACore.Components.Calendar.RawAmberItem>} data Amber.top 数据
 * @return {Set<number>} 转换后的数据
 */
function getReward(data: Record<string, TGACore.Components.Calendar.RawAmberItem>): Set<number> {
  const result = new Set<number>();
  const materialConfig = readConfig(TGACore.Config.ConfigFileEnum.Material);
  materialConfig.material.forEach((item) => {
    result.add(item);
  });
  Object.values(data).forEach((item) => {
    item.reward.forEach((id) => {
      if (id > 100000) {
        result.add(id);
      }
    });
  });
  return result;
}
