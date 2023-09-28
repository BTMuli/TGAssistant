/**
 * @file core types utils.d.ts
 * @description 工具类型声明文件
 * @since 2.0.0
 */

/**
 * @description 工具 namespace
 * @since 2.0.0
 * @namespace TGACore.Utils
 * @memberof TGACore
 */
declare namespace TGACore.Utils {
  /**
   * @description 日期格式化类型枚举
   * @since 2.0.0
   * @memberof TGACore.Utils
   * @enum {number}
   * @readonly
   * @property {number} default 默认格式化类型，yyyy-MM-dd hh:mm:ss
   * @property {number} date 日期格式化类型，yyyy-MM-dd
   * @property {number} time 时间格式化类型，
   * @return FormatTypeEnum 日期格式化类型枚举
   */
  enum FormatTypeEnum {
    default,
    date,
    time,
  }

  /**
   * @description 日期格式化类型
   * @since 2.0.0
   * @memberof TGACore.Utils
   * @returns FormatType 日期格式化类型
   */
  type FormatType = keyof typeof FormatTypeEnum;
}
