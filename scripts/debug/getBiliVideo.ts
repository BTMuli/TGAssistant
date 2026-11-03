/**
 * 显式联网调试哔哩哔哩视频请求，仅输出验证结果。
 * @since 2.7.0
 */

import assert from "node:assert/strict";

import { getBiliVideo, getBiliView, getMixinKey } from "../../web/request/getBiliVideo.ts";

try {
  const bvid = "BV1ri4y1s7sY";
  const view = await getBiliView("540893019", bvid);
  assert.equal(view.code, 0);
  const key = await getMixinKey(
    "7cd084941338484aae1ad9425b84077c",
    "4932caff0ff746eab6f01bf08b70ac45",
  );
  assert.equal(key, "ea1db124af3c7062474693fa704f4ff8");
  const video = await getBiliVideo(view.data.cid, bvid);
  assert.equal(video.code, 0);
  console.info("哔哩哔哩视频请求验证通过。");
} catch {
  console.error("哔哩哔哩视频调试失败。");
  process.exitCode = 1;
}
