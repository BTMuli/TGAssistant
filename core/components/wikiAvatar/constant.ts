/**
 * 角色Wiki组件常量
 * @since 2.6.0
 */

import path from "node:path";

import { NANOKA_VER } from "@nanoka/nanoka.ts";
import { getAppDirPath, getProjDataPath } from "@utils/getBasePaths.ts";

export const jsonOutDir = path.join(getAppDirPath("data", "wiki").out, "WIKI", "character");
export const nanokaCharacterDir = getProjDataPath("data", "src", "nanoka", NANOKA_VER, "character");
export const imageDetail = {
  talents: {
    src: getAppDirPath("assets", "talents").src,
    out: getAppDirPath("assets", "talents").out,
  },
  constellations: {
    src: getAppDirPath("assets", "constellations").src,
    out: getAppDirPath("assets", "constellations").out,
  },
};
