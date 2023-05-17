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
import { readCookie, readCookieItem } from "../../http/tools/readCookie.js";

describe("测试 LToken 验证", () => {
	it("测试 func", async ()=>{
		const cookie = readCookie();
		const ltoken = readCookieItem("ltoken");
		const res = await verifyLToken(cookie,ltoken);
		assert.strictEqual(res["retcode"], 0);
	});
});