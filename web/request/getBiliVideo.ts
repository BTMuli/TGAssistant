/**
 * @file web/request/getBiliVideo.ts
 * @description 获取视频播放地址
 * @since 2.0.1
 */

import axios from "axios";
import jsMd5 from "js-md5";

/**
 * @description 获取视频基本信息返回，只写了部分
 * @since 2.0.1
 * @interface BiliViewResponse
 * @property {number} code
 * @property data
 * @property {string} data.cid
 * @return BiliViewResponse
 */
interface BiliViewResponse {
  code: number;
  data: {
    cid: string;
  };
}

/**
 * @description 获取 nav 数据返回，只写了部分
 * @since 2.0.1
 * @interface BiliNavResponse
 * @property {number} code
 * @property data
 * @property {string} data.wbi_img.img_url
 * @property {string} data.wbi_img.sub_url
 * @return BiliNavResponse
 */
interface BiliNavResponse {
  code: number;
  data: {
    wbi_img: {
      img_url: string;
      sub_url: string;
    };
  };
}

/**
 * @description 获取视频播放地址返回，只写了部分
 * @since 2.0.1
 * @interface BiliVideoResponse
 * @property {number} code
 * @property data
 * @property {Array<{url: string}>} data.durl
 * @return BiliVideoResponse
 */
interface BiliVideoResponse {
  code: number;
  data: {
    durl: Array<{
      url: string;
    }>;
  };
}

/**
 * @description 获取视频基本信息
 * @since 2.0.1
 * @param {string} [aid] 视频 av 号
 * @param {string} [bvid] 视频 bv 号
 * @returns {Promise<BiliViewResponse>}
 */
export async function getBiliView(aid?: string, bvid?: string): Promise<BiliViewResponse> {
  const url = "https://api.bilibili.com/x/web-interface/view";
  const params = {
    aid,
    bvid,
  };
  return await axios.get(url, { params }).then((res) => res.data);
}

/**
 * @description 获取 mixin key
 * @since 2.0.1
 * @param {string} [img] nav 数据中的 img_url
 * @param {string} [sub] nav 数据中的 sub_url
 * @returns {Promise<string>}
 */
export async function getMixinKey(img?: string, sub?: string): Promise<string> {
  const url = "https://api.bilibili.com/x/web-interface/nav";
  const nav: BiliNavResponse = await axios.get(url).then((res) => res.data);
  // @ts-expect-error 有可能是 undefined
  const image = img ?? nav.data.wbi_img.img_url.split("/").pop().split(".")[0];
  // @ts-expect-error 有可能是 undefined
  const subImage = sub ?? nav.data.wbi_img.sub_url.split("/").pop().split(".")[0];
  const navStr = image + subImage;
  const mixinArr = [
    46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9, 42, 19, 29,
    28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25,
    54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52,
  ];
  let res: string = "";
  mixinArr.map((item) => {
    return (res += navStr[item]);
  });
  res = res.slice(0, 32);
  return res;
}

/**
 * @description 获取视频播放地址
 * @since 2.0.1
 * @param {string} cid 视频 cid
 * @param {string} [avid] 视频 av 号
 * @param {string} [bvid] 视频 bv 号
 * @returns {Promise<BiliVideoResponse>}
 */
export async function getBiliVideo(cid: string, bvid: string): Promise<BiliVideoResponse> {
  const url = "https://api.bilibili.com/x/player/wbi/playurl";
  let params: Record<string, string | number> = {
    bvid,
    cid,
    fnval: 16,
    platform: "pc",
  };
  const wts = Math.floor(Date.now() / 1000);
  const paramCopy: Record<string, string | number> = {
    ...params,
    wts,
  };
  const mixinKey = await getMixinKey();
  let sign = "";
  const len = Object.keys(paramCopy).length - 1;
  for (let i = 0; i < len; i++) {
    const key = Object.keys(paramCopy)[i];
    const value = paramCopy[key];
    if (i === len - 1) {
      sign += `${key}=${value}`;
    } else {
      sign += `${key}=${value}&`;
    }
  }
  sign = jsMd5.md5(`${sign}${mixinKey}`);
  params = {
    ...params,
    w_rid: sign,
    wts,
  };
  return await axios
    .get(url, {
      params,
      headers: {
        Referer: "https://www.bilibili.com/",
      },
    })
    .then((res) => {
      return res.data;
    });
}
