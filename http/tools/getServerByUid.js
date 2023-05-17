/**
 * @file http tools getServerByUid.js
 * @description 通过 uid 获取 server
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

/**
 * @description 根据 uid 获取 server
 * @since Alpha v0.2.0
 * @param {string} uid uid
 * @returns {string} server
 */
function getServerByUid (uid) {
	// 获取第一个字符
	const first = uid[0];
	// 1-4 为国服-天空岛
	if (first >= "1" && first <= "4") return "cn_gf01";
	// 5 为国服-世界树
	if (first === "5") return "cn_qd01";
	// 6 为美服
	if (first === "6") return "os_usa";
	// 7 为欧服
	if (first === "7") return "os_euro";
	// 8 为亚服
	if (first === "8") return "os_aisa";
	// 9 为台服
	if (first === "9") return "os_cht";
	// 其他情况返回未知
	throw new Error("未知服务器");
}

export default getServerByUid;