/**
 * @file core/components/achievements/convert.ts
 * @description 成就组件数据转换
 * @since 2.4.0
 */

import path from "node:path";
import process from "node:process";

import amosTool from "@amos/amos.ts";
import { HutaoGithubFileEnum } from "@hutao/enum.ts";
import hutaoTool from "@hutao/hutao.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import fs from "fs-extra";
import sharp from "sharp";

import { imgDir, jsonDetailDir, jsonDir } from "./constant.ts";

logger.init();
logger.default.info("[components][achievement][convert] 运行 convert.ts");

// 前置检查
fileCheckObj(jsonDir);
if (
  !fileCheck(jsonDetailDir.yatta, false) ||
  !hutaoTool.check(HutaoGithubFileEnum.Achievement) ||
  !hutaoTool.check(HutaoGithubFileEnum.AchievementGoal)
) {
  logger.default.error("[components][achievement][convert] 成就元数据文件不存在");
  logger.console.info("[components][achievement][convert] 请执行 download.ts");
  process.exit(1);
}
if (!fileCheck(jsonDetailDir.namecard, false)) {
  logger.default.error("[components][achievement][update] namecard.json 不存在");
  logger.console.info("[components][achievement][update] 请先运行 namecard/convert.ts");
  process.exit(1);
}

Counter.Reset();
// 读取成就元数据
const achievementRaw = await hutaoTool.read<TGACore.Plugins.Hutao.Achievement.RawAchievement>(
  hutaoTool.enum.file.Achievement,
);
const seriesRaw = await hutaoTool.read<TGACore.Plugins.Hutao.Achievement.RawAchievementGoal>(
  hutaoTool.enum.file.AchievementGoal,
);
const amberRaw: TGACore.Plugins.Yatta.Achievement.AchiRes = await fs.readJSON(jsonDetailDir.yatta);
const namecardData: TGACore.Components.Namecard.ConvertData[] = await fs.readJson(
  jsonDetailDir.namecard,
);

// 转换成就元数据
const achievement: Array<TGACore.Components.Achievement.Achievement> = [];
const series: Array<TGACore.Components.Achievement.Series> = [];
const versionMax: Record<number, string> = {};
const rawAmosAchievements = amosTool.flattern();
// 先处理成就
achievementRaw.forEach((item) => {
  let trigger: TGACore.Components.Achievement.Trigger = { type: "Unknown" };
  const triggerFind = rawAmosAchievements.find((rawItem) => rawItem.id === Number(item.Id));
  if (triggerFind) trigger = amosTool.parse(triggerFind);
  const achievementItem: TGACore.Components.Achievement.Achievement = {
    id: item.Id,
    series: item.Goal,
    order: item.Order,
    name: item.Title,
    description: item.Description,
    reward: item.FinishReward.Count,
    version: item.Version,
    trigger: trigger,
  };
  achievement.push(achievementItem);
  logger.console.mark(`[components][achievement][convert] 成就 ${item.Id} 转换完成`);
  if (versionMax[item.Goal] === undefined) {
    versionMax[item.Goal] = item.Version;
  } else if (versionMax[item.Goal] < item.Version) {
    versionMax[item.Goal] = item.Version;
  }
});

// 再处理成就系列
seriesRaw.forEach((item) => {
  const amberSeries = amberRaw[item.Id];
  let card = "";
  if (amberSeries.finishReward !== null) {
    const cardKey = Object.keys(amberSeries.finishReward)[0];
    const cardFind = namecardData.find((i) => i.id.toString() === cardKey);
    if (cardFind) card = cardFind.name;
  }
  const seriesItem: TGACore.Components.Achievement.Series = {
    id: item.Id,
    order: item.Order,
    name: item.Name,
    version: versionMax[item.Id],
    card: card,
    icon: item.Icon,
  };
  series.push(seriesItem);
  logger.console.mark(`[components][achievement][convert] 成就系列 ${item.Id} 转换完成`);
});

// 排序，写入
achievement.sort((a, b) => a.id - b.id);
series.sort((a, b) => a.order - b.order);
fs.writeJSONSync(jsonDetailDir.achievement, achievement);
fs.writeJSONSync(jsonDetailDir.series, series);
Counter.End();

// 处理成就系列的图像
Counter.Reset(series.length);
for (const item of seriesRaw) {
  const srcPath = path.join(imgDir.src, `${item.Icon}.png`);
  const outPath = path.join(imgDir.out, `${item.Icon}.webp`);
  if (!fileCheck(srcPath, false)) {
    logger.default.warn(`[components][achievement][convert] 成就系列 ${item.Name} 没有图片数据`);
    Counter.Fail();
    continue;
  }
  if (fileCheck(outPath, false)) {
    logger.console.mark(`[components][achievement][convert] 成就系列 ${item.Name} 已有图片数据`);
    Counter.Skip();
    continue;
  }
  await sharp(srcPath).webp().toFile(outPath);
  logger.console.info(`[components][achievement][convert] 成就系列 ${item.Name} 图片转换完成`);
  Counter.Success();
}
Counter.End();
logger.default.info(`[components][achievement][convert] 图片处理完成，耗时 ${Counter.getTime()}ms`);
Counter.Output();

logger.default.info(`[components][achievement][convert] 成就转换完成，耗时 ${Counter.getTime()}ms`);
Counter.EndAll();
logger.console.info("[components][achievement][convert] 请执行 update.ts 更新名片数据");
