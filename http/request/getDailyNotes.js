/**
 * @file http request getDailyNotes.js
 * @description 获取实时便笺信息
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import axios from "axios";
// TGAssistant
import { getHeader } from "../tools/getHeader.js";
import getServerByUid from "../tools/getServerByUid.js";

/**
 * @description 获取实时便笺信息
 * @since 1.1.0
 * @param {Record<string, string>} cookie cookie
 * @param {string} role_id 游戏 id
 * @returns {Promise<object>} 请求返回
 */
export async function getDailyNotes(cookie, role_id) {
	const url = "https://api-takumi-record.mihoyo.com/game_record/app/genshin/api/dailyNote";
	const params = { role_id: role_id, server: getServerByUid(role_id) };
	const header = getHeader(cookie,"GET", params);
	return axios.get(url, { headers: header, params: params }).then(res => {
		return res.data;
	});
}