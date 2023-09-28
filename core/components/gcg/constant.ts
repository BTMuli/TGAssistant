/**
 * @file core components gcg constant.ts
 * @description gcg 常量
 * @since 2.0.0
 */

import path from "node:path";

import { getAppDirPath } from "../../utils/getBasePaths.ts";

export const imgDir = getAppDirPath("assets", "gcg");
export const jsonDir = getAppDirPath("data", "gcg");

export const jsonDetailDir = {
  amber: path.join(jsonDir.src, "amber.json"),
  mys: path.join(jsonDir.src, "mys.json"),
  out: path.join(jsonDir.out, "gcg.json"),
};
