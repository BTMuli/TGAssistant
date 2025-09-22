/**
 * @file core/plugins/yatta/utils.ts
 * @description Yatta插件工具函数
 * @since 2.4.0
 */

import { YATTA_API_URL, YATTA_API_VERSION } from "@yatta/constant.ts";

/**
 * @description 获取 Yatta JSON 数据
 * @since 2.4.0
 * @function fetchJson
 * @template T
 * @param {string} relPath 相对路径
 * @returns {Promise<T>} JSON数据
 */
export async function fetchJson<T>(relPath: string): Promise<T> {
  const link = `${YATTA_API_URL}${relPath}?vh=${YATTA_API_VERSION}`;
  const resp = await fetch(link);
  return await resp.json();
}
