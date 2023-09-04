/**
 * @file test http request getGachaLogs.js
 * @description 测试获取 authkey 相关的请求函数
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.4.0
 */

// Node
import assert from "node:assert";
import { describe, it } from "mocha";
// TGAssistant
import { genAuthkey } from "../../http/request/genAuthkey.js";
import { readCookieItem } from "../../http/tools/readCookie.js";

describe("测试获取 authkey", () => {
  it("通过 stoken_v2", async () => {
    const cookie = {
      stoken: readCookieItem("stoken"),
      mid: readCookieItem("mid"),
      stuid: readCookieItem("stuid"),
    };
    const game_uid = "500299765";
    const res = await genAuthkey(cookie, game_uid);
    console.log(res);
    assert.strictEqual(res["retcode"], 0);
  });
});
