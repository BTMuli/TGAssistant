/**
 * @file core/components/achievements/download.ts
 * @description 成就组件资源下载
 * @since 2.2.0
 */

import path from "node:path";

import hutaoTool from "@hutao/hutao.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import fetchSgBuffer from "@utils/fetchSgBuffer.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import yattaTool from "@yatta/yatta.ts";
import fs from "fs-extra";
import sharp from "sharp";

import { imgDir, jsonDetailDir, jsonDir } from "./constant.ts";

logger.init();
Counter.Init("[components][achievement][download]");
logger.default.info("[components][achievement][download] 运行 download.ts");

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

// 更新Metadata数据
logger.console.info("[components][achievement][download] 开始下载 Metadata 成就数据");
Counter.Reset(4);
const remoteMeta = await hutaoTool.sync();
// 更新成就数据
try {
  const statAchi = await hutaoTool.update(remoteMeta, hutaoTool.enum.file.Achievement);
  if (statAchi) Counter.Success();
  else Counter.Skip();
} catch (e) {
  logger.default.error("[components][achievement][download] 下载 Metadata 成就数据失败");
  logger.console.error(`[components][achievement][download] ${e}`);
  Counter.Fail();
}
// 更新成就系列数据
try {
  const statAchi = await hutaoTool.update(remoteMeta, hutaoTool.enum.file.AchievementGoal);
  if (statAchi) Counter.Success();
  else Counter.Skip();
} catch (e) {
  logger.default.error("[components][achievement][download] 下载 Metadata 成就系列数据失败");
  logger.console.error(`[components][achievement][download] ${e}`);
  Counter.Fail();
}
// 更新名片数据
try {
  const statNameCard = await hutaoTool.update(remoteMeta, hutaoTool.enum.file.NameCard);
  if (statNameCard) Counter.Success();
  else Counter.Skip();
} catch (e) {
  logger.default.error("[components][achievement][download] 下载 Metadata 名片数据失败");
  logger.console.error(`[components][achievement][download] ${e}`);
  Counter.Fail();
}
// 更新Yatta数据
logger.console.info("[components][achievement][download] 开始下载Yatta成就数据");
try {
  const res =
    await yattaTool.fetchJson<TGACore.Plugins.Yatta.Achievement.AchiResp>("CHS/achievement");
  await fs.writeJson(jsonDetailDir.yatta, res.data, { spaces: 2 });
  logger.default.info("[components][achievement][download2] 下载 Amber 成就数据成功");
  Counter.Success();
} catch (e) {
  logger.default.error("[components][achievement][download] 下载 Amber 成就数据失败");
  logger.console.error(`[components][achievement][download] ${e}`);
  Counter.Fail();
}

Counter.End();
logger.default.info(`[components][achievement][download] 数据更新完成，耗时 ${Counter.getTime()}`);
Counter.Output();

// 下载图片
const seriesRaw = hutaoTool.read<TGACore.Plugins.Hutao.Achievement.RawAchievementGoal>(
  hutaoTool.enum.file.AchievementGoal,
);
Counter.Reset(seriesRaw.length);
logger.console.info("[components][achievement][download] 开始下载成就图片");
for (const item of seriesRaw) {
  const savePath = path.join(imgDir.src, `${item.Icon}.png`);
  if (fileCheck(savePath, false)) {
    logger.console.mark(`[components][achievement][download] ${item.Icon} 图片已存在，跳过`);
    Counter.Skip();
    continue;
  }
  try {
    const buffer = await fetchSgBuffer("AchievementIcon", `${item.Icon}.png`);
    await sharp(buffer).toFile(savePath);
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
