/**
 * @file test http operSQLite.test.js
 * @description SQLite 数据库操作测试
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import { describe, it } from "mocha";
import assert from "node:assert";
// TGAssistant
import HttpConstant from "../../http/constant/index.js";
import LocalSqlite from "../../http/tools/operSQLite.js";

describe("测试 SQLite", ()=>{
	it("测试数据库路径", ()=>{
		const localPath = HttpConstant.SqlPath;
		const testPath = "C:\\Users\\19278\\AppData\\Roaming\\tauri-genshin\\tauri-genshin.db";
		assert.strictEqual(localPath, testPath);
	});
	it("测试数据读取", async () => {
		const sql = "select * from AppData where key='appVersion';";
		const res = await LocalSqlite.selectSingle(sql);
		const versionTest = "0.2.0";
		assert.strictEqual(res.value, versionTest);
		LocalSqlite.closeDB();
	});
	it("测试 cookie 获取",async ()=>{
		const cookie = await LocalSqlite.getCookie();
		assert.strictEqual(cookie["account_id"], "249066520");
	});
	it("测试 cookie 项获取", async  ()=>{
		const accountId = await LocalSqlite.getCookieItem("account_id");
		assert.strictEqual(accountId, "249066520");
	});
});