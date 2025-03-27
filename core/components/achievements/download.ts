/**
 * @file core/components/achievements/download.ts
 * @description 成就组件资源下载
 * @since 2.2.0
 */

import axios, { AxiosError } from "axios";
import fs from "fs-extra";

import { imgDir, jsonDetailDir, jsonDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";
import { getSnapDownloadUrl } from "../../utils/operGitRepo.ts";
import sharp from "sharp";
import { readConfig } from "../../utils/readConfig.ts";

logger.init();
Counter.Init("[components][achievement][download]");
logger.default.info("[components][achievement][download] 运行 download.ts");
const amberConfig = readConfig("constant").amber;

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

// 更新元数据
Counter.Reset(3);
logger.console.info("[components][achievement][download] 开始下载 Snap.Metadata 成就数据");
const urlRes = getSnapDownloadUrl("Achievement", "AchievementGoal");
for (const [key, value] of urlRes) {
  const savePath = key === "Achievement" ? jsonDetailDir.achievement.src : jsonDetailDir.series.src;
  try {
    const res = await axios.get(value);
    if (key === "Achievement") {
      await fs.writeJSON(savePath, res.data, { spaces: 2 });
    } else {
      await fs.writeJSON(savePath, res.data, { spaces: 2 });
    }
    logger.default.info(`[components][achievement][download] 下载 ${key} 数据成功`);
    Counter.Success();
  } catch (e) {
    logger.default.warn(`[components][achievement][download] 下载 ${key} 数据失败`);
    logger.console.warn(`[components][achievement][download] url: ${value}`);
    if (e instanceof AxiosError) {
      logger.console.warn(`[components][achievement][download] ${e.name} ${e.message}`);
    } else logger.console.warn(e);
    Counter.Fail();
  }
}
// 更新JSON数据
logger.console.info("[components][achievement][download] 开始下载Amber成就数据");
try {
  const resp = await axios
    .get(`${amberConfig.api}CHS/achievement`, {
      params: { vh: amberConfig.version },
    })
    .then((res) => res.data);
  await fs.writeJSON(jsonDetailDir.amber, resp.data, { spaces: 2 });
  logger.default.info("[components][achievement][download2] 下载 Amber 成就数据成功");
  Counter.Success();
} catch (e) {
  logger.default.error("[components][achievement][download2] 下载 Amber 成就数据失败");
  if (e instanceof AxiosError) {
    logger.default.error(`[components][achievement][download2] ${e.name} ${e.message}`);
  } else {
    logger.console.error(`[components][achievement][download2] ${e}`);
  }
  Counter.Fail();
}

Counter.End();
logger.default.info(`[components][achievement][download] 数据更新完成，耗时 ${Counter.getTime()}`);
Counter.Output();

// 下载图片
const seriesRaw: TGACore.Components.Achievement.RawSeries[] = await fs.readJSON(
  jsonDetailDir.series.src,
);
Counter.Reset(seriesRaw.length);
logger.console.info("[components][achievement][download] 开始下载成就图片");
for (const item of seriesRaw) {
  const savePath = `${imgDir.src}/${item.Icon}.png`;
  if (fileCheck(savePath, false)) {
    logger.console.mark(`[components][achievement][download] ${item.Icon} 图片已存在，跳过`);
    Counter.Skip();
    continue;
  }
  try {
    const url = `${amberConfig.site}assets/UI/achievement/${item.Icon}.png`;
    const res = await axios.get(url, { responseType: "arraybuffer" });
    await sharp(<ArrayBuffer>res.data).toFile(savePath);
    logger.default.info(`[components][achievement][download] ${item.Icon} 图片下载完成`);
    Counter.Success();
  } catch (e) {
    logger.default.warn(`[components][achievement][download] ${item.Icon} 图片下载失败`);
    logger.console.warn(e);
    Counter.Fail();
  }
}
Counter.End();
logger.default.info(`[components][achievement][download] 图片下载完成，耗时 ${Counter.getTime()}`);
Counter.Output();

Counter.EndAll();
logger.console.info("[components][achievement][download] 请执行 convert.ts 转换数据");
