/**
 * @file core components character download.ts
 * @description 角色组件资源下载
 * @since 2.2.0
 */

import path from "node:path";

import axios, { AxiosError } from "axios";
import fs from "fs-extra";
import sharp from "sharp";

import { imgDir, jsonDetailDir, jsonDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";
import { getSnapAvatarDownloadUrl } from "../../utils/operGitRepo.ts";
import { readConfig } from "../../utils/readConfig.ts";

logger.init();
Counter.Init("[components][character][download]");
logger.default.info("[components][character][download] 运行 download.ts");

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

const amberConfig = readConfig("constant").amber;

Counter.Reset(3);
logger.default.info("[components][character][download] 开始更新 JSON 数据");
// 下载 amber 数据
try {
  const res: TGACore.Plugins.Amber.ResponseCharacter = await axios
    .get(`${amberConfig.api}chs/avatar`, { params: { vh: amberConfig.version } })
    .then((res) => res.data);
  // 转成数组存到本地
  const amberData: TGACore.Plugins.Amber.Character[] = [];
  Object.keys(res.data.items).forEach((id) => amberData.push(res.data.items[id]));
  await fs.writeJson(jsonDetailDir.amber, amberData, { spaces: 2 });
  logger.default.info("[components][character][download] Amber.top 角色数据下载完成");
  Counter.Success();
} catch (e) {
  logger.default.error("[components][character][download] 下载 Amber.top 角色数据失败");
  logger.default.error(e);
  Counter.Fail();
}
// 下载 mys 数据
try {
  const res: TGACore.Plugins.Observe.ResponseWiki = await axios
    .get("https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/home/content/list", {
      params: { app_sn: "ys_obc", channel_id: "189" },
    })
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
  logger.default.error(e);
  Counter.Fail();
}
const amberJson: TGACore.Plugins.Amber.Character[] = await fs.readJson(jsonDetailDir.amber);
const idList: number[] = [];
amberJson.forEach((i) => {
  if (!isNaN(Number(i.id))) idList.push(Number(i.id));
});
const urlRes = getSnapAvatarDownloadUrl(idList);
Counter.addTotal(idList.length);
for (const url of urlRes) {
  const fileName = url.split("/").pop();
  if (fileName === undefined) {
    logger.default.error(`[components][wikiAvatar][download] 文件名获取失败: ${url}`);
    Counter.Fail();
    continue;
  }
  const savePath = path.join(jsonDir.src, fileName);
  if (fs.existsSync(savePath)) {
    logger.console.mark(`[components][character][download] 角色${savePath}数据已存在，跳过下载`);
    Counter.Skip();
    continue;
  }
  try {
    const res = await axios.get(url);
    await fs.writeJSON(savePath, res.data, { spaces: 2 });
    logger.default.info(`[components][character][download] 角色${fileName}数据下载完成`);
    Counter.Success();
  } catch (e) {
    logger.default.warn(`[components][character][download] 下载角色${fileName}数据失败`);
    if (e instanceof AxiosError) {
      logger.default.error(
        `[components][character][download] ${e.response?.status} ${e.response?.statusText}`,
      );
    } else logger.default.error(e);
    Counter.Fail();
  }
}
Counter.End();
logger.default.info(`[components][character][download] 数据更新完成，耗时 ${Counter.getTime()}`);
Counter.Output();

// 下载图片数据
Counter.Reset();
logger.console.info("[components][character][download] 开始下载图片数据");
Counter.addTotal(amberJson.length);
for (const item of amberJson) {
  const url = `${amberConfig.assets}${item.icon}.png`;
  const savePath = path.join(imgDir.src, `${item.id}.png`);
  const element = getAmberElement(item.element);
  if (isNaN(Number(item.id))) {
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
    logger.default.error(e);
    Counter.Fail();
    continue;
  }
  await sharp(<ArrayBuffer>res.data).toFile(savePath);
  logger.default.info(
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
function getAmberElement(element: TGACore.Plugins.Amber.ElementType): string {
  switch (element) {
    case "Wind":
      return "风";
    case "Rock":
      return "岩";
    case "Electric":
      return "雷";
    case "Water":
      return "水";
    case "Fire":
      return "火";
    case "Ice":
      return "冰";
    case "Grass":
      return "草";
    default:
      throw new Error(`[components][character][download] ${element}`);
  }
}
