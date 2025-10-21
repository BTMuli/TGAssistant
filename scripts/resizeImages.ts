/**
 * @file scripts/esizeImages.ts
 * @description 图片大小调整工具
 * @since 2.0.0
 */

import path from "node:path";

import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import { fileCheckObj } from "@utils/fileCheck.ts";
import { getAppDirPath } from "@utils/getBasePaths.ts";
import fs from "fs-extra";
import sharp from "sharp";

const tempDir = getAppDirPath("temp");

logger.init();
Counter.Init("[utils][resizeImages]");
logger.default.info("[utils][resizeImages] 运行 resizeImages.ts");

fileCheckObj(tempDir);

// 读取 temp 目录下的图片
const files = fs.readdirSync(tempDir.src);
Counter.Reset(files.length);
for (const file of files) {
  // 判断文件后缀是否为 png
  if (!file.endsWith(".png")) {
    logger.console.mark(`[utils][resizeImages] 图片 ${file} 不是 png 格式，跳过`);
    Counter.Skip();
    continue;
  }
  const fileName = file.slice(0, -4);
  const savePath = path.join(tempDir.out, fileName + ".webp");
  const saveFile = fileName + ".webp";
  if (fs.existsSync(savePath)) {
    logger.console.mark(`[utils][resizeImages] 图片 ${saveFile} 已存在，跳过`);
    Counter.Skip();
    continue;
  }
  // const out = await sharp(path.join(tempDir.src, file)).resize(256, 256).webp().toFile(savePath);
  const out = await sharp(path.join(tempDir.src, file)).webp().toFile(savePath);
  logger.console.mark(`[utils][resizeImages] 图片 ${file} 处理完成，大小为 ${out.size} 字节`);
  Counter.Success();
}
Counter.End();

logger.default.info(`[utils][resizeImages] 处理完成，耗时 ${Counter.getTime()}`);
Counter.Output();
