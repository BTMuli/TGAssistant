/**
 * @file core/components/gacha/download.ts
 * @description gacha 组件资源下载
 * @since 2.1.0
 */

import axios from "axios";
import fs from "fs-extra";

import { jsonDir, jsonDetailDir } from "./constant.ts";
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

logger.default.info(`[components][gacha][download] 数据更新完成，耗时 ${Counter.getTime()}`);
Counter.Output();
logger.console.info("[components][gacha][download] 请执行 convert.ts 转换数据");
