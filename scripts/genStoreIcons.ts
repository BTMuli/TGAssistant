/**
 * @file scripts/genStoreIcons.ts
 * @description 生成 store icons
 * @since 2.0.0
 */

import path from "node:path";

import fs from "fs-extra";
import imageSize from "image-size";
import sharp from "sharp";

import Counter from "../core/tools/counter.ts";
import logger from "../core/tools/logger.ts";
import { fileCheck } from "../core/utils/fileCheck.ts";
import { getProjRootPath } from "../core/utils/getBasePaths.ts";

logger.init();
Counter.Init("[scripts][GSI]");
logger.default.info("[scripts][GSI] 运行 genStoreLogo.ts");

const baseDir = path.join(getProjRootPath(), "scripts");
const referDir = path.join(baseDir, "refer");
const saveDir = path.join(baseDir, "output");

// 检测图标文件是否存在
if (!fs.existsSync(path.join(baseDir, "icon.png"))) {
  logger.default.warn("[scripts][GSI] icon.png 不存在，退出");
}

fileCheck(saveDir, true);

// 读取 refer 目录下的图片
const referFiles = fs.readdirSync(referDir);
Counter.Reset(referFiles.length);
for (const referFile of referFiles) {
  const savePath = path.join(saveDir, referFile);
  if (fs.existsSync(savePath)) {
    logger.console.info(`[scripts][GSI] ${referFile} 已存在，覆盖`);
  }
  const referInfo = imageSize(path.join(baseDir, "refer", referFile));
  await sharp(path.join(baseDir, "icon.png"))
    .png()
    .resize({
      width: referInfo.width,
      height: referInfo.height,
      background: "transparent",
      fit: "contain",
    })
    .toFile(savePath);
  logger.console.info(`[scripts][GSI] ${referFile} 已导出`);
  Counter.Success();
}
Counter.End();

logger.default.info(`[scripts][GSI] 处理完成，耗时 ${Counter.getTime()}`);
Counter.Output();
