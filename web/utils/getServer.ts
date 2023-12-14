/**
 * @file web/utils/getServer.ts
 * @description 获取服务器
 * @since 2.0.0
 */

/**
 * @description 服务器类型枚举
 * @since 2.0.0
 * @enum {string}
 * @memberof TGWeb.Server
 * @property {string} CN_GF - 国服
 * @property {string} CN_QD - 渠道服
 * @property {string} USA - 美服
 * @property {string} EU - 欧服
 * @property {string} ASIA - 亚服
 * @property {string} TW - 台服
 * @property {string} NONE - 无
 * @returns {string} 服务器
 */
const enum Server {
  CN_GF = "cn_gf01",
  CN_QD = "cn_qd01",
  USA = "os_usa",
  EU = "os_euro",
  ASIA = "os_asia",
  TW = "cht",
  NONE = "",
}

/**
 * @function getServerByUid
 * @description 通过 uid 获取服务器
 * @since 2.0.0
 * @param {string} uid uid
 * @returns {Server} 服务器
 */
export function getServerByUid(uid: string): Server {
  const first = uid[0];
  if (first >= "1" && first <= "4") return Server.CN_GF;
  if (first === "5") return Server.CN_QD;
  if (first === "6") return Server.USA;
  if (first === "7") return Server.EU;
  if (first === "8") return Server.ASIA;
  if (first === "9") return Server.TW;
  return Server.NONE;
}
