/**
 * @file web utils transData.ts
 * @description 转换数据
 * @since 2.0.0
 */

/**
 * @description 转换 params
 * @since 2.0.0
 * @param {Record<string, string|number|boolean>} obj object
 * @returns {string} query string
 */
export function transParams(obj: Record<string, string | number | boolean>): string {
  let res = "";
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    res += `${key}=${obj[key].toString()}&`;
  }
  return res.slice(0, -1);
}

/**
 * @description 转换 cookie
 * @since 2.0.0
 * @param {Record<string,string>} cookie cookie
 * @returns {string} cookie string
 */
export function transCookie(cookie: Record<string, string>): string {
  let res = "";
  const keys = Object.keys(cookie).sort();
  for (const key of keys) {
    res += `${key}=${cookie[key]};`;
  }
  return res;
}
