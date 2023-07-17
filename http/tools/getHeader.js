/**
 * @file http tools getHeader.js
 * @description 获取请求头部信息
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// TGAssistant
import HttpConstant from "../constant/index.js";
import { getDS } from "./getDS.js";
import { transParams } from "./transParams.js";
import transCookie from "./transCookie.js";

/**
 * @description 获取请求头部信息
 * @since 1.1.0
 * @param {Record<string, string>} cookie cookie
 * @param {string} method 请求方法
 * @param {Record<string, string|number>|string} data 请求数据
 * @param {string} saltType salt 类型
 * @returns {Object} 请求头部信息
 */
export function getHeader(cookie, method, data, saltType = "common") {
  let ds;
  if (typeof data === "string") ds = getDS(method, data, saltType);
  else ds = getDS(method, transParams(data), saltType);
  return {
    "User-Agent": HttpConstant.BBS.Header,
    "x-rpc-app_version": HttpConstant.BBS.Version,
    "x-rpc-client_type": "5",
    "x-requested-with": "com.mihoyo.hyperion",
    "Referer": HttpConstant.BBS.Referer,
    "DS": ds,
    "Cookie": transCookie(cookie),
  };
}

/**
 * @description 获取请求头部信息
 * @since 1.1.0
 * @param {Record<string, string>} cookie cookie
 * @param {string} method 请求方法
 * @param {Record<string, string|number>|string} data 请求数据
 * @param {string} saltType salt 类型
 * @returns {Object} 请求头部信息
 */
export function getSignHeader(cookie, method, data, saltType = "common") {
  return {
    "User-Agent": HttpConstant.BBS.Header,
    "x-rpc-app_version": HttpConstant.BBS.Version,
    "x-rpc-client_type": "5",
    "x-requested-with": "com.mihoyo.hyperion",
    "Referer": HttpConstant.BBS.Referer,
    "DS": getDS(method, data, saltType, true),
    "Cookie": transCookie(cookie),
  };
}
