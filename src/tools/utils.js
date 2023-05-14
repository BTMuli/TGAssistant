/**
 * @file tools utils.js
 * @description 工具函数集合
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import fs from "node:fs";
// TGAssistant
import { defaultLogger } from "./logger.js";


/**
 * @description 检测文件夹是否存在，不存在则创建
 * @param {string} dirPath 文件夹路径
 * @returns {void}
 */
export function dirCheck(dirPath) {
	if (!fs.existsSync(dirPath)) {
		defaultLogger.warn(`[tools][utils] 检测到 ${dirPath} 不存在，正在创建`);
		fs.mkdirSync(dirPath, { recursive: true });
	}
}

/**
 * @description 检测文件是否存在
 * @param {string} filePath 文件路径
 * @returns {boolean} 文件是否存在
 */
export function fileExist(filePath) {
	return fs.existsSync(filePath);
}

/**
 * @description 获取当前日期
 * @returns {string} 当前日期
 */
export function getDate() {
	const date = new Date();
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return `${year}-${month}-${day}`;
}