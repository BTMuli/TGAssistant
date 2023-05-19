/**
 * @file http request getRoleList.js
 * @description 获取角色列表
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import axios from "axios";
import qs from "qs";
// TGAssistant
import getHeader from "../tools/getHeader.js";
import getServerByUid from "../tools/getServerByUid.js";

/**
 * @description 通过 cookie 获取角色列表
 * @since 1.1.0
 * @todo invalid request
 * @param {string} cookie cookie
 * @param {string} role_id role_id
 * @returns {Promise<unknown>}
 */
export async function getRoleListByCookie(cookie,  role_id) {
	const url = "https://api-takumi-record.mihoyo.com/game_record/app/genshin/api/character";
	const data = { role_id: role_id, server:getServerByUid(role_id) };
	const header = getHeader(cookie,"POST", qs.stringify(data));
	return axios.post(url, data, { headers: header }).then(res=>{
		return res.data;
	});
}