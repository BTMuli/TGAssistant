/**
 * @file core/archive/birthday/request.ts
 * @description 存档-留影叙佳期-请求
 * @since 2.1.0
 */

import axios from "axios";

import { TEMP_CK } from "./temp.ts";

const header = {
  cookie: TEMP_CK,
};

/**
 * @description 获取画片数据
 * @since 2.1.0
 * @param {string} uid badge_uid
 * @param {string} region badge_region
 * @param {string} biz game_biz
 * @param {string} page page
 * @return {Promise<TGACore.Archive.Birthday.DrawResponse>} 返回 Promise
 */
export async function getDraw(
  page: string = "1",
  uid: string = "500299765",
  region: string = "cn_qd01",
  biz: string = "hk4e_cn",
): Promise<TGACore.Archive.Birthday.DrawResponse> {
  const url = "https://hk4e-api.mihoyo.com/event/birthdaystar/account/draw_collection";
  const params = {
    badge_uid: uid,
    badge_region: region,
    game_biz: biz,
    activity_id: "20220301153521",
    page,
  };
  return await axios.get(url, { params, headers: header }).then((res) => res.data);
}

/**
 * @description 获取日历数据
 * @since 2.1.0
 * @param {string} uid badge_uid
 * @param {string} region badge_region
 * @param {string} biz game_biz
 * @param {string} year year 2022-2024
 * @return {Promise<TGACore.Archive.Birthday.CalendarResponse>} 返回 Promise
 */
export async function getCalendar(
  year: string = "2022",
  uid: string = "500299765",
  region: string = "cn_qd01",
  biz: string = "hk4e_cn",
): Promise<TGACore.Archive.Birthday.CalendarResponse> {
  const url = "https://hk4e-api.mihoyo.com/event/birthdaystar/account/calendar";
  const params = {
    badge_uid: uid,
    badge_region: region,
    game_biz: biz,
    activity_id: "20220301153521",
    year,
  };
  return await axios.get(url, { headers: header, params }).then((res) => res.data);
}

/**
 * @description 获取角色信息
 * @since 2.1.0
 * @param {number} role role_id
 * @param {number} uid badge_uid
 * @param {string} region badge_region
 * @param {string} biz game_biz
 * @param {string} year year 2022-2024
 * @return {Promise<TGACore.Archive.Birthday.CharacterResponse>} 返回 Promise
 */
export async function getCharacter(
  role: number = 10000001,
  year: number = 2022,
  uid: string = "500299765",
  region: string = "cn_qd01",
  biz: string = "hk4e_cn",
): Promise<TGACore.Archive.Birthday.CharacterResponse> {
  const url = "https://hk4e-api.mihoyo.com/event/birthdaystar/account/get_role_info";
  const params = {
    badge_uid: uid,
    badge_region: region,
    game_biz: biz,
    activity_id: "20220301153521",
    year,
    role_id: role,
  };
  return await axios.get(url, { headers: header, params }).then((res) => res.data);
}
