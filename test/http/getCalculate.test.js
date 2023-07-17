/**
 * @file test http getCalculate.test.js
 * @description 测试养成计算相关请求函数的获取情况
 * @author BTMuli <bt-muli@outlook.com>
 * @since 1.2.0
 */

// Node
import assert from "node:assert";
import { describe, it } from "mocha";
// TGAssistant
import { readCookieItem } from "../../http/tools/readCookie.js";
import {
  getAvatarList,
  getWeaponList,
  getSyncAvatarList,
  getSyncAvatarDetail,
} from "../../http/request/getCalculate.js";

describe("测试养成计算相关请求函数的获取情况", () => {
  it("测试角色列表获取", async () => {
    const cookie = {
      account_id: readCookieItem("account_id"),
      cookie_token: readCookieItem("cookie_token"),
    };
    const res = await getAvatarList(cookie, "500299765");
    console.log(JSON.stringify(res, null, 2));
    assert.strictEqual(res["retcode"], 0);
  });
  it("测试武器列表获取", async () => {
    const cookie = {
      account_id: readCookieItem("account_id"),
      cookie_token: readCookieItem("cookie_token"),
    };
    const res = await getWeaponList(cookie, "500299765");
    assert.strictEqual(res["retcode"], 0);
    console.log(JSON.stringify(res, null, 2));
  });
  it("测试同步角色列表获取", async () => {
    const cookie = {
      account_id: readCookieItem("account_id"),
      cookie_token: readCookieItem("cookie_token"),
    };
    const res = await getSyncAvatarList(cookie, "500299765");
    console.log(JSON.stringify(res, null, 2));
    assert.strictEqual(res["retcode"], 0);
  });
  it("测试同步角色详情获取", async () => {
    const cookie = {
      account_id: readCookieItem("account_id"),
      cookie_token: readCookieItem("cookie_token"),
    };
    const res = await getSyncAvatarDetail(cookie, "500299765", "10000073");
    console.log(JSON.stringify(res, null, 2));
    assert.strictEqual(res["retcode"], 0);
  });
});
