/**
 * @file http request getUserInfo.js
 * @description 获取用户信息相关请求函数
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import axios from "axios";
// TGAssistant
import { getSignHeader } from "../tools/getHeader.js";

/**
 * @description 根据 cookie 获取用户信息
 * @since 1.1.0
 * @param {Record<string, string>} cookie cookie
 * @returns {Promise<object>} 请求返回
 */
export async function getUserInfo(cookie) {
  const url = "https://bbs-api.miyoushe.com/user/wapi/getUserFullInfo";
  const params = { gids: 2 };
  let header = getSignHeader(cookie, "GET", params);
  return axios.get(url, { headers: header, params: params }).then((res) => {
    console.log(res.data);
    return res.data["data"];
  });
}
