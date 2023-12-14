/**
 * @file core/components/wiki/download.ts
 * @description wiki组件下载器
 * @since 2.0.0
 */

import process from "node:process";

import axios from "axios";
import fs from "fs-extra";

import { jsonDetail, jsonDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";
import {
  checkMetadata,
  getMetadata,
  getSnapDownloadUrl,
  updateMetadata,
} from "../../utils/operGitRepo.ts";

logger.init();
Counter.Init("[components][wiki][download]");
logger.default.info("[components][wiki][download] 运行 download.ts");

fileCheckObj(jsonDir);

const metadata = await getMetadata().catch((e) => {
  logger.default.error("[components][wiki][download] 获取元数据失败");
  logger.console.error(e);
  process.exit(1);
});

// 下载 wiki 数据
Counter.Reset();
const urlRes = getSnapDownloadUrl("Avatar", "Weapon");
for (const [key, value] of urlRes) {
  let savePath: string;
  if (key === "Avatar") {
    savePath = jsonDetail.character.src;
  } else {
    savePath = jsonDetail.weapon.src;
  }
  if (checkMetadata(key, metadata) && fileCheck(savePath, false)) {
    logger.console.mark(`[components][wiki][download] ${key} 数据已存在，跳过`);
    Counter.Skip();
    continue;
  }
  try {
    const res = await axios.get(value);
    await fs.writeJSON(savePath, res.data, { spaces: 2 });
    logger.default.info(`[components][wiki][download] ${key} 数据下载完成`);
    Counter.Success();
    await updateMetadata(key, metadata);
  } catch (e) {
    logger.default.error(`[components][wiki][download] ${key} 数据下载失败`);
    console.error(e);
    Counter.Fail();
  }
}

Counter.End();
logger.default.info(
  `[components][wiki][download] download.ts 运行结束，耗时：${Counter.getTime()}`,
);
Counter.Output();
