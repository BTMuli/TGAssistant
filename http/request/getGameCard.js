/**
 * @file http request getGameCard.js
 * @description 获取 GameCard
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import axios from "axios";
import qs from "qs";
// TGAssistant
import getHeader from "../tools/getHeader.js";
import getServerByUid from "../tools/getServerByUid.js";

/**
 * @description 根据 cookie 获取用户游戏数据
 * @since 1.1.0
 * @todo invalid request
 * @param {string} cookie cookie
 * @param {string} uid mid
 * @returns {Promise<object>}
 */
export function getGameCardByCookie(cookie ,uid){
	const url = "https://api-takumi-record.mihoyo.com/game_record/app/card/wapi/getGameRecordCard";
	const params = { uid:uid };
	// const header = getHeader(cookie, "GET", qs.stringify(params), "common");
	const header = getHeader(cookie, "GET", qs.stringify(params), "prod");
	return axios.get(url,{ headers:header,params:params }).then(res=>{
		// console.log(res.config.headers);
		// console.log(res.config.url);
		return res.data;
	});
}

/**
 * @description 通过 cookie 获取基本信息
 * @since 1.1.0
 * @todo invalid request
 * @param {string} cookie cookie
 * @param {string} role_id role_id
 * @returns {Promise<unknown>}
 */
export function getUserInfoByCookie(cookie, role_id) {
	const url = "https://api-takumi-record.mihoyo.com/game_record/app/genshin/api/index";
	const params = { server: getServerByUid(role_id), role_id: role_id };
	// const header = getHeader(cookie, "GET", qs.stringify(params), "common");
	const header = getHeader(cookie, "GET", qs.stringify(params), "prod");
	return axios.get(url, { headers: header, params: params }).then(res=>{
		// console.log(res.config.headers);
		// console.log(res.config.url);
		return res.data;
	});
}

/**
 * @description 通过 ltoken 获取基本信息
 * @since 1.1.0
 * @todo invalid request
 * @param {string} cookie cookie
 * @param {string} role_id role_id
 * @returns {Promise<unknown>}
 */
export function getUserInfoByLToken(cookie, role_id) {
	const url = "https://api-takumi-record.mihoyo.com/game_record/app/genshin/api/index";
	const params = { role_id: role_id, server: getServerByUid(role_id) };
	// const header = getHeader(cookie, "GET", qs.stringify(params), "commmon");
	const header = getHeader(cookie, "GET", qs.stringify(params), "prod");
	return axios.get(url, { headers: header, params: params }).then(res=>{
		// console.log(res.config.headers);
		// console.log(res.config.url);
		return res.data;
	});
}