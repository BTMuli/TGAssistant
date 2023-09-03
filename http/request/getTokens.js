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
 * @param {string} ticket login_ticket
 * @param {string} uid login_uid
 * @returns {Promise<Array<name: string, token: string>>}
 */
export async function getTokensByLoginTicket(cookie, ticket, uid) {
  const url = "https://api-takumi.mihoyo.com/auth/api/getMultiTokenByLoginTicket";
  const params = { login_ticket: ticket, token_types: 2, uid: uid };
  const header = getHeader(cookie, "GET", params);
  return axios.get(url, { headers: header, params: params }).then((res) => {
    console.log(res.data.data.list);
    return res.data["data"]["list"];
  });
}

/**
 * @description 根据 game_token 获取 stoken
 * @since 1.4.0
 * @param {string} accountId account_id
 * @param {string} gameToken game_token
 * @returns {Promise<string>}
 */
export async function getStokenByGameToken(accountId, gameToken) {
  const url = "https://api-takumi.mihoyo.com/account/ma-cn-session/app/getTokenByGameToken";
  const data = { account_id: Number(accountId), game_token: gameToken };
  const header = {
    "x-rpc-app_id": "bll8iq97cem8",
  };
  return axios
    .post(url, data, {
      headers: header,
    })
    .then((res) => {
      return res.data["data"];
    });
}
