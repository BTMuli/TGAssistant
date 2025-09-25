/**
 * @file core/components/wikiWeapon/constant.ts
 * @description 武器wiki组件常量
 * @since 2.4.0
 */

import path from "node:path";

import { getAppDirPath } from "@utils/getBasePaths.ts";

export const jsonDir = getAppDirPath("data", "wiki");

export const jsonDetail = {
  dir: path.join(jsonDir.out, "WIKI"),
  weapon: {
    src: path.join(jsonDir.src, "weapon.json"),
    out: path.join(jsonDir.out, "WIKI", "weapon.json"),
  },
};
