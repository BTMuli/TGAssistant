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
import { getRandomNumber } from "./utils.js";

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
 * @returns {string} DS
 */
function getDS(method, data, saltType) {
	const salt = getSalt(saltType);
	const params = {
		salt: salt,
		t: Math.floor(Date.now() / 1000).toString(),
		r: getRandomNumber(100000, 200000).toString(),
		b: method==="POST" ? data : "",
		q: method==="GET" ? data : "",
	};
	const md5Str = md5.createHash("md5").update(qs.stringify(params)).digest("hex");
	return `${params.t},${params.r},${md5Str}`;
}


export default getDS;
