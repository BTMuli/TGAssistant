/**
 * @file core/components/gacha/download.ts
 * @description gacha 组件资源下载
 * @since 2.1.0
 */

import axios from "axios";
import fs from "fs-extra";

import { jsonDetailDir, jsonDir, type PostItem } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheckObj } from "../../utils/fileCheck.ts";
import { getSnapDownloadUrl } from "../../utils/operGitRepo.ts";

logger.init();
Counter.Init("[components][gacha][download]");
logger.default.info("[components][gacha][download] 运行 download.ts");

fileCheckObj(jsonDir);
// 更新元数据
Counter.Reset(1);
logger.console.info("[components][gacha][download] 开始下载 Snap.Metadata gacha 数据");
const urlRes = getSnapDownloadUrl("Gacha");
try {
  const res = await axios.get(urlRes);
  await fs.writeJSON(jsonDetailDir.src, res.data, { spaces: 2 });
  logger.default.info("[components][gacha][download] 下载 gacha 数据成功");
} catch (e) {
  logger.default.warn("[components][gacha][download] 下载 gacha 数据失败");
  logger.console.warn(`[components][gacha][download] url: ${urlRes}`);
  Counter.Fail();
}
Counter.End();

interface MysPostList {
  is_last: boolean;
  last_id: number;
  list: Array<{
    post: {
      post_id: string;
      subject: string;
      created_at: string;
    };
  }>;
}

// 爬取米游社帖子
const postIdSet = new Set<string>();
const mhyPosts: PostItem[] = [];
const skipPost = ["49868038", "7345229", "1748352", "1748347", "11890551"];
let isLast = false;
let lastId = 0;
while (!isLast) {
  const posts = await getPosts(lastId);
  if (posts.is_last) isLast = true;
  else lastId = posts.last_id;
  posts.list.forEach((post) => {
    if (!/祈愿|概率UP/.test(post.post.subject)) return;
    if (
      post.post.subject.includes("即将开启") &&
      !["8275803", "2277850"].includes(post.post.post_id)
    ) {
      return;
    }
    if (skipPost.includes(post.post.post_id)) return;
    if (!postIdSet.has(post.post.post_id)) {
      postIdSet.add(post.post.post_id);
      mhyPosts.push({
        postId: post.post.post_id,
        title: post.post.subject,
        time: post.post.created_at,
      });
      logger.console.info(
        `[components][gacha][download] 爬取帖子 ${post.post.post_id} ${post.post.subject}`,
      );
    }
  });
}
await fs.writeJSON(jsonDetailDir.mhy, mhyPosts, { spaces: 2 });
logger.default.info("[components][gacha][download] 爬取米游社帖子完成");

logger.default.info(`[components][gacha][download] 数据更新完成，耗时 ${Counter.getTime()}`);
Counter.Output();
logger.console.info("[components][gacha][download] 请执行 convert.ts 转换数据");

/**
 * @description 获取米游社帖子
 * @since 2.1.0
 * @param {number} lastId 上次最后一个帖子 id
 * @return {Promise<any>} 米游社帖子
 */
async function getPosts(lastId: number): Promise<MysPostList> {
  const url = `https://bbs-api.mihoyo.com/post/wapi/getNewsList?gids=2&page_size=20&type=1&last_id=${lastId}`;
  const res = await axios.get(url);
  return res.data.data;
}
