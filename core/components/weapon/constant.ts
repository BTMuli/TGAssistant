/**
 * @file core components weapon constant.ts
 * @description 武器组件常量
 * @since 2.0.1
 */

import path from "node:path";

import { getAppDirPath } from "../../utils/getBasePaths.ts";

export const imgDir = getAppDirPath("assets", "weapon");
export const jsonDir = getAppDirPath("data", "weapon");

export const jsonDetailDir = {
  amber: path.join(jsonDir.src, "amber.json"),
  mys: path.join(jsonDir.src, "mys.json"),
  hutao: path.join(jsonDir.src, "hutao.json"),
  out: path.join(jsonDir.out, "app", "weapon.json"),
};
