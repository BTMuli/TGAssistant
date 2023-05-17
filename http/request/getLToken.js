/**
 * @file http request getLToken.js
 * @description 获取 LToken
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import axios from "axios";
// TGAssistant
import getHeader from "../tools/getHeader.js";

/**
 * @description 根据 stoken 获取 ltoken
 * @since 1.1.0
 * @param {string} cookie cookie
 * @param {string} SToken stoken
 * @returns {Promise<string>} ltoken
 */
export async function getLTokenBySToken(cookie, SToken){
	const urlPre = "https://passport-api.mihoyo.com/account/auth/api/getLTokenBySToken";
	const urlCur = `stoken=${SToken}`;
	const url = `${urlPre}?${urlCur}`;
	const header = getHeader(cookie, "GET", urlCur);
	return await axios.get(url, { headers: header }).then(res=>{
		return res.data["data"]["ltoken"];
	});
}