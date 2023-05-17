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
 * @param {String} cookie cookie
 * @param {String} method 请求方法
 * @param {String} data 请求数据
 * @returns {Object} 请求头部信息
 */
function getHeader(cookie, method, data) {
	return {
		"User-Agent": HttpConstant.BBS.Header,
		"x-rpc-app_version": HttpConstant.BBS.Version,
		"x-rpc-client_type": "5",
		"Referer": HttpConstant.BBS.Host,
		"DS": getDS(method, data),
		"Cookie": cookie,
	};
}

export default getHeader;
