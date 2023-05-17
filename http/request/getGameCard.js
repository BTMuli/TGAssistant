/**
 * @file http request getGameCard.js
 * @description 获取 GameCard
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import axios from "axios";
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
	const urlPre = "https://api-takumi-record.mihoyo.com/game_record/app/card/wapi/getGameRecordCard";
	const urlCur = `uid=${uid}`;
	const url = `${urlPre}?${urlCur}`;
	const header = getHeader(cookie, "GET", urlCur);
	console.log(header);
	return axios.get(url,{ headers:header }).then(res=>{
		console.log(res.data);
		return res.data;
	});

}