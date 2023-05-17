/**
 * @file test http getLToken.test.js
 * @description 测试 LToken 的获取
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import { describe, it } from "mocha";
import assert from "node:assert";
// TGAssistant
import { getLTokenBySToken } from "../../http/request/getLToken.js";
import { readCookie, readCookieItem } from "../../http/tools/readCookie.js";

describe("测试 LToken 获取", ()=>{
	it("通过 stoken", async ()=>{
		const cookie = readCookie();
		const stoken = readCookieItem("stoken");
		const res = await getLTokenBySToken(cookie,stoken);
		const ltoken = readCookieItem("ltoken");
		assert.strictEqual(res, ltoken);
	});
});
