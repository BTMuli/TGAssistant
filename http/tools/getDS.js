/**
 * @file http tools getDS.js
 * @description DS 算法
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import md5 from "node:crypto";
// TGAssistant
import HttpConstant from "../constant/index.js";

/**
 * @description 获取随机数
 * @since 1.1.0
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number} 随机数
 */
function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * @description 获取随机字符串
 * @since 1.1.0
 * @param {number} length 字符串长度
 * @returns {string} 随机字符串
 */
function getRandomString(length) {
	const str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let res = "";
	for (let i = 0; i < length; i++) {
		res += str[getRandomNumber(0, str.length - 1)];
	}
	return res;
}

/**
 * @description 根据 saltType 获取 salt
 * @since 1.1.0
 * @param {string} saltType salt 类型
 * @returns {string} salt
 */
function getSalt(saltType) {
	switch (saltType) {
	case "common":
		return HttpConstant.Salt.Other.X4;
	case "prod":
		return HttpConstant.Salt.Other.prod;
	case "x6":
		return HttpConstant.Salt.Other.X6;
	case "bbs-k2":
		return HttpConstant.Salt.BBS.K2;
	case "bbs-lk2":
		return HttpConstant.Salt.BBS.LK2;
	default:
		return HttpConstant.Salt.Other.X4;
	}
}

/**
 * @description 获取 DS
 * @since 1.1.0
 * @param {string} method 请求方法
 * @param {string} data 请求数据
 * @param {string} saltType salt 类型
 * @param {boolean} isSign 是否为签名
 * @returns {string} DS
 */
export function getDS(method, data, saltType, isSign=false) {
	const salt = getSalt(saltType);
	let random = getRandomNumber(100000, 200000);
	if(isSign) random = getRandomString(6);
	const time = Math.floor(Date.now() / 1000).toString();
	const body = method==="POST" ? data : "";
	const query = method==="GET" ? data : "";
	const hashStr = `salt=${salt}&t=${time}&r=${random}&b=${body}&q=${query}`;
	const md5Str = md5.createHash("md5").update(hashStr).digest("hex");
	return `${time},${random},${md5Str}`;
}

/**
 * @description 测试DS
 * @since 1.1.0
 * @param {string} random 随机数
 * @param {string} time 时间戳
 * @param {string} method 请求方法
 * @param {string} data 请求数据
 * @param {string} saltType salt 类型
 * @param {boolean} isSign 是否为签名
 * @returns {string} DS
 */
export function getTestDS(random, time, method, data, saltType="common", isSign=false) {
	const salt = getSalt(saltType);
	const body = method==="POST" ? data : "";
	const query = method==="GET" ? data : "";
	const hashStr = `salt=${salt}&t=${time}&r=${random}&b=${body}&q=${query}`;
	const md5Str = md5.createHash("md5").update(hashStr).digest("hex");
	return `${time},${random},${md5Str}`;
}