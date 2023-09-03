/**
 * @file http request getCookieToken.js
 * @description 获取cookieToken
 * @author BTMuli <bt-muli@outlook.com>
 * @since 1.4.0
 */

// Node
import axios from "axios";
// TGAssistant
import { getHeader } from "../tools/getHeader.js";

/**
 * @description 根据 stoken 获取 cookieToken
 * @since 1.1.0
 * @param {Record<string, string>} cookie cookie
 * @param {string} stoken stoken
 * @returns {Promise<string>} cookieToken
 */
export async function getCookieTokenBySToken(cookie, stoken) {
  const url = "https://passport-api.mihoyo.com/account/auth/api/getCookieAccountInfoBySToken";
  const params = { stoken: stoken };
  const header = getHeader(cookie, "GET", params);
  return axios.get(url, { headers: header, params: params }).then((res) => {
    console.log(res.data);
    return res.data["data"]["cookie_token"];
  });
}

/**
 * @description 根据 gameToken 获取 cookie_token
 * @since 1.4.0
 * @param {string} accountId account_id
 * @param {string} gameToken game_token
 * @returns {Promise<string>}
 */
export async function getCookieTokenByGameToken(accountId, gameToken) {
  const url = "https://api-takumi.mihoyo.com/auth/api/getCookieAccountInfoByGameToken";
  const data = { account_id: Number(accountId), game_token: gameToken };
  return axios.post(url, data).then((res) => {
    return res.data["data"];
  });
}
