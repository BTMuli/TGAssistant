/**
 * @file http request getAbyss.js
 * @description 获取深渊信息的请求函数
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import axios from "axios";
// TGAssistant
import { getHeader } from "../tools/getHeader.js";
import getServerByUid from "../tools/getServerByUid.js";

/**
 * @description 获取深渊信息
 * @since 1.1.0
 * @param {Record<string, string>} cookie cookie
 * @param {number} schedule_type 深渊类型 // 1: 本期 2: 上期
 * @param {string} role_id 游戏 id
 * @returns {Promise<object>} 请求返回
 */
export async function getAbyss(cookie, schedule_type, role_id) {
  const url = "https://api-takumi-record.mihoyo.com/game_record/app/genshin/api/spiralAbyss";
  const params = {
    schedule_type: schedule_type,
    role_id: role_id,
    server: getServerByUid(role_id),
  };
  const header = getHeader(cookie, "GET", params);
  console.log(header);
  return axios.get(url, { headers: header, params: params }).then((res) => {
    console.log(res.data);
    return res.data["data"];
  });
}
