/**
 * @file test http verifyLToken.test.js
 * @description 测试 LToken 验证
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import { describe, it } from "mocha";
import assert from "node:assert";
// TGAssistant
import { verifyLToken } from "../../http/request/verifyLToken.js";
import { readCookieItem } from "../../http/tools/readCookie.js";
import transCookie from "../../http/tools/transCookie.js";

describe("测试 LToken 验证", () => {
	it("测试 func", async ()=>{
		const ltoken = readCookieItem("ltoken");
		const cookie = {
			ltoken: ltoken,
			ltuid: readCookieItem("ltuid")
		};
		const res = await verifyLToken(transCookie(cookie),ltoken);
		console.log(res);
		assert.strictEqual(res["retcode"], 0);
	});
});