/**
 * @file web test getDS.test.ts
 * @description getDS 测试文件
 * @since 2.0.0
 */

import { getDSTest } from "../utils/getDS.ts";

describe("getDS 测试", () => {
  test("测试 verifyVerification", () => {
    const time = "1696074923";
    const random = "160777";
    const realDS = "1696074923,160777,a8ba7862d1fc21b76fff1a933f75f949";
    const dataRaw = {
      geetest_challenge: "1e3323723018dbdfe05c082654c44650",
      geetest_validate: "f0bca4156d4438ec53e21cdbfc81d729",
      geetest_seccode: "f0bca4156d4438ec53e21cdbfc81d729|jordan",
    };
    const data = JSON.stringify(dataRaw);
    const testDS = getDSTest("POST", data, "X4", false, time, random);
    expect(testDS).toBe(realDS);
  });
});
