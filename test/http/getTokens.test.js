/**
 * @file test http getTokens.test.js
 * @description 测试 ltoken 跟 stoken 的获取
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import assert from "node:assert";
import { describe, it } from "mocha";
// TGAssistant
import { getTokensByLoginTicket } from "../../http/request/getTokens.js";
import { readCookieItem } from "../../http/tools/readCookie.js";

describe("测试 tokens 获取", () => {
  it("通过 login_ticket", async () => {
    const ticket = readCookieItem("login_ticket");
    const uid = readCookieItem("login_uid");
    const cookie = {
      login_ticket: ticket,
      login_uid: uid,
    };
    const res = await getTokensByLoginTicket(cookie, ticket, uid);
    console.log(res);
    const ltokenTest = readCookieItem("ltoken");
    const ltokenGet = res.find((item) => item["name"] === "ltoken")["token"];
    assert.strictEqual(ltokenTest, ltokenGet);
  });
});
