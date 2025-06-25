/**
 * @file core components namecard constant.ts
 * @description 名片组件常量
 * @since 2.4.0
 */

import path from "node:path";

import { getAppDirPath } from "../../utils/getBasePaths.ts";

export const imgDir = getAppDirPath("assets", "nameCard");
export const jsonDir = getAppDirPath("data", "nameCard");
export const imgDetailDir = {
  icon: <TGACore.Config.BaseDirType>{
    src: path.join(imgDir.src, "icon"),
    out: path.join(imgDir.out, "icon"),
  },
  bg: <TGACore.Config.BaseDirType>{
    src: path.join(imgDir.src, "bg"),
    out: path.join(imgDir.out, "bg"),
  },
  profile: <TGACore.Config.BaseDirType>{
    src: path.join(imgDir.src, "profile"),
    out: path.join(imgDir.out, "profile"),
  },
};
