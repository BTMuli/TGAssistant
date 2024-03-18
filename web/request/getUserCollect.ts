/**
 * @file web/request/getUserCollect.ts
 * @description 获取用户收藏帖子/合集
 * @todo 合集待测试
 * @since 2.2.0
 */

import axios from "axios";

import { getHeaderPC } from "../utils/getHeader.ts";

/**
 * @description 帖子返回数据
 * @since 2.2.0
 * @interface PostData
 * @extends TGWeb.Response.BaseSuccess
 * @property {unknown[]} data.list - 帖子列表
 * @property {boolean} data.is_last - 是否是最后一页
 * @property {string} data.next_offset - 下一页的 offset
 * @return PostData
 */
export interface PostData extends TGWeb.Response.BaseSuccess {
  data: {
    list: unknown[];
    is_last: boolean;
    next_offset: string;
  };
}

/**
 * @description 获取用户收藏帖子
 * @since 2.2.0
 * @param {Record<string, string>} cookie cookie
 * @param {string} offset offset
 * @returns {Promise<PostData>}
 */
export async function getUserCollect(
  cookie: Record<string, string>,
  offset: string = "",
): Promise<PostData> {
  const url = "https://bbs-api.miyoushe.com/post/wapi/userFavouritePost";
  const params: Record<string, string | number> = { size: 20, offset };
  const header = getHeaderPC(cookie, "GET", params, "BBS_LK2", true);
  return await axios
    .get(url, {
      headers: header,
      params,
    })
    .then((res) => res.data);
}
