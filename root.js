/**
 * @file root.js
 * @description 项目根目录
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import path from "node:path";
import appRootPath from "app-root-path";

// 根目录，即 TGAssistant
export const ROOT_PATH = appRootPath.path;
// Amber.top API 版本
export const AMBER_VH = "37F8";

// 路径列表
const pathList = {
	src: {
		json: path.join(ROOT_PATH, "data", "src"),
		img: path.join(ROOT_PATH, "assets", "src"),
		temp: path.join(ROOT_PATH, "temp", "src"),
	},
	out: {
		json: path.join(ROOT_PATH, "data", "out"),
		img: path.join(ROOT_PATH, "assets", "out"),
		temp: path.join(ROOT_PATH, "temp", "out"),
	},
	repo: {
		SH: "DGP-Studio/Snap.Metadata",
		PM: "MadeBaruna/paimon-moe",
	},
	log: path.join(ROOT_PATH, "logs"),
	http: path.join(ROOT_PATH, "data", "http")
};

export default pathList;
