/**
 * @file test http getCookieToken.test.js
 * @description 测试 CookieToken 的获取
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import { describe, it } from "mocha";
import assert from "node:assert";
// TGAssistant
import { getCookieTokenBySToken } from "../../http/request/getCookieToken.js";
import LocalSqlite from "../../http/tools/operSQLite.js";

describe("测试 cookieToken 获取", ()=>{
	it("通过 stoken", async ()=>{
		const stoken = await LocalSqlite.getCookieItem("stoken");
		const cookie = JSON.stringify(await LocalSqlite.getCookie());
		const res = await getCookieTokenBySToken(cookie, stoken);
		const cookieToken = await LocalSqlite.getCookieItem("cookie_token");
		assert.strictEqual(res, cookieToken);
	});
});