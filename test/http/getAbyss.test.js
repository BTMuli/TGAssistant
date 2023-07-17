/**
 * @file test http getAbyss.test.js
 * @description 测试深渊信息的获取
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import assert from "node:assert";
import { describe, it } from "mocha";
// TGAssistant
import { getAbyss } from "../../http/request/getAbyss.js";
import { readCookieItem } from "../../http/tools/readCookie.js";

describe("测试深渊信息获取", () => {
  it("本期深渊", async () => {
    const role_id = "500299765";
    const cookie = {
      cookie_token: readCookieItem("cookie_token"),
      account_id: readCookieItem("account_id"),
      ltoken: readCookieItem("ltoken"),
      ltuid: readCookieItem("ltuid"),
    };
    const res = await getAbyss(cookie, 1, role_id);
    assert.strictEqual(res["schedule_id"], 70);
  });
  it("上期深渊", async () => {
    const role_id = "500299765";
    const cookie = {
      cookie_token: readCookieItem("cookie_token"),
      account_id: readCookieItem("account_id"),
      ltoken: readCookieItem("ltoken"),
      ltuid: readCookieItem("ltuid"),
    };
    const res = await getAbyss(cookie, 2, role_id);
    assert.strictEqual(res["schedule_id"], 69);
  });
});
