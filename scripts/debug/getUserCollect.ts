/**
 * 显式读取本机账号数据库并调试收藏请求，仅输出状态和总数。
 * @since 2.7.0
 */

import { getUserCollect } from "../../web/request/getUserCollect.ts";
import { flushDB, readCookieItem } from "../../web/utils/readCookie.ts";

try {
  await flushDB();
  const cookie = {
    cookie_token: readCookieItem("cookie_token"),
    account_id: readCookieItem("account_id"),
  };
  let offset = "";
  let count = 0;
  while (true) {
    const result = await getUserCollect(cookie, offset);
    if (result.retcode !== 0) {
      console.error(`收藏请求状态码：${result.retcode}`);
      process.exitCode = 1;
      break;
    }
    count += result.data.list.length;
    if (result.data.is_last) {
      console.info(`收藏请求完成，共 ${count} 条。`);
      break;
    }
    offset = result.data.next_offset;
  }
} catch {
  console.error("收藏调试失败，请检查本机数据库、Cookie 和网络连接。");
  process.exitCode = 1;
}
