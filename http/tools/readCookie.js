/**
 * @file http tools readCookie.js
 * @description Cookie 读取
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.2.0
 */

// Node
import fs from "node:fs";
import path from "node:path";
// TGAssistant
import pathList from "../../root.js";

/**
 * @description 读取 cookie
 * @since 1.2.0
 * @returns {Record<string,string>} cookie
 */
export function readCookie() {
	const ckFile = fs.readFileSync(path.resolve(pathList.http, "cookie.json"), "utf8");
	return JSON.parse(ckFile);
}

/**
 * @description 读取 cookie 某项值
 * @since 1.2.0
 * @param {string} itemKey 项名称
 * @returns {string} 项值
 */
export function readCookieItem(itemKey){
	const ckFile = fs.readFileSync(path.resolve(pathList.http, "cookie.json"), "utf8");
	const ck = JSON.parse(ckFile);
	return ck[itemKey];
}