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
import { readCookieItem } from "../../http/tools/readCookie.js";
import { transCookie } from "../../http/tools/utils.js";

describe("测试 cookieToken 获取", ()=>{
	it("通过 stoken", async ()=>{
		const stoken = readCookieItem("stoken");
		const cookie = {
			stoken: stoken,
			mid: readCookieItem("mid"),
		};
		const res = await getCookieTokenBySToken(transCookie(cookie), stoken);
		const cookieToken = readCookieItem("cookie_token");
		assert.strictEqual(res, cookieToken);
	});
});