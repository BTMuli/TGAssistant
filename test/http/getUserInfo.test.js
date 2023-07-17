/**
 * @file test http getUserInfo.test.js
 * @description 测试用户信息的获取
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import assert from "node:assert";
import { describe, it } from "mocha";
// TGAssistant
import { getUserInfo } from "../../http/request/getUserInfo.js";
import { readCookieItem } from "../../http/tools/readCookie.js";

describe("测试用户信息获取", () => {
  it("通过 cookie", async () => {
    const cookie = {
      cookie_token: readCookieItem("cookie_token"),
      account_id: readCookieItem("account_id"),
    };
    const res = await getUserInfo(cookie);
    assert.strictEqual(res["user_info"]["nickname"], "目棃");
  });
});
