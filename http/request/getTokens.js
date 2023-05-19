/**
 * @file http request getTokens.js
 * @description 获取 ltoken 跟 stoken
 * @author BTMuli<bt-muli@outlok.com>
 * @since 1.1.0
 */

// Node
import axios from "axios";
import qs from "qs";
// TGAssistant
import getHeader from "../tools/getHeader.js";


/**
 * @description 根据 login_ticket 获取 stoken 跟 ltoken
 * @since 1.1.0
 * @param {string} cookie cookie
 * @param {string} ticket login_ticket
 * @param {string} uid login_uid
 * @returns {Promise<Array<name: string, token: string>>}
 */
async function getTokensByLoginTicket(cookie, ticket, uid) {
	const url = "https://api-takumi.mihoyo.com/auth/api/getMultiTokenByLoginTicket";
	const params = { login_ticket: ticket, token_types: 2, uid: uid };
	const header = getHeader(cookie, "GET", qs.stringify(params), "common");
	return axios.get(url, { headers:header,params:params }).then(res=>{
		console.log(res.data.data.list);
		return res.data["data"]["list"];
	});
}

export default getTokensByLoginTicket;