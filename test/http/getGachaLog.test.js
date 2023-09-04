/**
 * @file test http getGachaLog.test.js
 * @description 测试获取抽卡记录相关的请求函数
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.4.0
 */

// Node
import assert from "node:assert";
import { describe, it } from "mocha";
// TGAssistant
import { getGachaLogs } from "../../http/request/getGachaLogs.js";
import { genAuthkey } from "../../http/request/genAuthkey.js";
import { readCookieItem } from "../../http/tools/readCookie.js";

let authkey = "";

describe("测试获取抽卡记录", () => {
  it("获取 authkey", async () => {
    const cookie = {
      stoken: readCookieItem("stoken"),
      mid: readCookieItem("mid"),
    };
    const game_uid = "500299765";
    const resAuthKey = await genAuthkey(cookie, game_uid);
    console.log(resAuthKey);
    assert.strictEqual(resAuthKey["retcode"], 0);
    const authkey = resAuthKey["data"]["authkey"];
    const resLogs = await getGachaLogs(authkey, 301);
    console.log(resLogs);
    assert.strictEqual(resLogs["retcode"], 0);
  });
});
