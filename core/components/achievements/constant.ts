/**
 * @file core components achievements constant.ts
 * @description 成就组件常量
 * @since 2.3.0
 */

import path from "node:path";

import { getAppDirPath } from "../../utils/getBasePaths.ts";

export const jsonDir = getAppDirPath("data", "achievement");

export const jsonDetailDir = {
  achievement: {
    src: path.join(jsonDir.src, "achievement.json"),
    out: path.join(jsonDir.out, "app", "achievements.json"),
  },
  series: {
    src: path.join(jsonDir.src, "series.json"),
    out: path.join(jsonDir.out, "app", "achievementSeries.json"),
  },
  namecard: path.join(jsonDir.out, "app", "namecard.json"),
  amber: path.join(jsonDir.src, "amber.json"),
};

export const imgDir = getAppDirPath("assets", "achievement");
