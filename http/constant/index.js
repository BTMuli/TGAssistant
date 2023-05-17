/**
 * @file http constant index.js
 * @description 常量集合
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// TGAssistant
import BBS from "./bbs.js";
import Salt from "./salt.js";
import { SQL_PATH } from "./sqlite.js";

const HttpConstant = {
	BBS: BBS,
	Salt: Salt,
	SqlPath: SQL_PATH,
};

export default HttpConstant;
