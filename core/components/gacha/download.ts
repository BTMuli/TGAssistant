/**
 * @file core/components/gacha/download.ts
 * @description gacha 组件资源下载
 * @since 2.4.0
 */

import hutaoTool from "@hutao/hutao.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import { fileCheckObj } from "@utils/fileCheck.ts";
import fs from "fs-extra";

import { jsonDetailDir, jsonDir } from "./constant.ts";

logger.init();
Counter.Init("[components][gacha][download]");
logger.default.info("[components][gacha][download] 运行 download.ts");

fileCheckObj(jsonDir);
// 更新元数据
Counter.Reset(1);
logger.console.info("[components][gacha][download] 开始下载 Metadata 卡池数据");
const meta = await hutaoTool.sync();
try {
  const gachaStat = await hutaoTool.update(meta, hutaoTool.enum.file.Gacha);
  if (gachaStat) Counter.Success();
  else Counter.Skip();
} catch (e) {
  logger.default.error("[components][gacha][download] 下载 Metadata 卡池数据失败");
  logger.console.error(`[components][gacha][download] ${e}`);
  Counter.Fail();
}

// 爬取米游社帖子
const postIdSet = new Set<string>();
const mhyPosts: TGACore.Components.Gacha.MysPosts = [];
const skipPost = ["49868038", "7345229", "1748352", "1748347", "11890551", "56991610"];
let isLast = false;
let lastId: string = "0";
while (!isLast) {
  const url = `https://bbs-api.miyoushe.com/painter/wapi/getNewsList?gids=2&page_size=20&type=1&last_id=${lastId}`;
  const resp = await fetch(url);
  const res = <TGACore.Plugins.Mys.PostListResponse>await resp.json();
  const posts = res.data;
  if (posts.is_last || posts.list.length === 0) isLast = true;
  else lastId = posts.last_id;
  for (const post of posts.list) {
    const postItem = post.post;
    if (!/祈愿|概率UP/.test(postItem.subject)) {
      logger.console.mark(`[components][gacha][download] ${postItem.post_id} ${postItem.subject}`);
      continue;
    }
    if (
      postItem.subject.includes("即将开启") &&
      !["8275803", "2277850"].includes(postItem.post_id)
    ) {
      continue;
    }
    if (skipPost.includes(postItem.post_id)) continue;
    if (!postIdSet.has(postItem.post_id)) {
      postIdSet.add(postItem.post_id);
      mhyPosts.push({
        postId: postItem.post_id,
        title: postItem.subject,
        time: postItem.created_at,
      });
      logger.console.info(`[components][gacha][download] ${postItem.post_id} ${postItem.subject}`);
    }
  }
}
await fs.writeJSON(jsonDetailDir.mhy, mhyPosts, { spaces: 2 });
logger.default.info("[components][gacha][download] 爬取米游社帖子完成");

logger.default.info(`[components][gacha][download] 数据更新完成，耗时 ${Counter.getTime()}`);
Counter.Output();
logger.console.info("[components][gacha][download] 请执行 convert.ts 转换数据");
