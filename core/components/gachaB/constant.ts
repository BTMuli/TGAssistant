/**
 * 千星奇域模块
 * @since 2.5.0
 */
import path from "node:path";

import { getAppDirPath } from "@utils/getBasePaths.ts";

export const jsonDir = getAppDirPath("data", "gachaB");
export const jsonDetailDir = {
  costume: path.join(jsonDir.src, "costume.json"),
  suit: path.join(jsonDir.src, "suits.json"),
  item: path.join(jsonDir.src, "item.json"),
  out: path.join(jsonDir.out, "app", "gachaB.json"),
};
export const imgDir = getAppDirPath("assets", "gachaB");
