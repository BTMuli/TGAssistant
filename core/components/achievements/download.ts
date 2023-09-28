/**
 * @file core components achievements download.ts
 * @description 成就组件资源下载
 * @since 2.0.0
 */

import process from "node:process";

import axios from "axios";
import fs from "fs-extra";

import { jsonDir, jsonDetailDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";
import {
  checkMetadata,
  updateMetadata,
  getSnapDownloadUrl,
  getMetadata,
} from "../../utils/operGitRepo.ts";

logger.init();
Counter.Init("[components][achievement][download]");
logger.default.info("[components][achievement][download] 运行 download.ts");

fileCheckObj(jsonDir);

// 获取元数据
const metaJson = await getMetadata().catch((e) => {
  logger.default.error("[components][achievement][download] 获取元数据失败");
  logger.console.error(e);
  process.exit(1);
});

// 更新元数据
Counter.Reset(2);
logger.console.info("[components][achievement][download] 开始下载 Snap.Metadata 成就数据");
const urlRes = getSnapDownloadUrl("Achievement", "AchievementGoal");
for (const [key, value] of urlRes) {
  const savePath = key === "Achievement" ? jsonDetailDir.achievement.src : jsonDetailDir.series.src;
  if (checkMetadata(key, metaJson) && fileCheck(savePath, false)) {
    logger.console.mark(`[components][achievement][download] ${key} 数据已存在，跳过`);
    Counter.Skip();
    continue;
  }
  try {
    const res = await axios.get(value);
    if (key === "Achievement") {
      await fs.writeJSON(savePath, res.data, { spaces: 2 });
    } else {
      await fs.writeJSON(savePath, res.data, { spaces: 2 });
    }
    logger.default.info(`[components][achievement][download] 下载 ${key} 数据成功`);
    Counter.Success();
    await updateMetadata(key, metaJson);
  } catch (e) {
    logger.default.warn(`[components][achievement][download] 下载 ${key} 数据失败`);
    logger.console.warn(`[components][achievement][download] url: ${value}`);
    Counter.Fail();
  }
}
Counter.End();

logger.default.info(`[components][achievement][download] 数据更新完成，耗时 ${Counter.getTime()}`);
Counter.Output();
logger.console.info("[components][achievement][download] 请执行 convert.ts 转换数据");
