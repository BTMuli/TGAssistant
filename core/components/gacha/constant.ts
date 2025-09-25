/**
 * @file core/components/gacha/constants.ts
 * @description gacha 常量
 * @since 2.1.0
 */

import path from "node:path";

import { getAppDirPath } from "@utils/getBasePaths.ts";

export const jsonDir = getAppDirPath("data", "gacha");
export const jsonDetailDir = {
  mhy: path.join(jsonDir.src, "mhy.json"),
  out: path.join(jsonDir.out, "app", "gacha.json"),
};
