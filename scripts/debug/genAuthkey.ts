/**
 * 显式使用本机 Cookie 调试 authkey 请求，仅输出状态码。
 * @since 2.7.0
 */

import { genAuthkey } from "../../web/request/genAuthkey.ts";
import { readCookieItem } from "../../web/utils/readCookie.ts";

const args = process.argv.slice(2);
if (args.length !== 1 || !/^\d+$/.test(args[0])) {
  console.error("用法：pnpm exec tsx scripts/debug/genAuthkey.ts <游戏 UID>");
  process.exit(1);
}
try {
  const result = await genAuthkey(
    { stoken: readCookieItem("SToken"), mid: readCookieItem("MId") },
    args[0],
  );
  console.info(`authkey 请求状态码：${result.retcode}`);
  if (result.retcode !== 0) process.exitCode = 1;
} catch {
  console.error("authkey 调试失败，请检查本地 Cookie 和网络连接。");
  process.exitCode = 1;
}
