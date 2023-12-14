/**
 * @file core/components/wiki/constant.ts
 * @description wiki组件常量
 * @since 2.0.0
 */

import path from "node:path";

import { getAppDirPath } from "../../utils/getBasePaths.ts";

export const jsonDir = getAppDirPath("data", "wiki");

export const jsonDetail = {
  weapon: {
    src: path.join(jsonDir.src, "weapon.json"),
    out: path.join(jsonDir.out, "Weapon"),
  },
  character: {
    src: path.join(jsonDir.src, "character.json"),
    out: path.join(jsonDir.out, "Character"),
  },
  gcg: {
    src: path.join(jsonDir.src, "gcg.json"),
    out: path.join(jsonDir.out, "GCG"),
  },
};
