/**
 * @file web/constant/mys.ts
 * @description 米游社客户端常量
 * @since 2.0.0
 */

/**
 * @description salt 版本
 * @since 2.0.0
 * @version 2.50.1
 */
const SaltVersion = "2.50.1";

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
const Salt: TGWeb.Constant.SaltFull = {
  BBS_K2: "A4lPYtN0KGRVwE5M5Fm0DqQiC5VVMVM3",
  BBS_LK2: "kkFiNdhyHqZ1VnDRHnU1podIvO4eiHcs",
  X4: "xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs",
  X6: "t0qEgfub6cvueAPgR5m9aQWWVciEer7v",
  PROD: "JwYDpKvLj6MrMqqYU6jTKF17KNO2PXoS",
};

const MysClient = {
  version: SaltVersion,
  salt: Salt,
};

export default MysClient;
