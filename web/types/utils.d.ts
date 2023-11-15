/**
 * @file web/types/utils.d.ts
 * @description 工具类型定义文件
 * @since 2.0.0
 */

/**
 * @description 工具类型 namespace
 * @since 2.0.0
 * @namespace TGWeb.Utils
 * @memberof TGWeb
 */
declare namespace TGWeb.Utils {
  /**
   * @description getRandomSring 字符串类型枚举
   * @since 2.0.0
   * @enum {string}
   * @memberof TGWeb.Utils
   * @property {string} number - 数字
   * @property {string} lower - 小写字母
   * @property {string} upper - 大写字母
   * @property {string} letter - 字母
   * @property {string} hex - 十六进制
   * @property {string} all - 全部
   * @returns {string} 字符串类型
   */
  enum RandomStringType {
    number,
    lower,
    upper,
    letter,
    hex,
    all,
  }

  /**
   * @description getRandomSring 字符串类型枚举键值
   * @since 2.0.0
   * @memberof TGWeb.Utils
   */
  type RandomStringTypeKey = keyof typeof RandomStringType;
}
