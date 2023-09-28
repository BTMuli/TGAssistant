/**
 * @file core components character download.ts
 * @description 角色组件资源下载
 * @since 2.0.0
 */

import path from "node:path";

import axios from "axios";
import fs from "fs-extra";
import sharp from "sharp";

import { imgDir, jsonDir, jsonDetailDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";
import {
  checkMetadata,
  updateMetadata,
  getSnapDownloadUrl,
  getMetadata,
} from "../../utils/operGitRepo.ts";
import { readConfig } from "../../utils/readConfig.ts";

logger.init();
Counter.Init("[components][character][download]");
logger.default.info("[components][character][download] 运行 download.ts");

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

const amberVersion = readConfig(TGACore.Config.ConfigFileEnum.Constant).amber.version;
const requestData = {
  amber: {
    json: "https://api.ambr.top/v2/chs/avatar",
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
logger.default.info("[components][character][download] 开始更新 JSON 数据");
// 下载 amber 数据
try {
  const res: TGACore.Plugins.Amber.ResponseCharacter = await axios
    .get(requestData.amber.json, { params: requestData.amber.params })
    .then((res) => res.data);
  // 转成数组存到本地
  const amberData: TGACore.Plugins.Amber.Character[] = [];
  Object.keys(res.data.items).forEach((id) => amberData.push(res.data.items[id]));
  await fs.writeJson(jsonDetailDir.amber, amberData, { spaces: 2 });
  logger.default.info("[components][character][download] Amber.top 角色数据下载完成");
  Counter.Success();
} catch (e) {
  logger.default.error("[components][character][download] 下载 Amber.top 角色数据失败");
  Counter.Fail();
}
// 下载 mys 数据
try {
  const res: TGACore.Plugins.Observe.ResponseWiki = await axios
    .get(requestData.mys.url, { params: requestData.mys.params })
    .then((res) => res.data);
  const mysData: TGACore.Plugins.Observe.WikiItem[] =
    res.data.list[0].children.find((item) => item.name === "角色")?.list ?? [];
  if (mysData.length === 0) {
    logger.default.warn("[components][character][download] 观测枢 角色数据为空");
    Counter.Fail();
  } else {
    await fs.writeJson(jsonDetailDir.mys, mysData, { spaces: 2 });
    logger.default.info("[components][character][download] 观测枢 角色数据下载完成");
    Counter.Success();
  }
} catch (e) {
  logger.default.warn("[components][character][download] 下载 观测枢 角色数据失败");
  Counter.Fail();
}
// 下载 metadata 数据
try {
  const metadata = await getMetadata();
  const url = getSnapDownloadUrl("Avatar");
  if (checkMetadata("Avatar", metadata) && fileCheck(jsonDetailDir.hutao, false)) {
    logger.default.mark("[components][character][download] Avatar 数据已存在，跳过");
    Counter.Skip();
  } else {
    const res = await axios.get(url);
    await fs.writeJSON(jsonDetailDir.hutao, res.data, { spaces: 2 });
    logger.default.info("[components][character][download] Avatar 数据下载完成");
    Counter.Success();
    await updateMetadata("Avatar", metadata);
  }
} catch (e) {
  logger.default.warn("[components][character][download] 下载 Avatar 数据失败");
  Counter.Fail();
}
Counter.End();
logger.default.info(`[components][character][download] 数据更新完成，耗时 ${Counter.getTime()}`);
Counter.Output();

// 下载图片数据
Counter.Reset();
logger.console.info("[components][character][download] 开始下载图片数据");

const amberJson: TGACore.Plugins.Amber.Character[] = await fs.readJson(jsonDetailDir.amber);
Counter.addTotal(amberJson.length);
for (const item of amberJson) {
  const url = requestData.amber.img.replace("{img}", item.icon);
  const savePath = path.join(imgDir.src, `${item.id}.png`);
  const element = getAmberElement(item.element);
  if (isNaN(item.id)) {
    logger.console.warn(
      `[components][character][download] ${item.id} ${item.name}·${element} Icon 编号异常，跳过`,
    );
    Counter.Skip();
    continue;
  }
  if (fileCheck(savePath, false)) {
    logger.console.mark(
      `[components][character][download] ${item.id} ${item.name}·${element} Icon 已存在，跳过`,
    );
    Counter.Skip();
    continue;
  }
  let res;
  try {
    res = await axios.get(url, { responseType: "arraybuffer" });
  } catch (e) {
    logger.default.warn(
      `[components][character][download] ${item.id} ${item.name}·${element} Icon 下载失败`,
    );
    Counter.Fail();
    continue;
  }
  await sharp(res.data).toFile(savePath);
  logger.console.info(
    `[components][character][download] ${item.id} ${item.name}·${element} Icon 下载完成`,
  );
  Counter.Success();
}

Counter.End();
logger.default.info(`[components][character][download] 图片下载完成，耗时 ${Counter.getTime()}`);
Counter.Output();

logger.default.info("[components][character][download] download.ts 运行结束");
Counter.EndAll();
logger.console.info("[components][character][download] 请执行 convert.ts 转换图片");

// 用到的函数

/**
 * @description 获取 Amber.top 角色元素
 * @since 2.0.0
 * @param {TGACore.Plugins.Amber.ElementType} element 元素类型
 * @return {TGACore.Constant.ElementType} 元素类型
 */
function getAmberElement(element: TGACore.Plugins.Amber.ElementType): TGACore.Constant.ElementType {
  switch (element) {
    case TGACore.Plugins.Amber.ElementType.anemo:
      return TGACore.Constant.ElementType.anemo;
    case TGACore.Plugins.Amber.ElementType.geo:
      return TGACore.Constant.ElementType.geo;
    case TGACore.Plugins.Amber.ElementType.electro:
      return TGACore.Constant.ElementType.electro;
    case TGACore.Plugins.Amber.ElementType.hydro:
      return TGACore.Constant.ElementType.hydro;
    case TGACore.Plugins.Amber.ElementType.pyro:
      return TGACore.Constant.ElementType.pyro;
    case TGACore.Plugins.Amber.ElementType.cryo:
      return TGACore.Constant.ElementType.cryo;
    case TGACore.Plugins.Amber.ElementType.dendro:
      return TGACore.Constant.ElementType.dendro;
  }
}
