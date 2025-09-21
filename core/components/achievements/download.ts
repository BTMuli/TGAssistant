/**
 * @file core/components/achievements/download.ts
 * @description 成就组件资源下载
 * @since 2.2.0
 */

import fs from "fs-extra";

import { imgDir, jsonDetailDir, jsonDir } from "./constant.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import sharp from "sharp";
import { readConfig } from "@utils/readConfig.ts";
import hutaoTool from "@hutao/hutao.ts";

logger.init();
Counter.Init("[components][achievement][download]");
logger.default.info("[components][achievement][download] 运行 download.ts");
const amberConfig = readConfig("constant").amber;

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

// 更新元数据
logger.console.info("[components][achievement][download] 开始下载 Snap.Metadata 成就数据");
const remoteMeta = await hutaoTool.sync();
await hutaoTool.update(remoteMeta, hutaoTool.enum.file.Achievement);
await hutaoTool.update(remoteMeta, hutaoTool.enum.file.AchievementGoal);

// 更新JSON数据
logger.console.info("[components][achievement][download] 开始下载Amber成就数据");
try {
  const link = `${amberConfig.api}CHS/achievement?vh=${amberConfig.version}`;
  const resp = await fetch(link);
  const res = <TGACore.Plugins.Amber.AchiResp>await resp.json();
  await fs.writeJson(jsonDetailDir.amber, res.data, { spaces: 2 });
  logger.default.info("[components][achievement][download2] 下载 Amber 成就数据成功");
  Counter.Success();
} catch (e) {
  logger.default.error("[components][achievement][download2] 下载 Amber 成就数据失败");
  logger.console.error(`[components][achievement][download2] ${e}`);
  Counter.Fail();
}

Counter.End();
logger.default.info(`[components][achievement][download] 数据更新完成，耗时 ${Counter.getTime()}`);
Counter.Output();

// 下载图片
const seriesRaw = await hutaoTool.read<TGACore.Plugins.Hutao.Achievement.RawAchievementGoal>(
  hutaoTool.enum.file.AchievementGoal,
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
  // TODO: 替换图像源
  try {
    const url = `${amberConfig.site}assets/UI/achievement/${item.Icon}.png`;
    const res = await fetch(url, { method: "GET", responseType: "arraybuffer" });
    const buffer = Buffer.from(await res.arrayBuffer());
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
