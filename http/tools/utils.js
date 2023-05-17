/**
 * @file http tools utils.js
 * @description 工具函数集合
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

/**
 * @description 生成随机字符串
 * @since 1.1.0
 * @param {Number} length 字符串长度
 * @returns {String} 随机字符串
 */
export function getRandomString(length) {
	const str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		result += str[Math.floor(Math.random() * str.length)];
	}
	return result;
}

/**
 * @description 获取随机数
 * @since 1.1.0
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @returns {Number} 随机数
 */
export function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}