/**
 * @file test http getLToken.test.js
 * @description 测试 LToken 的获取
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import assert from "node:assert";
import { describe, it } from "mocha";
// TGAssistant
import { getLTokenBySToken } from "../../http/request/getLToken.js";
import { readCookieItem } from "../../http/tools/readCookie.js";

describe("测试 LToken 获取", () => {
  it("通过 stoken", async () => {
    const stoken = readCookieItem("stoken");
    const cookie = {
      stoken: readCookieItem("stoken"),
      stuid: readCookieItem("stuid"),
    };
    const res = await getLTokenBySToken(cookie, stoken);
    const ltoken = readCookieItem("ltoken");
    assert.strictEqual(res, ltoken);
  });
});
