/**
 * @file web utils getDS.ts
 * @description DS 算法
 * @since 2.0.0
 */

import md5 from "node:crypto";

import { transParams } from "./transData.ts";
import MysClient from "../constant/mys.ts";

/**
 * @description 获取 salt
 * @since 2.0.0
 * @version 2.50.1
 * @param {TGWeb.Constant.SaltType} saltType salt 类型
 * @returns {MysClient.salt} salt
 */
function getSalt(saltType: TGWeb.Constant.SaltType): string {
  return MysClient.salt[saltType];
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
 * @param [type] 字符串类型
 * @returns {string} 随机字符串
 */
export function getRandomString(
  length: number,
  type: TGWeb.Utils.RandomStringTypeKey = "all",
): string {
  const char = "abcdefghijklmnopqrstuvwxyz";
  const num = "0123456789";
  let str = "";
  switch (type) {
    case "all":
      str = char + char.toUpperCase() + num;
      break;
    case "number":
      str = num;
      break;
    case "lower":
      str = char;
      break;
    case "upper":
      str = char.toUpperCase();
      break;
    case "letter":
      str = char + char.toUpperCase();
      break;
    case "hex":
      str = num + "abcdef";
      break;
    default:
      throw new Error("Invalid type");
  }
  let res = "";
  for (let i = 0; i < length; i++) {
    res += str.charAt(Math.floor(Math.random() * str.length));
  }
  return res;
}

/**
 * @function getMd5Str
 * @description 获取 dataStr
 * @since 2.0.0
 * @param {string} method 请求方法
 * @param {string} time 时间戳
 * @param {string} random 随机数
 * @param {string} salt salt
 * @param {string} dataStr 请求数据
 * @param {boolean} isSign 是否为签名
 * @returns {string} dataStr
 */
function getMd5Str(
  method: string,
  time: string,
  random: string,
  salt: string,
  dataStr: string,
  isSign: boolean,
): string {
  const body = method === "GET" ? "" : dataStr;
  const query = method === "GET" ? dataStr : "";
  let hashStr = `salt=${salt}&t=${time}&r=${random}&b=${body}&q=${query}`;
  if (isSign) hashStr = `salt=${salt}&t=${time}&r=${random}`;
  return md5.createHash("md5").update(hashStr).digest("hex");
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
export function getDS(
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
  const md5Str = getMd5Str(method, time, random, salt, dataStr, isSign);
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
  const md5Str = getMd5Str(method, time, random, salt, dataStr, isSign);
  return `${time},${random},${md5Str}`;
}
