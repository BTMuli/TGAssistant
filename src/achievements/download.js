/**
 * @file achievements download.js
 * @description 下载所需的 JSON 文件
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import path from "node:path";
// TGAssistant
import logger from "../tools/logger.js";
import pathList from "../../root.js";
import { fileCheck } from "../tools/utils.js";
import gitDownload from "../tools/gitDownload.js";

logger.info("[成就][下载] 正在运行 download.js");

// 检测目录是否存在
const srcDir = path.resolve(pathList.src.json, "achievements");

const dataList = [
	{
		name: "胡桃-成就",
		repo: pathList.repo.SH,
		file: "Output/CHS/Achievement.json",
		tree: "main",
		savePath: path.resolve(srcDir, "SH-Item.json"),
	},
	{
		name: "胡桃-成就系列",
		repo: pathList.repo.SH,
		file: "Output/CHS/AchievementGoal.json",
		tree: "main",
		savePath: path.resolve(srcDir, "SH-Goal.json"),
	},
	{
		name: "Paimon.moe-成就",
		repo: pathList.repo.PM,
		file: "src/data/achievement/zh.json",
		tree: "main",
		savePath: path.resolve(srcDir, "Paimon.json"),
	}
];

// 检测目录是否存在
fileCheck(srcDir);

await Promise.allSettled(dataList.map(async data => {
	logger.info(`[成就][下载] 开始下载 ${data.name} 文件`);
	await gitDownload(data.repo, data.file, data.savePath);
}));

logger.info("[成就][下载] download.js 运行完成");
