/**
 * @file test/getDeviceFP.test.ts
 * @description getDeviceFP 测试文件
 * @since 2.0.0
 */

import { v4 } from "uuid";
import { test, expect, describe } from "vitest";

import { getDeviceFP } from "../web/request/getDeviceFP.ts";
import { getRandomString } from "../web/utils/getDS.ts";

describe("getDeviceFP 测试", () => {
  const model = getRandomString(6);
  const seedId = v4();
  const seedTime = Date.now().toString();
  test("测试 getDeviceFP", async () => {
    const fpResult = await getDeviceFP(model, seedId, seedTime);
    expect(fpResult.retcode).toBe(0);
  });
  test("测试二次获取", async () => {
    const fpResult = await getDeviceFP(model, seedId, seedTime);
    const fpRes = fpResult.data.device_fp;
    const fpResult2 = await getDeviceFP(model, seedId, seedTime);
    const fpRes2 = fpResult2.data.device_fp;
    expect(fpRes).toBe(fpRes2);
  });
});
