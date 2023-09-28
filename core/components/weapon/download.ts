/**
 * @file core components weapon download.ts
 * @description 武器组件资源下载
 * @since 2.0.0
 */

import path from "node:path";

import axios from "axios";
import fs from "fs-extra";
import sharp from "sharp";

import { jsonDir, imgDir, jsonDetailDir } from "./constant.ts";
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
Counter.Init("[components][weapon][download]");
logger.default.info("[components][weapon][download] 运行 download.ts");

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

const amberVersion = readConfig(TGACore.Config.ConfigFileEnum.Constant).amber.version;
const requestData = {
  amber: {
    json: "https://api.ambr.top/v2/chs/weapon",
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

Counter.Reset(3);
logger.default.info("[components][weapon][download] 开始更新 JSON 数据");
// 下载 amber 数据
try {
  const res: TGACore.Plugins.Amber.ResponseWeapon = await axios
    .get(requestData.amber.json, { params: requestData.amber.params })
    .then((res) => res.data);
  // 转成数组存到本地
  const amberData: TGACore.Plugins.Amber.Weapon[] = [];
  Object.keys(res.data.items).forEach((id) => amberData.push(res.data.items[id]));
  await fs.writeJson(jsonDetailDir.amber, amberData, { spaces: 2 });
  logger.default.info("[components][weapon][download] Amber.top 武器数据下载完成");
  Counter.Success();
} catch (e) {
  logger.default.error("[components][weapon][download] Amber.top 武器数据下载失败");
  Counter.Fail();
}
// 下载 mys 数据
try {
  const res: TGACore.Plugins.Observe.ResponseWiki = await axios
    .get(requestData.mys.url, { params: requestData.mys.params })
    .then((res) => res.data);
  const mysData: TGACore.Plugins.Observe.WikiItem[] =
    res.data.list[0].children.find((item) => item.name === "武器")?.list ?? [];
  if (mysData.length === 0) {
    logger.default.warn("[components][weapon][download] 观测枢 武器数据为空");
    Counter.Fail();
  } else {
    await fs.writeJson(jsonDetailDir.mys, mysData, { spaces: 2 });
    logger.default.info("[components][weapon][download] 观测枢 武器数据下载完成");
    Counter.Success();
  }
} catch (e) {
  logger.default.warn("[components][weapon][download] 观测枢 武器数据下载失败");
  Counter.Fail();
}
// 下载 metadata 数据
try {
  const metadata = await getMetadata();
  const url = getSnapDownloadUrl("Weapon");
  if (checkMetadata("Weapon", metadata) && fileCheck(jsonDetailDir.hutao, false)) {
    logger.default.mark("[components][weapon][download] Weapon 数据已存在，跳过");
    Counter.Skip();
  } else {
    const res = await axios.get(url);
    await fs.writeJson(jsonDetailDir.hutao, res.data, { spaces: 2 });
    logger.default.info("[components][weapon][download] Weapon 数据下载完成");
    Counter.Success();
    await updateMetadata("Weapon", metadata);
  }
} catch (e) {
  logger.default.warn("[components][weapon][download] Weapon 数据下载失败");
  Counter.Fail();
}
Counter.End();
logger.default.info(`[components][weapon][download] 数据更新完成，耗时 ${Counter.getTime()}`);
Counter.Output();

// 下载图片数据
Counter.Reset();
logger.console.info("[components][weapon][download] 开始下载图片数据");

const amberJson: TGACore.Plugins.Amber.Weapon[] = await fs.readJson(jsonDetailDir.amber);
Counter.addTotal(amberJson.length);
for (const item of amberJson) {
  const url = requestData.amber.img.replace("{img}", item.icon);
  const savePath = path.join(imgDir.src, `${item.id}.png`);
  const weapon = getAmberWeapon(item.type);
  if (fileCheck(savePath, false)) {
    logger.console.mark(`[components][weapon][download] ${weapon} ${item.name} 图片已存在，跳过`);
    Counter.Skip();
    continue;
  }
  let res;
  try {
    res = await axios.get(url, { responseType: "arraybuffer" });
  } catch (e) {
    logger.console.warn(`[components][weapon][download] ${weapon} ${item.name} 图片下载失败`);
    Counter.Fail();
    continue;
  }
  await sharp(res.data).toFile(savePath);
  logger.console.info(`[components][weapon][download] ${weapon} ${item.name} 图片下载完成`);
  Counter.Success();
}
Counter.End();
logger.default.info(`[components][weapon][download] 图片下载完成，耗时 ${Counter.getTime()}`);
Counter.Output();

logger.default.info("[components][weapon][download] download.ts 运行结束");
Counter.EndAll();
logger.console.info("[components][weapon][download] 请执行 convert.ts 进行转换");

// 用到的函数

/**
 * @description 获取 amber 武器类型
 * @since 2.0.0
 * @param {TGACore.Plugins.Amber.WeaponType} type 武器类型
 * @return {TGACore.Constant.WeaponType} 武器类型
 */
function getAmberWeapon(type: TGACore.Plugins.Amber.WeaponType): TGACore.Constant.WeaponType {
  switch (type) {
    case TGACore.Plugins.Amber.WeaponType.sword:
      return TGACore.Constant.WeaponType.sword;
    case TGACore.Plugins.Amber.WeaponType.claymore:
      return TGACore.Constant.WeaponType.claymore;
    case TGACore.Plugins.Amber.WeaponType.pole:
      return TGACore.Constant.WeaponType.pole;
    case TGACore.Plugins.Amber.WeaponType.bow:
      return TGACore.Constant.WeaponType.bow;
    case TGACore.Plugins.Amber.WeaponType.catalyst:
      return TGACore.Constant.WeaponType.catalyst;
  }
}
