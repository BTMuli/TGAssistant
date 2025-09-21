/**
 * @file core/components/wikiAvatar/constant.ts
 * @description 角色Wiki组件常量
 * @since 2.4.0
 */

import path from "node:path";

import { getAppDirPath } from "../../utils/getBasePaths.ts";

export const jsonDir = getAppDirPath("data", "wikiAvatar");
export const jsonDetail = {
  amber: path.join(jsonDir.src, "amber.json"),
  material: path.join(getAppDirPath("data", "wiki").src, "material.json"),
};
export const jsonOutDir = path.join(getAppDirPath("data", "wiki").out, "WIKI", "character");
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
