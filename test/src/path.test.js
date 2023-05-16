/**
 * @file test src path.test.js
 * @description 测试路径是否正确
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import assert from "node:assert";
import { describe, it } from "mocha";
// TGAssistant
import pathList, { ROOT_PATH } from "../../root.js";

describe("测试路径", () => {
	it("根目录", () => {
		const localPath = "E:\\Code\\IDEA\\App\\TGAssistant";
		assert.strictEqual(ROOT_PATH, localPath);
	});
	it("日志路径", () => {
		const localPath = "E:\\Code\\IDEA\\App\\TGAssistant\\logs";
		assert.strictEqual(pathList.log, localPath);
	});
});