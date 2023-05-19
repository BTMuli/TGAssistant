/**
 * @file http tools getDS.js
 * @description DS 算法
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import qs from "qs";
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
 * @param {string} query query
 * @param {string} body body
 * @returns {string} DS
 */
export function getDS(query="", body="") {
	const salt = HttpConstant.Salt.Other.X4;
	const random = getRandomNumber(100000, 200000);
	const params = {
		salt: salt,
		t: Math.floor(Date.now() / 1000).toString(),
		r: random === 100000 ? 642367 : random,
		b: body,
		q: query,
	};
	const md5Str = md5.createHash("md5").update(qs.stringify(params)).digest("hex");
	return `${params.t},${params.r},${md5Str}`;
}

/**
 * @description 获取新的 DS
 * @since 1.1.0
 * @param {string} saltType salt 类型
 * @returns {string} DS
 */
export function getNewDS(saltType) {
	const salt = getSalt(saltType);
	const params = {
		salt: salt,
		t: Math.floor(Date.now() / 1000).toString(),
		r: getRandomString(6),
	};
	const md5Str = md5.createHash("md5").update(qs.stringify(params)).digest("hex");
	return `${params.t},${params.r},${md5Str}`;
}