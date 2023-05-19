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
import { getGameCardByCookie, getUserInfoByCookie } from "../../http/request/getGameCard.js";
import { readCookie, readCookieItem } from "../../http/tools/readCookie.js";

describe("测试 GameCard 获取", ()=>{
	it("通过 cookie", async ()=>{
		const cookie = readCookie();
		const uid = readCookieItem("ltuid");
		const res = await getGameCardByCookie(cookie,uid);
		console.log(res);
		assert.strictEqual(res["retcode"], 0);
	});
});

describe("测试 UserInfo 获取", ()=>{
	it("通过 cookie", async ()=>{
		const cookie = readCookie();
		const role_id = "500299765";
		const res = await getUserInfoByCookie(cookie, role_id);
		console.log(res);
		assert.strictEqual(res["retcode"], 0);
	});
});