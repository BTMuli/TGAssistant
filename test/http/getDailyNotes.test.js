/**
 * @file test http getDailyNotes.test.js
 * @description 测试获取实时便笺
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import { describe, it } from "mocha";
import assert from "node:assert";
// TGAssistant
import { getDailyNotes } from "../../http/request/getDailyNotes.js";
import { readCookieItem } from "../../http/tools/readCookie.js";

describe("测试实时便笺获取", ()=>{
	it("通过cookie", async ()=>{
		const role_id = "500299765";
		const cookie = {
			cookie_token: readCookieItem("cookie_token"),
			account_id: readCookieItem("account_id"),
			ltoken: readCookieItem("ltoken"),
			ltuid: readCookieItem("ltuid"),
		};
		const res = await getDailyNotes(cookie, role_id);
		console.log(res);
		assert.strictEqual(res["retcode"], 0);
	});
});