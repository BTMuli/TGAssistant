/**
 * 角色组件常量
 * @since 2.5.0
 */

import path from "node:path";

import { getAppDirPath, getProjDataPath } from "@utils/getBasePaths.ts";

export const imgDir = getAppDirPath("assets", "character");
export const jsonDir = getAppDirPath("data", "character");

export const jsonDetailDir = {
  yatta: path.join(jsonDir.src, "yatta.json"),
  mys: path.join(jsonDir.src, "mys.json"),
  out: path.join(jsonDir.out, "app", "character.json"),
  namecard: path.join(jsonDir.out, "app", "namecard.json"),
  hakushi: path.join(jsonDir.src, "hakushi.json"),
};
export const imgCostumeDir = {
  src: path.join(getProjDataPath("assets"), "src", "costume"),
  out: path.join(getProjDataPath("assets"), "out", "costume"),
};
