/**
 * 获取日期并按业务时区转换时间。
 * @since 2.7.0
 */

import { tz } from "@date-fns/tz";
import { format, parseISO } from "date-fns";

/**
 * 按东八区解析并格式化业务时间，无时区输入也按东八区解释。
 * @since 2.7.0
 * @param raw - ISO 时间字符串
 * @returns yyyy-MM-dd HH:mm:ss 格式的东八区时间
 */
export function formatUtc8(raw: string): string {
  const options = { in: tz("Asia/Shanghai") };
  return format(parseISO(raw, options), "yyyy-MM-dd HH:mm:ss", options);
}

/**
 * @description 获取当前日期，格式为 YYYY-MM-DD
 * @since 2.0.0
 * @param {TGACore.Utils.FormatType} formatType 日期格式化类型
 * @returns {string} 当前日期
 */
export function getDate(formatType?: TGACore.Utils.FormatType): string {
  const dateNow = new Date();
  const year = dateNow.getFullYear().toString().padStart(4, "0");
  const month = (dateNow.getMonth() + 1).toString().padStart(2, "0");
  const date = dateNow.getDate().toString().padStart(2, "0");
  const hour = dateNow.getHours().toString().padStart(2, "0");
  const minute = dateNow.getMinutes().toString().padStart(2, "0");
  const second = dateNow.getSeconds().toString().padStart(2, "0");
  const fullDate = `${year}-${month}-${date}`;
  const fullTime = `${hour}:${minute}:${second}`;
  switch (formatType) {
    case "default":
      return `${fullDate} ${fullTime}`;
    case "date":
      return fullDate;
    case "time":
      return fullTime;
    default:
      return `${fullDate} ${fullTime}`;
  }
}
