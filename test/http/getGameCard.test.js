/**
 * @file test http getGameCard.test.js
 * @description 测试 GameCard 的获取
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import { describe, it } from "mocha";
import assert from "node:assert";
// TGAssistant
import { getGameCardByCookie, getUserInfoByLToken, getUserInfoByCookie } from "../../http/request/getGameCard.js";
import { readCookie, readCookieItem } from "../../http/tools/readCookie.js";
import transCookie from "../../http/tools/transCookie.js";

describe("测试 GameCard 获取", ()=>{
	it("通过 cookie", async ()=>{
		const uid = readCookieItem("account_id");
		const cookie = {
			account_id: uid,
			cookie_token: readCookieItem("cookie_token"),

		};
		const res = await getGameCardByCookie(transCookie(cookie),uid);
		console.log(res);
		assert.strictEqual(res["retcode"], 0);
	});
});

describe("测试 UserInfo 获取", ()=>{
	it("通过 ltoken", async ()=>{
		const role_id = "500299765";
		const cookie = {
			ltuid: readCookieItem("ltuid"),
			ltoken: readCookieItem("ltoken"),
		};
		const res = await getUserInfoByLToken(transCookie(cookie), role_id);
		// const cookie = readCookie();
		// const res = await getUserInfoByLToken(transCookie(cookie), role_id);
		console.log(res);
		assert.strictEqual(res["retcode"], 0);
	});
	it("通过 cookie", async ()=>{
		const role_id = "500299765";
		const cookie = {
			account_id: readCookieItem("account_id"),
			cookie_token: readCookieItem("cookie_token"),
		};
		const res = await getUserInfoByCookie(transCookie(cookie), role_id);
		// const cookie = readCookie();
		// const res = await getUserInfoByLToken(transCookie(cookie), role_id);
		console.log(res);
		assert.strictEqual(res["retcode"], 0);
	});
});
