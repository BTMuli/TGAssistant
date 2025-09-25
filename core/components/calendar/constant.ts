/**
 * @file core/components/calendar/constant.ts
 * @description 日历组件常量
 * @since 2.4.0
 */

import path from "node:path";

import { getAppDirPath } from "@utils/getBasePaths.ts";

export const imgDir = getAppDirPath("assets", "material");
export const jsonDir = getAppDirPath("data", "calendar");

export const jsonDetailDir = {
  mys: path.join(jsonDir.src, "mys.json"),
  domain: path.join(jsonDir.src, "domain.json"),
  avatar: path.join(jsonDir.src, "avatar.json"),
  out: path.join(jsonDir.out, "app", "calendar.json"),
};
