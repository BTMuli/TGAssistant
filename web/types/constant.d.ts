/**
 * @file web types constant.d.ts
 * @description 常量类型定义文件
 * @since 2.0.0
 */

/**
 * @description 常量类型 namespace
 * @since 2.0.0
 * @namespace TGWeb.Constant
 * @memberof TGWeb
 */
declare namespace TGWeb.Constant {
  /**
   * @description salt 常量类型枚举
   * @since 2.0.0
   * @version 2.50.1
   * @enum {string}
   * @memberof TGWeb.Constant
   * @property {string} BBS_K2 - BBS K2 salt 值
   * @property {string} BBS_LK2 - BBS LK2 salt 值
   * @property {string} X4 - X4 salt 值
   * @property {string} X6 - X6 salt 值
   * @property {string} PROD - PROD salt 值
   * @returns {string} salt 值
   */
  const enum Salt {
    BBS_K2 = "A4lPYtN0KGRVwE5M5Fm0DqQiC5VVMVM3",
    BBS_LK2 = "kkFiNdhyHqZ1VnDRHnU1podIvO4eiHcs",
    X4 = "xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs",
    X6 = "t0qEgfub6cvueAPgR5m9aQWWVciEer7v",
    PROD = "JwYDpKvLj6MrMqqYU6jTKF17KNO2PXoS",
  }

  /**
   * @description salt 类型
   * @since 2.0.0
   * @return SaltType
   */
  type SaltType = keyof typeof Salt;

  /**
   * @description Cookie 类型枚举
   * @since 2.0.0
   * @version 2.50.1
   * @enum {string}
   * @memberof TGWeb.Constant
   * @property {string} AccountId - 账号
   * @property {string} LTUid - 与 ltoken 搭配
   * @property {string} STUid - 与 stoken 搭配
   * @property {string} MId - 与 stoken_v2 搭配
   * @property {string} GameToken - 游戏 token
   * @property {string} CookieToken - Cookie token
   * @property {string} SToken - SToken
   * @property {string} LToken - LToken
   * @returns {string} Cookie 值
   */
  const enum Cookie {
    AccountId = "account_id",
    LTUid = "ltuid",
    STUid = "stuid",
    MId = "mid",
    GameToken = "game_token",
    CookieToken = "cookie_token",
    SToken = "stoken",
    LToken = "ltoken",
  }

  /**
   * @description Cookie 类型
   * @since 2.0.0
   * @return CookieType
   */
  type CookieType = keyof typeof Cookie;
}
