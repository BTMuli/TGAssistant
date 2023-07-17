/**
 * @file http request getLToken.js
 * @description 获取 LToken
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import axios from "axios";
// TGAssistant
import { getHeader } from "../tools/getHeader.js";

/**
 * @description 根据 stoken 获取 ltoken
 * @since 1.1.0
 * @param {Record<string, string>} cookie cookie
 * @param {string} stoken stoken
 * @returns {Promise<string>} ltoken
 */
export async function getLTokenBySToken(cookie, stoken) {
  const url = "https://passport-api.mihoyo.com/account/auth/api/getLTokenBySToken";
  const params = { stoken: stoken };
  const header = getHeader(cookie, "GET", params);
  return axios.get(url, { headers: header, params: params }).then((res) => {
    console.log(res.data);
    return res.data["data"]["ltoken"];
  });
}
