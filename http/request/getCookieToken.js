/**
 * @file http request getCookieToken.js
 * @description 获取cookieToken
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import axios from "axios";
import qs from "qs";
// TGAssistant
import { getHeader } from "../tools/getHeader.js";


/**
 * @description 根据 stoken 获取 cookieToken
 * @since 1.1.0
 * @param {string} cookie cookie
 * @param {string} stoken stoken
 * @returns {Promise<string>} cookieToken
 */
export async function getCookieTokenBySToken(cookie, stoken) {
	const url = "https://passport-api.mihoyo.com/account/auth/api/getCookieAccountInfoBySToken";
	const params = { stoken:stoken, };
	const header = getHeader(cookie,"GET", qs.stringify(params));
	return axios.get(url, { headers: header, params: params }).then(res => {
		console.log(res.data);
		return res.data["data"]["cookie_token"];
	});
}
