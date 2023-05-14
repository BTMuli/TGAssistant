/**
 * @file tools resizeImg.js
 * @description Sharp 处理图片
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
// TGAssistant
import pathList from "../../root.js";
import { defaultLogger } from "./logger.js";
import { dirCheck } from "./utils.js";

defaultLogger.info("[resizeImg] 正在运行 resizeImg.js");

// 检测目录是否存在
const srcTempDir = pathList.src.temp;
const outTempDir = pathList.out.temp;
dirCheck(srcTempDir);
dirCheck(outTempDir);

defaultLogger.info("[resizeImg][defaultResize] 读取 temp 文件夹");
const filesGet = fs.readdirSync(srcTempDir);
if (filesGet.length === 0) {
	defaultLogger.mark("[resizeImg][defaultResize] temp 文件夹为空，跳过处理");
} else {
	filesGet.map(async (file) => {
		const fileName = file.split(".")[0];
		const filePath = path.join(srcTempDir, file);
		const savePath = path.join(outTempDir, `${fileName}.webp`);
		defaultLogger.info(`[resizeImg][defaultResize] 转换图片 ${file} 为 webp`);
		sharp(filePath).png().toFormat("webp", {
			background: { r: 0, g: 0, b: 0, alpha: 0 },
			lossless: true,
		})
			.toFile(savePath, (err, info) => {
				if (err) {
					defaultLogger.error(`[resizeImg][defaultResize] 转换图片 ${file} 失败`);
					console.log(err);
				} else {
					defaultLogger.info(`[resizeImg][defaultResize] 转换图片 ${file} 成功，大小为 ${info.size}`);
				}
			});
	});
}
defaultLogger.info("[resizeImg] resizeImg.js 运行结束");

