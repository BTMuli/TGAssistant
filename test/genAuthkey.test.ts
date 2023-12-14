/**
 * @file test/genAuthkey.test.ts
 * @description genAuthkey 测试文件
 * @since 2.0.0
 */

import { describe, expect, expectTypeOf, test } from "vitest";

import logger from "../core/tools/logger.ts";
import { genAuthkey, type ResponseData } from "../web/request/genAuthkey.ts";
import { readCookieItem } from "../web/utils/readCookie.ts";

describe("genAuthkey 测试", () => {
  test("通过 stoken v2", async () => {
    logger.init();
    logger.default.info("[test][genAuthkey] 通过 stoken v2");
    const cookie = {
      stoken: readCookieItem("SToken"),
      mid: readCookieItem("MId"),
    };
    logger.console.info(`[test][genAuthkey] cookie: ${JSON.stringify(cookie)}`);
    const uid = "500299765";
    logger.console.info(`[test][genAuthkey] uid: ${uid}`);
    const res = await genAuthkey(cookie, uid);
    logger.default.info("[test][genAuthkey] res", res);
    expect(res.retcode).toBe(0);
    expectTypeOf(res.data).toEqualTypeOf<ResponseData>();
  });
});
