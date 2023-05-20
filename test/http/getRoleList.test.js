/**
 * @file test http getRoleList.test.js
 * @description 测试角色列表的获取
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import { describe, it } from "mocha";
import assert from "node:assert";
// TGAssistant
import { getRoleListByCookie } from "../../http/request/getRoleList.js";
import { readCookieItem } from "../../http/tools/readCookie.js";

describe("测试角色列表获取", ()=>{
	it("通过 cookie",async ()=>{
		const role_id = "500299765";
		const cookie = {
			ltoken: readCookieItem("ltoken"),
			ltuid: readCookieItem("ltuid")
		};
		const character_ids = [10000076];
		const res = await getRoleListByCookie(cookie, role_id, character_ids);
		console.log(res);
		assert.strictEqual(res["retcode"], 0);
	});
});