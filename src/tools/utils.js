/**
 * @file tools utils.js
 * @description 工具函数集合
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import fs from "node:fs";
// TGAssistant
import logger from "./logger.js";


/**
 * @description 检测文件夹是否存在，不存在则创建
 * @param {string} dirPath 文件夹路径
 * @returns {void}
 */
export function fileCheck(dirPath) {
	if (!fs.existsSync(dirPath)) {
		logger.warn(`[tools][utils] 检测到 ${dirPath} 不存在，正在创建`);
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
 * @description 数组扁平化
 * @param {Array} arr 需要扁平化的数组
 * @returns {Array} 扁平化后的数组
 */
export function flatten(arr) {
	return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);
}

/**
 * @description 获取当前日期
 * @returns {string} 当前日期
 */
function getDate() {
	const date = new Date();
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return `${year}-${month}-${day}`;
}