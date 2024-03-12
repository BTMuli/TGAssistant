/**
 * @file core/components/gacha/convert.ts
 * @description gacha 组件资源转换
 * @since 2.1.0
 */

import process from "node:process";

import fs from "fs-extra";

import { jsonDetailDir, jsonDir, type PostItem } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";

logger.init();
Counter.Init("[components][gacha][convert]");

// 前置检查
fileCheckObj(jsonDir);
if (!fileCheck(jsonDetailDir.src, false) || !fileCheck(jsonDetailDir.mhy, false)) {
  logger.default.error("[components][gacha][convert] gacha 数据文件不存在");
  logger.console.info("[components][gacha][convert] 请执行 download.ts");
  process.exit(1);
}

Counter.Reset();
const gachaRaw: TGACore.Components.Gacha.RawHutao = await fs.readJSON(jsonDetailDir.src);
const postRaw: PostItem[] = await fs.readJSON(jsonDetailDir.mhy);
let gacha: TGACore.Components.Gacha.ConvertItem[] = [];
gachaRaw.forEach((item) => {
  const convert: TGACore.Components.Gacha.ConvertItem = {
    name: item.Name,
    version: item.Version,
    order: item.Order,
    banner: item.Banner,
    from: item.From,
    to: item.To,
    type: item.Type,
    postId: "",
    up5List: item.UpOrangeList,
    up4List: item.UpPurpleList,
  };
  gacha.push(convert);
});
gacha = gacha.reverse();
let curVersion = gacha[0].version;
for (const post of postRaw) {
  let isFind = false;
  logger.console.info(`[components][gacha][convert] 正在处理帖子 ${post.postId} ${post.title}`);
  let filter = gacha.filter((item) => item.version === curVersion && item.postId === "");
  if (filter.length === 0) {
    const filterNew = gacha.filter((item) => item.postId === "");
    curVersion = filterNew[0].version;
    filter = gacha.filter((item) => item.version === curVersion && item.postId === "");
  }
  if (post.title.includes("神铸赋形")) {
    const wishWeapon = filter.find((item) => item.name === "神铸赋形");
    if (wishWeapon != null) {
      gacha.forEach((item) => {
        if (
          item.version === curVersion &&
          item.name === "神铸赋形" &&
          item.postId === "" &&
          !isFind
        ) {
          item.postId = post.postId;
          logger.default.info(
            `[components][gacha][convert] 找到对应卡池 ${curVersion} ${item.name}`,
          );
          isFind = true;
        }
      });
    }
    continue;
  }
  // 正则匹配 「烟火之邀」祈愿 => 烟火之邀
  const wishRegexp = /「(.+)」(祈愿|角色活动祈愿|现已开启)/;
  const wishMatch = post.title.match(wishRegexp);
  // 如果不匹配
  if (wishMatch == null) {
    logger.console.warn(`[components][gacha][convert] 未匹配到卡池 ${post.title}`);
    const wishWeapon = filter.find((item) => item.name === "神铸赋形" && item.postId === "");
    if (wishWeapon != null) {
      gacha.forEach((item) => {
        if (
          item.version === curVersion &&
          item.order === wishWeapon.order &&
          item.name === "神铸赋形" &&
          item.postId === "" &&
          !isFind
        ) {
          item.postId = post.postId;
          logger.console.mark(
            `[components][gacha][convert] 找到对应卡池 ${curVersion} ${item.order} ${item.name}`,
          );
          isFind = true;
        }
      });
    } else {
      logger.default.warn(`[components][gacha][convert] 未找到对应卡池 ${curVersion}`);
    }
  } else {
    const wishName = wishMatch[1];
    const wishFind = filter.find((item) => item.name === wishName);
    if (wishFind != null) {
      gacha.forEach((item) => {
        if (
          item.version === curVersion &&
          item.name === wishName &&
          item.postId === "" &&
          !isFind
        ) {
          item.postId = post.postId;
          logger.console.mark(
            `[components][gacha][convert] 找到对应卡池 ${curVersion} ${item.name}`,
          );
          isFind = true;
        }
      });
    }
  }
  if (!isFind) {
    logger.default.warn(`[components][gacha][convert] 未找到对应卡池 ${curVersion}`);
  }
}
await fs.writeJSON(jsonDetailDir.out, gacha.reverse(), { spaces: 2 });
Counter.End();
logger.default.info(`[components][gacha][convert] gacha 数据转换完成，耗时 ${Counter.getTime()}`);
