/**
 * @file test http getGameAccounts.test.js
 * @description 测试游戏账号的获取
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import { describe, it } from "mocha";
import assert from "node:assert";
// TGAssistant
import { getGameAccountsByCookie, getGameAccountsByStoken } from "../../http/request/getGameAccounts.js";
import { readCookie, readCookieItem } from "../../http/tools/readCookie.js";

describe("测试游戏账号获取", ()=>{
	it("通过 cookie", async ()=>{
		const cookie =readCookie();
		const res = await getGameAccountsByCookie(cookie);
		assert.strictEqual(res.length, 2);
		const resFind = res.find(item => item["is_chosen"] === true);
		assert.strictEqual(resFind["level"], 60);

	});
	it("通过 stoken", async () => {
		const cookie = readCookie();
		const stoken = readCookieItem("stoken");
		const res = await getGameAccountsByStoken(cookie, stoken);
		assert.strictEqual(res.length, 2);
		const resFind = res.find(item => item["is_chosen"] === true);
		assert.strictEqual(resFind["level"], 60);
	});
});