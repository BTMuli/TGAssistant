/**
 * @file web utils getHeader.ts
 * @description 获取请求头
 * @since 2.0.0
 */

import { getDS } from "./getDS.ts";
import { transCookie } from "./transData.ts";
import MysClient from "../constant/mys.ts";

/**
 * @description 获取请求头-PC端
 * @since 2.0.0
 * @param {Record<string, string>} cookie cookie
 * @param {"GET" | "POST"} method 请求方法
 * @param {Record<string, string|number|boolean>} params 请求参数
 * @param {string} saltType salt 类型
 * @param {boolean} isSign 是否签名
 * @returns {Record<string, string>} 请求头
 */
export function getHeaderPC(
  cookie: Record<string, string>,
  method: "GET" | "POST",
  params: Record<string, string | number | boolean>,
  saltType: TGWeb.Constant.SaltType,
  isSign: boolean,
): Record<string, string> {
  const ds = getDS(method, params, saltType, isSign);
  return {
    "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) miHoYoBBS/${MysClient.version}`,
    "x-rpc-app_version": MysClient.version,
    "x-rpc-client_type": "5",
    "x-requested-with": "com.mihoyo.hyperion",
    "Referer": "https://webstatic.mihoyo.com/",
    "DS": ds,
    "Cookie": transCookie(cookie),
  };
}

/**
 * @description 获取无参数请求头-安卓端
 * @since 2.0.0
 * @returns {Record<string, string>} 请求头
 */
export function getMinHeaderMobile(): Record<string, string> {
  return {
    "User-Agent": `Mozilla/5.0 (Linux; Android 12) Mobile miHoYoBBS/${MysClient.version}`,
    "x-rpc-app_version": MysClient.version,
    "x-rpc-client_type": "5",
    "x-requested-with": "com.mihoyo.hyperion",
    "Referer": "https://webstatic.mihoyo.com/",
  };
}
