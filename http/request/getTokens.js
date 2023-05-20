/**
 * @file http request getTokens.js
 * @description 获取 ltoken 跟 stoken
 * @author BTMuli<bt-muli@outlok.com>
 * @since 1.1.0
 */

// Node
import axios from "axios";
// TGAssistant
import { getHeader } from "../tools/getHeader.js";


/**
 * @description 根据 login_ticket 获取 stoken 跟 ltoken
 * @since 1.1.0
 * @param {Record<string, string>} cookie cookie
 * @param {Record<string, string>} data data
 * @returns {Promise<Array<name: string, token: string>>}
 */
export async function getTokensByLoginTicket(cookie, data) {
	const url = "https://api-takumi.mihoyo.com/auth/api/getMultiTokenByLoginTicket";
	const params = { login_ticket: data.ticket, token_types: 2, uid: data.uid };
	const header = getHeader(cookie,"GET", params);
	return axios.get(url, { headers:header,params:params }).then(res=>{
		console.log(res.data.data.list);
		return res.data["data"]["list"];
	});
}
