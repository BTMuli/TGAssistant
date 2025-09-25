/**
 * @file core/components/gacha/convert.ts
 * @description gacha 组件资源转换
 * @since 2.4.0
 */

import process from "node:process";

import hutaoTool from "@hutao/hutao.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import fs from "fs-extra";

import { jsonDetailDir, jsonDir } from "./constant.ts";

logger.init();
Counter.Init("[components][gacha][convert]");

// 前置检查
fileCheckObj(jsonDir);

if (!fileCheck(jsonDetailDir.mhy, false) || !hutaoTool.check(hutaoTool.enum.file.Gacha)) {
  logger.default.error("[components][gacha][convert] gacha 数据文件不存在");
  logger.console.info("[components][gacha][convert] 请执行 download.ts");
  process.exit(1);
}

Counter.Reset();
const gachaRaw = hutaoTool.read<TGACore.Plugins.Hutao.Gacha.RawGacha>(hutaoTool.enum.file.Gacha);
const postRaw: TGACore.Components.Gacha.MysPosts = await fs.readJSON(jsonDetailDir.mhy);

let gacha: Array<TGACore.Components.Gacha.Pool> = [];
for (const item of gachaRaw) {
  const convert: TGACore.Components.Gacha.Pool = {
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
}
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
      for (const item of gacha) {
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
      }
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
      for (const item of gacha) {
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
      }
    } else {
      logger.default.warn(`[components][gacha][convert] 未找到对应卡池 ${curVersion}`);
    }
  } else {
    const wishName = wishMatch[1];
    const wishFind = filter.find((item) => item.name === wishName);
    if (wishFind != null) {
      for (const item of gacha) {
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
      }
    }
  }
  if (!isFind) {
    logger.default.warn(`[components][gacha][convert] 未找到对应卡池 ${curVersion}`);
  }
}
await fs.writeJSON(jsonDetailDir.out, gacha.reverse());
Counter.End();
logger.default.info(`[components][gacha][convert] gacha 数据转换完成，耗时 ${Counter.getTime()}`);
