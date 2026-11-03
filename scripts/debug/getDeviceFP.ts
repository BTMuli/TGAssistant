/**
 * 显式联网调试设备指纹请求，仅输出验证结果。
 * @since 2.7.0
 */

import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

import { getDeviceFP } from "../../web/request/getDeviceFP.ts";
import { getRandomString } from "../../web/utils/getDS.ts";

try {
  const model = getRandomString(6);
  const seedId = randomUUID();
  const seedTime = Date.now().toString();
  const first = await getDeviceFP(model, seedId, seedTime);
  const second = await getDeviceFP(model, seedId, seedTime);
  assert.equal(first.retcode, 0);
  assert.equal(second.retcode, 0);
  assert.equal(first.data.device_fp, second.data.device_fp);
  console.info("设备指纹请求及重复获取验证通过。");
} catch {
  console.error("设备指纹调试失败。");
  process.exitCode = 1;
}
