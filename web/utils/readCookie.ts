/**
 * @file web utils readCookie.ts
 * @description 读取 cookie
 * @since 2.0.0
 */

import os from "node:os";
import path from "node:path";

import DataBase from "better-sqlite3";
import fs from "fs-extra";

import { getProjDataPath } from "../../core/utils/getBasePaths.ts";

const dataDir = getProjDataPath("data");
const cookiePath = path.join(dataDir, "http", "cookie.json");
const cookieDB = path.join(os.homedir(), "AppData", "Roaming", "TeyvatGuide", "TeyvatGuide.db");

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

/**
 * @description 从数据库中读取 cookie，然后写入文件
 * @since 2.0.0
 * @return {string} cookie-db
 */
export function flushDB(): void {
  const db = new DataBase(cookieDB);
  db.pragma("journal_mode = WAL");
  const res = <{ value: string }>db.prepare("SELECT value FROM AppData WHERE key = 'cookie'").get();
  db.close();
  fs.writeJSONSync(cookiePath, JSON.parse(res.value), { spaces: 2 });
}
