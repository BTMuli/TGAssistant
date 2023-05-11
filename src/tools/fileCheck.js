/**
 * @file tools fileCheck.js
 * @description 检查路径存在性
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import {existsSync, mkdirSync} from "node:fs";
// TGAssistant
import logger from "./logger.js";

/**
 * @description 检查路径存在性
 * @param {string} dir 路径
 * @returns {void} 无返回值
 */
function fileCheck(dir) {
	if (!existsSync(dir)) {
		logger.warn(`[fileCheck] 检测到目录 ${dir} 不存在，创建文件夹`);
		mkdirSync(dir, {
			recursive: true,
		});
	}
}

export default fileCheck;