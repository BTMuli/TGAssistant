/**
 * 使用到的函数
 * @since 2.5.0
 */
import { tz } from "@date-fns/tz";
import { format, parseISO } from "date-fns";

/**
 * 字符串转 utc8 时间
 * @param raw - 字符串
 * @returns 转换后的时间 yyyy-MM-dd HH:mm:ss
 */
export function str2utc8(raw: string): string {
  return format(parseISO(raw), "yyyy-MM-dd HH:mm:ss", {
    in: tz("Aisa/Shanghai"),
  });
}
