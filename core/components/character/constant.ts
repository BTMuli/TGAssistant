/**
 * @file core components character constant.ts
 * @description 角色组件常量
 * @since 2.0.1
 */

import path from "node:path";

import { getAppDirPath } from "../../utils/getBasePaths.ts";

export const imgDir = getAppDirPath("assets", "character");
export const jsonDir = getAppDirPath("data", "character");

export const jsonDetailDir = {
  amber: path.join(jsonDir.src, "amber.json"),
  mys: path.join(jsonDir.src, "mys.json"),
  hutao: path.join(jsonDir.src, "hutao.json"),
  out: path.join(jsonDir.out, "app", "character.json"),
  namecard: path.join(jsonDir.out, "app", "namecard.json"),
};
