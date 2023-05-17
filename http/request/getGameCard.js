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
	const header = getHeader(cookie, "GET", qs.stringify(params));
	return axios.get(url,{ headers:header,params:params }).then(res=>{
		console.log(res.data);
		return res.data;
	});

}