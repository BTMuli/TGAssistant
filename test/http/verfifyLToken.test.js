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
import LocalSqlite from "../../http/tools/operSQLite.js";

describe("测试 LToken 验证", () => {
	it("测试 func", async ()=>{
		const cookie = await LocalSqlite.getCookie();
		const ltoken = await LocalSqlite.getCookieItem("ltoken");
		const res = await verifyLToken(cookie,ltoken);
		assert.strictEqual(res["retcode"], 0);
	});
});