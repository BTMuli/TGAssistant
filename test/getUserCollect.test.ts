/**
 * @file test/getUserCollect.test.ts
 * @description getUserCollect 测试文件
 * @since 2.2.0
 */

import { describe, expect, test } from "vitest";

import logger from "../core/tools/logger.ts";
import { getUserCollect } from "../web/request/getUserCollect.ts";
import { readCookieItem } from "../web/utils/readCookie.ts";

describe("getUserCollect 测试", () => {
  const cookie = {
    cookie_token: readCookieItem("cookie_token"),
    account_id: readCookieItem("account_id"),
  };
  test("测试获取用户收藏帖子", async () => {
    logger.init();
    logger.default.info("[test][getUserCollect] 测试获取用户收藏帖子");
    logger.console.info(`[test][getUserCollect] cookie: ${JSON.stringify(cookie)}`);
    const res = await getUserCollect(cookie);
    logger.default.info("[test][getUserCollect] res\n", res);
    expect(res.retcode).toBe(0);
  });
  test("测试获取用户所有收藏帖子", async () => {
    logger.init();
    logger.default.info("[test][getUserCollect] 测试获取用户所有收藏帖子");
    logger.console.info(`[test][getUserCollect] cookie: ${JSON.stringify(cookie)}`);
    let res = await getUserCollect(cookie);
    let cnt = 0;
    logger.default.info("[test][getUserCollect] res\n", res);
    expect(res.retcode).toBe(0);
    cnt += res.data.list.length;
    while (!res.data.is_last) {
      res = await getUserCollect(cookie, res.data.next_offset);
      logger.default.info("[test][getUserCollect] res\n", res);
      expect(res.retcode).toBe(0);
      cnt += res.data.list.length;
    }
    logger.default.info(`[test][getUserCollect] 共 ${cnt} 条收藏`);
  });
});
