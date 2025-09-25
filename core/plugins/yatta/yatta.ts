/**
 * @file core/plugins/yatta/yatta.ts
 * @description Yatta 插件主文件
 * @since 2.4.0
 */
import { YattaWeekDayEnum } from "./enum.ts";

const YATTA_API_VERSION = "60F1";
const YATTA_API_URL = "https://gi.yatta.moe/api/v2/";
const YATTA_SITE_URL = "https://gi.yatta.moe/";
// const YATTA_ASSET_URL = "https://gi.yatta.moe/assets/UI/";
// 国家列表
const YATTA_NATION_LIST: ReadonlyArray<string> = [
  "未知",
  "蒙德",
  "璃月",
  "稻妻",
  "须弥",
  "枫丹",
  "纳塔",
  "挪德卡莱",
];

/**
 * @description 获取 Yatta JSON 数据
 * @since 2.4.0
 * @function fetchJson
 * @template T
 * @param {string} relPath 相对路径
 * @returns {Promise<T>} JSON数据
 */
async function fetchJson<T>(relPath: string): Promise<T> {
  const link = `${YATTA_API_URL}${relPath}?vh=${YATTA_API_VERSION}`;
  const resp = await fetch(link, { headers: { referer: YATTA_SITE_URL } });
  return <T>await resp.json();
}

/**
 * @description 接受数字，返回对应国家字符串
 * @since 2.4.0
 * @function getNationName
 * @param {number} nation 国家编号
 * @returns {string} 国家字符串
 */
function getNationName(nation: number): string {
  if (nation >= YATTA_NATION_LIST.length || nation < 0) return "未知";
  return YATTA_NATION_LIST[nation];
}

const yattaTool = {
  fetchJson,
  nation: getNationName,
  enum: { week: YattaWeekDayEnum },
};

export default yattaTool;
