/**
 * @file core/components/wiki/constant.ts
 * @description wiki组件常量
 * @since 2.0.1
 */

import path from "node:path";

import { getAppDirPath } from "../../utils/getBasePaths.ts";

export const jsonDir = getAppDirPath("data", "wiki");

export const jsonDetail = {
  dir: path.join(jsonDir.out, "WIKI"),
  material: path.join(jsonDir.src, "material.json"),
  weapon: {
    src: path.join(jsonDir.src, "weapon.json"),
    out: path.join(jsonDir.out, "WIKI", "weapon.json"),
  },
};
