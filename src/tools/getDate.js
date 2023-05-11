/**
 * @file tools getDate.js
 * @description 获取当前日期，格式为 YYYY-MM-DD
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

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

export default getDate;