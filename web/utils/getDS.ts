/**
 * @file web utils getDS.ts
 * @description DS 算法
 * @since 2.0.0
 */

import md5 from "node:crypto";

/**
 * @description 转换 params
 * @since 2.0.0
 * @param {Record<string, string|number|boolean>} obj object
 * @returns {string} query string
 */
function transParams(obj: Record<string, string | number | boolean>): string {
  let res = "";
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    res += `${key}=${obj[key].toString()}&`;
  }
  return res.slice(0, -1);
}

/**
 * @description 获取 salt
 * @since 2.0.0
 * @version 2.50.1
 * @param {TGWeb.Constant.SaltType} saltType salt 类型
 * @returns {TGWeb.Constant.Salt} salt
 */
function getSalt(saltType: TGWeb.Constant.SaltType): TGWeb.Constant.Salt {
  switch (saltType) {
    case "BBS_K2":
      return TGWeb.Constant.Salt.BBS_K2;
    case "BBS_LK2":
      return TGWeb.Constant.Salt.BBS_LK2;
    case "X4":
      return TGWeb.Constant.Salt.X4;
    case "X6":
      return TGWeb.Constant.Salt.X6;
    case "PROD":
      return TGWeb.Constant.Salt.PROD;
  }
}

/**
 * @description 获取随机数
 * @since 2.0.0
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number} 随机数
 */
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * @description 获取随机字符串
 * @since 2.0.0
 * @param {number} length 字符串长度
 * @returns {string} 随机字符串
 */
function getRandomString(length: number): string {
  const str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let res = "";
  for (let i = 0; i < length; i++) {
    res += str.charAt(Math.floor(Math.random() * str.length));
  }
  return res;
}

/**
 * @description 获取 ds
 * @since 2.0.0
 * @param {string} method 请求方法
 * @param {string|Record<string, string|number|boolean>} data 请求数据
 * @param {TGWeb.Constant.SaltType} saltType salt 类型
 * @param {boolean} isSign 是否为签名
 * @returns {string} ds
 */
function getDS(
  method: string,
  data: string | Record<string, string | number | boolean>,
  saltType: TGWeb.Constant.SaltType,
  isSign: boolean,
): string {
  const salt = getSalt(saltType);
  const time = Math.floor(Date.now() / 1000).toString();
  let random = getRandomNumber(100000, 200000).toString();
  const dataStr = typeof data === "string" ? data : transParams(data);
  if (isSign) random = getRandomString(6);
  const body = method === "GET" ? "" : dataStr;
  const query = method === "GET" ? dataStr : "";
  let hashStr = `salt=${salt}&t=${time}&r=${random}&b=${body}&q=${query}`;
  if (isSign) hashStr = `salt=${salt}&t=${time}&r=${random}`;
  const md5Str = md5.createHash("md5").update(hashStr).digest("hex");
  return `${time},${random},${md5Str}`;
}

/**
 * @description 获取 DS - 用于测试
 * @since 2.0.0
 * @param {string} method 请求方法
 * @param {string|Record<string, string|number|boolean>} data 请求数据
 * @param {TGWeb.Constant.SaltType} saltType salt 类型
 * @param {boolean} isSign 是否为签名
 * @param {string} time 时间戳
 * @param {string} random 随机数
 * @returns {string} ds
 */
export function getDSTest(
  method: string,
  data: string | Record<string, string | number | boolean>,
  saltType: TGWeb.Constant.SaltType,
  isSign: boolean,
  time: string,
  random: string,
): string {
  const salt = getSalt(saltType);
  const dataStr = typeof data === "string" ? data : transParams(data);
  const body = method === "GET" ? "" : dataStr;
  const query = method === "GET" ? dataStr : "";
  let hashStr = `salt=${salt}&t=${time}&r=${random}&b=${body}&q=${query}`;
  if (isSign) hashStr = `salt=${salt}&t=${time}&r=${random}`;
  const md5Str = md5.createHash("md5").update(hashStr).digest("hex");
  // 这边是为了暂时解决 no unused vars 的问题
  const ds = getDS(method, data, saltType, isSign);
  console.log(`DS: ${ds}`);
  return `${time},${random},${md5Str}`;
}
