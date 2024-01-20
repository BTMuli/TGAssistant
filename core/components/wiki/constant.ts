/**
 * @file core/components/wiki/constant.ts
 * @description wiki组件常量
 * @since 2.0.1
 */

import path from "node:path";

import { getAppDirPath } from "../../utils/getBasePaths.ts";

export const jsonDir = getAppDirPath("data", "wiki");

export const jsonDetail = {
  dir: path.join(jsonDir.out, "Wiki"),
  material: path.join(jsonDir.src, "material.json"),
  weapon: {
    src: path.join(jsonDir.src, "weapon.json"),
    out: path.join(jsonDir.out, "Wiki", "weapon.json"),
  },
  character: {
    src: path.join(jsonDir.src, "character.json"),
    out: path.join(jsonDir.out, "Wiki", "character.json"),
  },
  gcg: {
    src: path.join(jsonDir.src, "gcg.json"),
    out: path.join(jsonDir.out, "Wiki", "gcg.json"),
  },
};

export const imageDetail = {
  material: {
    src: getAppDirPath("assets", "material").src,
    out: getAppDirPath("assets", "material").out,
  },
  talents: {
    src: getAppDirPath("assets", "talents").src,
    out: getAppDirPath("assets", "talents").out,
  },
  constellations: {
    src: getAppDirPath("assets", "constellations").src,
    out: getAppDirPath("assets", "constellations").out,
  },
};
