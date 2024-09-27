/**
 * @file core components calendar download.ts
 * @description 日历组件资源下载
 * @since 2.2.0
 */

import axios from "axios";
import fs from "fs-extra";

import { imgDir, jsonDetailDir, jsonDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheckObj } from "../../utils/fileCheck.ts";
import { getSnapDownloadUrl } from "../../utils/operGitRepo.ts";
import { readConfig } from "../../utils/readConfig.ts";

logger.init();
Counter.Init("[components][calendar][download]");
logger.default.info("[components][calendar][download] 运行 download.ts");

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

const amberConfig = readConfig("constant").amber;
const requestData = {
  amber: {
    json: `${amberConfig.api}chs/dailyDungeon`,
    img: `${amberConfig.site}assets/UI/{img}.png`,
    params: {
      vh: amberConfig.version,
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
  logger.default.error(e);
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
  logger.default.error(e);
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
  try {
    const res = await axios.get(value);
    await fs.writeJson(savePath, res.data, { spaces: 2 });
    logger.default.info(`[components][calendar][download] ${key} 数据下载完成`);
    Counter.Success();
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

logger.default.info("[components][calendar][download] download.ts 运行完成");
Counter.EndAll();
logger.console.info("[components][calendar][download] 请执行 convert.ts 进行数据转换");
