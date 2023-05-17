/**
 * @file http request getCookieToken.js
 * @description 获取cookieToken
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import axios from "axios";
// TGAssistant
import getHeader from "../tools/getHeader.js";


/**
 * @description 根据 stoken 获取 cookieToken
 * @param {string} cookie cookie
 * @param {string} SToken sToken
 * @returns {Promise<string>} cookieToken
 */
export async function getCookieTokenBySToken(cookie, SToken) {
	const urlPre = "https://passport-api.mihoyo.com/account/auth/api/getCookieAccountInfoBySToken";
	const urlCur = `stoken=${SToken}`;
	const url = `${urlPre}?${urlCur}`;
	const header = getHeader(cookie, "GET", urlCur);
	return await axios.get(url, { headers: header }).then(res => {
		return res.data["data"]["cookie_token"];
	});
}
