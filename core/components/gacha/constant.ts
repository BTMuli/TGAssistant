/**
 * gacha 常量
 * @since 2.5.1
 */

import path from "node:path";

import { getAppDirPath } from "@utils/getBasePaths.ts";

export const jsonDir = getAppDirPath("data", "gacha");
export const jsonDetailDir = {
  mhy: path.join(jsonDir.src, "mhy.json"),
  news: path.join(jsonDir.src, "news.json"),
  out: path.join(jsonDir.out, "app", "gacha.json"),
};
