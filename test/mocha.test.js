/**
 * @file test mocha.test.js
 * @description 测试 Mocha 框架的一些用法
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import assert from "assert";
import {describe, it} from "mocha";

describe("框架测试", () => {
	it("正确性测试", () => {
		const testTrue = true;
		assert.strictEqual(testTrue, true);
	});
	it("错误性测试", () => {
		const testFalse = false;
		assert.strictEqual(testFalse, false);
	});
});