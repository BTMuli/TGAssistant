/**
 * @file http request verifyLToken.js
 * @description 验证 lToken 是否有效，无效则返回新的 lToken，有效则返回原 lToken
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import axios from "axios";
// TGAssistant
import getHeader from "../tools/getHeader.js";

/**
 * @description 验证 lToken 是否有效
 * @since 1.1.0
 * @param {string} cookie cookie
 * @param {string} lToken lToken
 * @returns {Promise<object>} 请求返回
 */
export async function verifyLToken(cookie, lToken) {
	const url = "https://passport-api.mihoyo.com/account/ma-cn-session/web/verifyLtoken";
	const data = `ltoken=${lToken}`;
	const header = getHeader(cookie, "POST", data);
	return axios.post(url, { ltoken: lToken }, { headers: header }).then(res => {
		return res.data;
	});
}
