/**
 * @file http tools transCookie.js
 * @description 转换 cookie
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

/**
 * @description 转换 cookie
 * @since 1.1.0
 * @param {Record<string,string>} cookie cookie
 * @returns {string} 转换后的 cookie
 */
function transCookie(cookie) {
  let res = "";
  const keys = Object.keys(cookie);
  for (const key of keys) {
    res += `${key}=${cookie[key]};`;
  }
  return res;
}

export default transCookie;
