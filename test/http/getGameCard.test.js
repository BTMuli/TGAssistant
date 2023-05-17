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
import { getGameCardByCookie } from "../../http/request/getGameCard.js";
import LocalSqlite from "../../http/tools/operSQLite.js";

describe("测试 GameCard 获取", ()=>{
	it("通过 cookie", async ()=>{
		const cookie = await LocalSqlite.getCookie();
		const uid = await LocalSqlite.getCookieItem("ltuid");
		const res = await getGameCardByCookie(cookie,uid);
		console.log(res);
		assert.strictEqual(res["retcode"], 0);
	});
});
