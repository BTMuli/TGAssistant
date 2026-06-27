/**
 * 圣遗物组件常量
 * @since 2.6.0
 */
import path from "node:path";

import { getAppDirPath } from "@utils/getBasePaths.ts";

export const imgDir = getAppDirPath("assets", "relic");
export const jsonDir = getAppDirPath("data", "wiki");

export const jsonDetail = {
  dir: path.join(jsonDir.out, "WIKI", "relic"),
  yatta: path.join(jsonDir.src, "relic.json"),
};
