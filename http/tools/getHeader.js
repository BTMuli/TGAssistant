/**
 * @file http tools getHeader.js
 * @description 获取请求头部信息
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// TGAssistant
import HttpConstant from "../constant/index.js";
import { getDS }from "./getDS.js";

/**
 * @description 获取请求头部信息
 * @since 1.1.0
 * @param {string} cookie cookie
 * @param {string} query query
 * @param {string} body body
 * @param {string} saltType salt 类型
 * @returns {Object} 请求头部信息
 */
export function getHeader(cookie, query="", body="", saltType = "common") {
	return {
		"User-Agent": HttpConstant.BBS.Header,
		"x-rpc-app_version": HttpConstant.BBS.Version,
		"x-rpc-client_type": "5",
		"x-requested-with": "com.mihoyo.hyperion",
		"Referer": HttpConstant.BBS.Referer,
		"DS": getDS(query, body, saltType),
		"Cookie": cookie,
	};
}
