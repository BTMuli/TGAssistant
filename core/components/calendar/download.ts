/**
 * @file core components calendar download.ts
 * @description 日历组件资源下载
 * @since 2.2.1
 */

import axios from "axios";
import fs from "fs-extra";

import { imgDir, jsonDetailDir, jsonDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheckObj } from "../../utils/fileCheck.ts";
import { getSnapAvatarDownloadUrl, getSnapDownloadUrl } from "../../utils/operGitRepo.ts";
import { readConfig } from "../../utils/readConfig.ts";
import path from "node:path";

logger.init();
Counter.Init("[components][calendar][download]");
logger.default.info("[components][calendar][download] 运行 download.ts");

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

const amberConfig = readConfig("constant").amber;
const requestData = {
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
    .get(`${amberConfig.api}chs/dailyDungeon`, { params: { vh: amberConfig.version } })
    .then((res) => res.data);
  await fs.writeJson(jsonDetailDir.amber, res, { spaces: 2 });
  logger.default.info("[components][calendar][download] Amber.top 日历数据下载完成");
  Counter.Success();
} catch (e) {
  logger.default.error("[components][calendar][download] Amber.top 日历数据下载失败");
  logger.default.error(e);
  Counter.Fail();
}
try {
  const res: TGACore.Plugins.Amber.ResponseCharacter = await axios
    .get(`${amberConfig.api}chs/avatar`, { params: { vh: amberConfig.version } })
    .then((res) => res.data);
  const amberData: TGACore.Plugins.Amber.Character[] = [];
  Object.keys(res.data.items).forEach((id) => amberData.push(res.data.items[id]));
  await fs.writeJson(jsonDetailDir.amberC, amberData, { spaces: 2 });
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
const amberJson: TGACore.Plugins.Amber.Character[] = await fs.readJson(jsonDetailDir.amberC);
const idList: number[] = [];
amberJson.forEach((i) => {
  if (!isNaN(Number(i.id))) idList.push(Number(i.id));
});
const urlAvatars = getSnapAvatarDownloadUrl(idList);
Counter.addTotal(idList.length);
for (const url of urlAvatars) {
  const fileName = url.split("/").pop();
  if (fileName === undefined) {
    logger.default.error(`[components][calendar][download] 角色文件名获取失败: ${url}`);
    Counter.Fail();
    continue;
  }
  const savePath = path.join(jsonDir.src, fileName);
  if (fs.existsSync(savePath)) {
    logger.console.mark(`[components][calendar][download] 角色${savePath}数据已存在，跳过`);
    Counter.Skip();
    continue;
  }
  try {
    const res = await axios.get(url);
    await fs.writeJson(savePath, res.data, { spaces: 2 });
    logger.default.info(`[components][calendar][download] 角色${fileName}数据下载完成`);
    Counter.Success();
  } catch (e) {
    logger.default.warn(`[components][calendar][download] 角色${fileName}数据下载失败`);
    logger.default.error(e);
    Counter.Fail();
  }
}

const urlRes = getSnapDownloadUrl("Weapon", "Material");
for (const [key, value] of urlRes) {
  let savePath: string;
  if (key === "Weapon") savePath = jsonDetailDir.weapon;
  else savePath = jsonDetailDir.material;
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
