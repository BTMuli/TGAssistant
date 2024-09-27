/**
 * @file core/components/wiki/download.ts
 * @description wiki组件下载器
 * @since 2.2.0
 */

import axios from "axios";
import fs from "fs-extra";

import { jsonDetail, jsonDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheckObj } from "../../utils/fileCheck.ts";
import { getSnapDownloadUrl } from "../../utils/operGitRepo.ts";

logger.init();
Counter.Init("[components][wiki][download]");
logger.default.info("[components][wiki][download] 运行 download.ts");

fileCheckObj(jsonDir);

// 下载 wiki 数据
Counter.Reset();
const urlRes = getSnapDownloadUrl("Weapon", "Material");
for (const [key, value] of urlRes) {
  let savePath: string;
  if (key === "Weapon") {
    savePath = jsonDetail.weapon.src;
  } else {
    savePath = jsonDetail.material;
  }
  try {
    const res = await axios.get(value);
    await fs.writeJSON(savePath, res.data, { spaces: 2 });
    logger.default.info(`[components][wiki][download] ${key} 数据下载完成`);
    Counter.Success();
  } catch (e) {
    logger.default.error(`[components][wiki][download] ${key} 数据下载失败`);
    console.error(e);
    Counter.Fail();
  }
}
Counter.End();

logger.default.info("[components][wiki][download] download.ts 运行结束");
logger.default.info(`[components][wiki][download] 耗时: ${Counter.getTime()}`);
Counter.Output();
