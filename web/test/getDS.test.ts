/**
 * @file web test getDS.test.ts
 * @description getDS 测试文件
 * @since 2.0.0
 */

import { test } from "@jest/globals";

import { getDSTest } from "../utils/getDS.ts";

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
    const realDS = "1696512600,128536,7bc1e867dc11974213c6b26a1bcc0bd9";
    const time = realDS.split(",")[0];
    const random = realDS.split(",")[1];
    const data = {
      geetest_challenge: "460a6898ec4b295e9458e22fdbf88be2",
      geetest_validate: "a2471df8f3c4d0f0beefcfe5e25426cf",
      geetest_seccode: "a2471df8f3c4d0f0beefcfe5e25426cf|jordan",
    };
    const testDS = getDSTest("POST", JSON.stringify(data), "X4", false, time, random);
    expect(testDS).toBe(realDS);
  });
});
