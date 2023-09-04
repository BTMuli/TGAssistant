/**
 * @file http request genAuthkey.js
 * @description 获取 authkey 相关的请求函数
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.4.0
 */

// Node
import axios from "axios";
// TGAssistant
import { getHeader } from "../tools/getHeader.js";
import getServerByUid from "../tools/getServerByUid.js";
import HttpConstant from "../constant/index.js";

/**
 * @description 获取 authkey
 * @since 1.4.0
 * @param {Record<string,string>} cookie cookie
 * @param {string} game_uid 游戏 uid
 * @returns {Promise<object>} 请求返回
 */
export async function genAuthkey(cookie, game_uid) {
  const url = "https://api-takumi.mihoyo.com/binding/api/genAuthKey";
  const data = {
    auth_appid: "webview_gacha",
    game_biz: HttpConstant.GAME_BIZ,
    game_uid: Number(game_uid),
    region: getServerByUid(game_uid),
  };
  console.log(data);
  const header = getHeader(cookie, "POST", JSON.stringify(data), "bbs-lk2", true);
  header.Referer = "https://app.mihoyo.com/";
  console.log(header);
  return axios.post(url, data, { headers: header }).then((res) => {
    return res.data;
  });
}
