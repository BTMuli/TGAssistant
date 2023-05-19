/**
 * @file http tools getHeader.js
 * @description 获取请求头部信息
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// TGAssistant
import HttpConstant from "../constant/index.js";
import getDS from "./getDS.js";

/**
 * @description 获取请求头部信息
 * @since 1.1.0
 * @param {string} cookie cookie
 * @param {string} method 请求方法
 * @param {string} data 请求数据
 * @param {string} saltType salt 类型
 * @returns {Object} 请求头部信息
 */
function getHeader(cookie, method, data, saltType) {
	return {
		"User-Agent": HttpConstant.BBS.Header,
		"x-rpc-app_version": HttpConstant.BBS.Version,
		"x-rpc-client_type": "5",
		"x-requested-with": "com.mihoyo.hyperion",
		"Referer": HttpConstant.BBS.Referer,
		"DS": getDS(method, data, saltType),
		"Cookie": cookie,
	};
}

export default getHeader;
