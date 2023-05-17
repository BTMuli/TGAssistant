/**
 * @file http tools operSQLite.js
 * @description 操作 SQLite 数据库
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import sqlite3 from "sqlite3";
// TGAssistant
import HttpConstant from "../constant/index.js";
import { transCookie } from "./utils.js";

class LocalSqlite {
	constructor() {
		this.db = new (sqlite3.verbose()).Database(HttpConstant.SqlPath, sqlite3.OPEN_READONLY);
	}

	/**
	 * @description 查询返回多组数据
	 * @since 1.1.0
	 * @param sql sql 语句
	 * @return {Promise<Array<unknown>>}
	 */
	async selectAll(sql) {
		return new Promise((resolve, reject) =>{
			this.db.all(sql, (err,res)=>{
				if(err) reject(err);
				else resolve(res);
			});
		});
	}

	/**
	 * @description 查询返回单个数据
	 * @since 1.1.0
	 * @param sql sql 语句
	 * @return {Promise<unknown>}
	 */
	async selectSingle(sql) {
		return new Promise((resolve, reject) =>{
			this.db.get(sql, (err,res)=>{
				if(err) reject(err);
				else resolve(res);
			});
		});
	}

	/**
	 * @description 获取 cookie
	 * @since 1.1.0
	 * @return {Promise<object>}
	 */
	async getCookie() {
		const sql = "select * from AppData where key='cookie'";
		const res = await this.selectSingle(sql);
		return transCookie(JSON.parse(res.value));
	}

	/**
	 * @description 获取 cookie 某项
	 * @since 1.1.0
	 * @param {string} itemKey 项名称
	 * @return {Promise<string>}
	 */
	async getCookieItem(itemKey){
		const sql = "select * from AppData where key='cookie'";
		const res = await this.selectSingle(sql);
		const cookie = JSON.parse(res.value);
		return cookie[itemKey];
	}


	/**
	 * @description 关闭数据库链接
	 * @since 1.1.0
	 */
	closeDB() {
		this.db.close();
	}
}

export default new LocalSqlite();