/**
 * @file http request verifyLToken.js
 * @description 验证 lToken 是否有效，无效则返回新的 lToken，有效则返回原 lToken
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import axios from "axios";
// TGAssistant
import { getHeader } from "../tools/getHeader.js";

/**
 * @description 验证 lToken 是否有效
 * @since 1.1.0
 * @param {Record<string, string>} cookie cookie
 * @param {string} ltoken lToken
 * @returns {Promise<object>} 请求返回
 */
export async function verifyLToken(cookie, ltoken) {
	const url = "https://passport-api.mihoyo.com/account/ma-cn-session/web/verifyLtoken";
	const data = { ltoken: ltoken };
	const header = getHeader(cookie, "POST",data);
	return axios.post(url, data, { headers: header }).then(res => {
		return res.data;
	});
}
