/**
 * @file core/components/achievements/constant.ts
 * @description 成就组件常量
 * @since 2.4.0
 */

import path from "node:path";

import { getAppDirPath } from "@utils/getBasePaths.ts";

export const jsonDir = getAppDirPath("data", "achievement");

export const jsonDetailDir = {
  achievement: path.join(jsonDir.out, "app", "achievements.json"),
  series: path.join(jsonDir.out, "app", "achievementSeries.json"),
  yatta: path.join(jsonDir.src, "yatta.json"),
};

export const imgDir = getAppDirPath("assets", "achievement");
