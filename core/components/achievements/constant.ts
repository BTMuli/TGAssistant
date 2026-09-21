/**
 * 成就组件常量
 * @since 2.6.0
 */

import path from "node:path";

import { getAppDirPath } from "@utils/getBasePaths.ts";

export const jsonDir = getAppDirPath("data", "achievement");

export const jsonDetailDir = {
  catalog: path.join(jsonDir.out, "app", "achievements.json"),
  nanoka: path.join(jsonDir.src, "nanoka.json"),
  yatta: path.join(jsonDir.src, "yatta.json"),
};

export const imgDir = getAppDirPath("assets", "achievement");
