/**
 * @file web utils readCookie.ts
 * @description 读取 cookie
 * @since 2.0.0
 */

import path from "node:path";

import fs from "fs-extra";

import { getProjDataPath } from "../../core/utils/getBasePaths.ts";

const dataDir = getProjDataPath("data");
const cookiePath = path.join(dataDir, "cookie.json");

/**
 * @description 读取 cookie
 * @since 2.0.0
 * @return {TGWeb.Constant.Cookie} cookie
 */
export function readCookie(): Record<TGWeb.Constant.CookieType, string> {
  return fs.readJSONSync(cookiePath);
}

/**
 * @description 读取 cookie
 * @since 2.0.0
 * @param {TGWeb.Constant.CookieType} cookieType cookie 类型
 * @return {string} cookie
 */
export function readCookieItem(cookieType: TGWeb.Constant.CookieType): string {
  return readCookie()[cookieType];
}
