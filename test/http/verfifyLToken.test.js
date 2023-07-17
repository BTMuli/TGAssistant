/**
 * @file test http verifyLToken.test.js
 * @description 测试 LToken 验证
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import assert from "node:assert";
import { describe, it } from "mocha";
// TGAssistant
import { verifyLToken } from "../../http/request/verifyLToken.js";
import { readCookieItem } from "../../http/tools/readCookie.js";

describe("测试 LToken 验证", () => {
  it("测试 func", async () => {
    const ltoken = readCookieItem("ltoken");
    const cookie = {
      ltoken: ltoken,
      ltuid: readCookieItem("ltuid"),
    };
    const res = await verifyLToken(cookie, ltoken);
    console.log(res);
    assert.strictEqual(res["retcode"], 0);
  });
});
