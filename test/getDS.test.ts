/**
 * @file test/getDS.test.ts
 * @description getDS 测试文件
 * @since 2.0.0
 */

import { test, expect, describe } from "vitest";

import { getDSTest } from "../web/utils/getDS.ts";

describe("getDS 测试", () => {
  test("测试 createVerification", () => {
    const realDS = "1696512592,147128,0219830811719634febd07b255b838de";
    const time = realDS.split(",")[0];
    const random = realDS.split(",")[1];
    const data = {
      is_high: "true",
    };
    const testDS = getDSTest("GET", data, "X4", false, time, random);
    expect(testDS).toBe(realDS);
  });
  test("测试 verifyVerification", () => {
    const realDS = "1696854636,167543,f66bc212bd354f047d0949677d7655ea";
    const time = realDS.split(",")[0];
    const random = realDS.split(",")[1];
    const data = {
      geetest_challenge: "c7e2cb19c1c5bad724df0d99dae6f7cd",
      geetest_validate: "a6fc1b66cba7e9024d57e0cfe75d5225",
      geetest_seccode: "a6fc1b66cba7e9024d57e0cfe75d5225|jordan",
    };
    const testDS = getDSTest("POST", JSON.stringify(data), "X4", false, time, random);
    expect(testDS).toBe(realDS);
  });
});
