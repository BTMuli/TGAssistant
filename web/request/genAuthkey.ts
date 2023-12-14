/**
 * @file web/request/genAuthkey.ts
 * @description 生成 authkey
 * @since 2.0.0
 */

import axios from "axios";

import MysClient from "../constant/mys.ts";
import { getHeaderPC } from "../utils/getHeader.ts";
import { getServerByUid } from "../utils/getServer.ts";

/**
 * @description 返回数据
 * @since 2.0.0
 * @interface ResponseData
 * @property {number} sign_type - 签名类型
 * @property {number} authkey_ver - authkey 类型
 * @property {string} authkey - authkey
 * @return ResponseData
 */
export interface ResponseData {
  sign_type: number;
  authkey_ver: number;
  authkey: string;
}

/**
 * @description 生成 authkey
 * @since 2.0.0
 * @param {Record<string, string>} cookie cookie
 * @param {string} uid uid
 * @returns {Promise<TGWeb.Response.Common>}
 */
export async function genAuthkey(
  cookie: Record<string, string>,
  uid: string,
): Promise<TGWeb.Response.CommonT<ResponseData>> {
  const url = "https://api-takumi.mihoyo.com/binding/api/genAuthKey";
  const data = {
    auth_appid: "webview_gacha", // 可能有其他值
    game_biz: MysClient.game.biz,
    game_uid: uid,
    region: getServerByUid(uid),
  };
  const header = getHeaderPC(cookie, "POST", data, "BBS_LK2", true);
  return await axios
    .post(url, data, {
      headers: header,
    })
    .then((res) => res.data);
}
