/**
 * @file http request getGameAccouts.js
 * @description 获取游戏账号
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import axios from "axios";
import qs from "qs";
// TGAssistant
import getHeader from "../tools/getHeader.js";
import HttpConstant from "../constant/index.js";

/**
 * @description 通过 stoken 获取游戏账号
 * @since 1.1.0
 * @param {string} cookie
 * @param {string} stoken
 * @returns {Promise<object>}
 */
export async function getGameAccountsByStoken(cookie, stoken) {
	const url = "https://api-takumi.mihoyo.com/binding/api/getUserGameRolesBySToken";
	const params = { stoke:stoken, game_biz: HttpConstant.GAME_BIZ };
	const header = getHeader(cookie, "GET", qs.stringify(params));
	return axios.get(url, { headers: header, params:params }).then(res=>{
		console.log(res.data);
		return res.data["data"]["list"];
	});
}

/**
 * @description 通过 cookie 获取游戏账号
 * @since 1.1.0
 * @param {string} cookie cookie
 * @returns {Promise<object>}
 */
export async function getGameAccountsByCookie(cookie) {
	const url = "https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie";
	const params = { game_biz: HttpConstant.GAME_BIZ };
	const header = getHeader(cookie, "GET", qs.stringify(params));
	return axios.get(url, { headers:header,params:params }).then(res=>{
		console.log(res.data);
		return res.data["data"]["list"];
	});
}