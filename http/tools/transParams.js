/**
 * @file http tools transParams.js
 * @description 用于转换请求参数的工具函数
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

/**
 * @description 将对象转换为 string
 * @since 1.1.0
 * @param {Record<string, string|number>} params 参数对象
 * @returns {string} 转换后的字符串
 */
export function transParams(params) {
	const keys = Object.keys(params).sort();
	let result = "";
	for (let i = 0; i < keys.length; i++) {
		result += keys[i] + "=" + params[keys[i]] + "&";
	}
	return result.slice(0, -1);
}
