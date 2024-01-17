/**
 * @file test/getBiliVideo.test.ts
 * @description getBiliVideo 测试文件
 * @since 2.0.1
 */

import { describe, expect, test } from "vitest";

import { getBiliVideo, getBiliView, getMixinKey } from "../web/request/getBiliVideo.ts";

// https://player.bilibili.com/player.html?aid=540893019&autoplay=false&bvid=BV1ri4y1s7sY
const testAid = "540893019";
const testBvid = "BV1ri4y1s7sY";

describe("getBiliVideo 测试", () => {
  test("测试 getBiliView", async () => {
    const res = await getBiliView(testAid, testBvid);
    console.log(res);
    expect(res).toHaveProperty("code", 0);
  });
  test("测试 getMixinKey", async () => {
    const img = "7cd084941338484aae1ad9425b84077c";
    const sub = "4932caff0ff746eab6f01bf08b70ac45";
    const check = "ea1db124af3c7062474693fa704f4ff8";
    const res = await getMixinKey(img, sub);
    expect(res).toBe(check);
  });
  test("测试 getBiliVideo", async () => {
    const res = await getBiliView(testAid, testBvid);
    expect(res).toHaveProperty("code", 0);
    const cid = res.data.cid;
    const res2 = await getBiliVideo(cid, testBvid);
    console.log(JSON.stringify(res2));
    expect(res2).toHaveProperty("code", 0);
  });
});
