/**
 * @file core components achievements convert.ts
 * @description 成就组件数据转换
 * @since 2.2.0
 */

import process from "node:process";

import fs from "fs-extra";

import { jsonDir, jsonDetailDir } from "./constant.ts";
import { getAchiTrigger } from "./utils.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";

logger.init();
logger.default.info("[components][achievement][convert] 运行 convert.ts");

// 前置检查
fileCheckObj(jsonDir);
if (
  !fileCheck(jsonDetailDir.achievement.src, false) ||
  !fileCheck(jsonDetailDir.series.src, false)
) {
  logger.default.error("[components][achievement][convert] 成就元数据文件不存在");
  logger.console.info("[components][achievement][convert] 请执行 download.ts");
  process.exit(1);
}

Counter.Reset();
// 读取成就元数据
const achievementRaw: TGACore.Components.Achievement.RawAchievement[] = await fs.readJson(
  jsonDetailDir.achievement.src,
);
const seriesRaw: TGACore.Components.Achievement.RawSeries[] = await fs.readJson(
  jsonDetailDir.series.src,
);

// 转换成就元数据
const achievement: TGACore.Components.Achievement.ConvertAchievement[] = [];
const series: TGACore.Components.Achievement.ConvertSeries[] = [];
const versionMax: Record<number, string> = {};

// 先处理成就
achievementRaw.forEach((item) => {
  const achievementItem: TGACore.Components.Achievement.ConvertAchievement = {
    id: item.Id,
    series: item.Goal,
    order: item.Order,
    name: item.Title,
    description: item.Description,
    reward: item.FinishReward.Count,
    version: item.Version,
    trigger: getAchiTrigger(item.Id),
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
  const seriesItem: TGACore.Components.Achievement.ConvertSeries = {
    id: item.Id,
    order: item.Order,
    name: item.Name,
    version: versionMax[item.Id],
    card: "",
    icon: `/icon/achievement/${item.Icon}.webp`,
  };
  series.push(seriesItem);
  logger.console.mark(`[components][achievement][convert] 成就系列 ${item.Id} 转换完成`);
});

// 排序，写入
achievement.sort((a, b) => a.id - b.id);
series.sort((a, b) => a.order - b.order);
fs.writeJSONSync(jsonDetailDir.achievement.out, achievement, { spaces: 2 });
fs.writeJSONSync(jsonDetailDir.series.out, series, { spaces: 2 });
Counter.End();

logger.default.info(`[components][achievement][convert] 成就转换完成，耗时 ${Counter.getTime()}ms`);
logger.console.info("[components][achievement][convert] 请执行 update.ts 更新名片数据");
