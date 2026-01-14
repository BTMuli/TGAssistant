/**
 * @file core/plugins/hutao/constant.ts
 * @description 一些关于胡桃的常量
 * @since 2.4.0
 */
import path from "node:path";

import { getProjDataPath } from "@core/utils/getBasePaths.ts";

export const jsonDir: Readonly<string> = getProjDataPath("data", "src", "hutao");
export const avatarDir: Readonly<string> = path.join(jsonDir, "Avatar");
// 地区列表
export const AREA_LIST: ReadonlyArray<string> = [
  "未知",
  "蒙德",
  "璃月",
  "主角",
  "愚人众",
  "稻妻",
  "游侠",
  "须弥",
  "枫丹",
  "纳塔",
  "至冬",
  "寰宇劫灭",
  "挪德卡莱",
  "璃月港",
];
