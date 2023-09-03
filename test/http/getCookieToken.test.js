/**
 * @file test http getCookieToken.test.js
 * @description 测试 CookieToken 的获取
 * @author BTMuli <bt-muli@outlook.com>
 * @since 1.4.0
 */

// Node
import assert from "node:assert";
import { describe, it } from "mocha";
// TGAssistant
import {
  getCookieTokenByGameToken,
  getCookieTokenBySToken,
} from "../../http/request/getCookieToken.js";
import { readCookieItem } from "../../http/tools/readCookie.js";

describe("测试 cookieToken 获取", () => {
  it("通过 stoken", async () => {
    const stoken = readCookieItem("stoken");
    const cookie = {
      stoken: stoken,
      stuid: readCookieItem("stuid"),
    };
    const res = await getCookieTokenBySToken(cookie, stoken);
    const cookieToken = readCookieItem("cookie_token");
    assert.strictEqual(res, cookieToken);
  });
  it("通过 game_token", async () => {
    const accountId = readCookieItem("account_id");
    const gameToken = readCookieItem("game_token");
    const res = await getCookieTokenByGameToken(accountId, gameToken);
    const cookieToken = readCookieItem("cookie_token");
    assert.strictEqual(res["cookie_token"], cookieToken);
  });
});
