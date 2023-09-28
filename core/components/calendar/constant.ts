/**
 * @file core components calendar constant.ts
 * @description 日历组件常量
 * @since 2.0.0
 */

import path from "node:path";

import { getAppDirPath } from "../../utils/getBasePaths.ts";

export const imgDir = getAppDirPath("assets", "material");
export const jsonDir = getAppDirPath("data", "calendar");

export const jsonDetailDir = {
  mys: path.join(jsonDir.src, "mys.json"),
  amber: path.join(jsonDir.src, "amber.json"),
  character: path.join(jsonDir.src, "character.json"),
  weapon: path.join(jsonDir.src, "weapon.json"),
  material: path.join(jsonDir.src, "material.json"),
  out: path.join(jsonDir.out, "calendar.json"),
};
