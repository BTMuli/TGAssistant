/**
 * @file test http getRoleList.test.js
 * @description 测试角色列表的获取
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import assert from "node:assert";
import { describe, it } from "mocha";
// TGAssistant
import { getRoleListByLToken } from "../../http/request/getRoleList.js";
import { readCookieItem } from "../../http/tools/readCookie.js";

describe("测试角色列表获取", () => {
  it("通过 ltoken", async () => {
    const role_id = "500299765";
    const cookie = {
      ltoken: readCookieItem("ltoken"),
      ltuid: readCookieItem("ltuid"),
    };
    const res = await getRoleListByLToken(cookie, role_id);
    console.log(res);
    assert.strictEqual(res["role"]["nickname"], "目棃");
  });
});
