/**
 * @file http request getCalculate.js
 * @description 养成计算器相关请求函数
 * @author BTMuli <bt-muli@outlook.com>
 * @since 1.2.0
 */

// Node
import axios from "axios";
// TGAssistant
import getServerByUid from "../tools/getServerByUid.js";
import transCookie from "../tools/transCookie.js";

// base url
const baseUrl = "https://api-takumi.mihoyo.com/event/e20200928calculate/";

/**
 * @description 获取角色列表
 * @since 1.2.0
 * @param {Record<string, string>} cookie cookie
 * @param {string} uid 游戏 id
 * @param {number} page 页数
 * @returns {Promise<object>} 请求返回
 */
export async function getAvatarList(cookie, uid, page = 1) {
  const url = `${baseUrl}v1/avatar/list`;
  const data = {
    uid: uid,
    region: getServerByUid(uid),
    page: page,
  };
  const header = {
    "User-Agent": "TGAssistant/1.2.0",
    "Referer": "https://webstatic.mihoyo.com/",
    "Cookie": transCookie(cookie),
  };
  return axios.post(url, data, { headers: header }).then((res) => res.data);
}

/**
 * @description 获取武器列表
 * @since 1.2.0
 * @param {Record<string, string>} cookie cookie
 * @param {string} uid 游戏 id
 * @param {number} page 页数
 * @returns {Promise<object>} 请求返回
 */
export async function getWeaponList(cookie, uid, page = 1) {
  const url = `${baseUrl}v1/weapon/list`;
  const data = {
    uid: uid,
    region: getServerByUid(uid),
    page: page,
  };
  const header = {
    "User-Agent": "TGAssistant/1.2.0",
    "Referer": "https://webstatic.mihoyo.com/",
    "Cookie": transCookie(cookie),
  };
  return axios.post(url, data, { headers: header }).then((res) => res.data);
}

/**
 * @description 获取同步的角色列表
 * @since 1.2.0
 * @param {Record<string, string>} cookie cookie
 * @param {string} uid 游戏 id
 * @param {number} page 页数
 * @returns {Promise<object>} 请求返回
 */
export async function getSyncAvatarList(cookie, uid, page = 1) {
  const url = `${baseUrl}v1/sync/avatar/list`;
  const data = {
    uid: uid,
    region: getServerByUid(uid),
    page: page,
  };
  const header = {
    "User-Agent": "TGAssistant/1.2.0",
    "Referer": "https://webstatic.mihoyo.com/",
    "Cookie": transCookie(cookie),
  };
  return axios.post(url, data, { headers: header }).then((res) => res.data);
}

/**
 * @description 获取同步的角色详情
 * @since 1.2.0
 * @param {Record<string, string>} cookie cookie
 * @param {string} uid 游戏 id
 * @param {string} avatarId 角色 id
 * @returns {Promise<object>} 请求返回
 */
export async function getSyncAvatarDetail(cookie, uid, avatarId) {
  const url = `${baseUrl}v1/sync/avatar/detail`;
  const param = {
    uid: uid,
    region: getServerByUid(uid),
    avatar_id: avatarId,
  };
  const header = {
    "User-Agent": "TGAssistant/1.2.0",
    "Referer": "https://webstatic.mihoyo.com/",
    "Cookie": transCookie(cookie),
  };
  return axios.get(url, { headers: header, params: param }).then((res) => res.data);
}
