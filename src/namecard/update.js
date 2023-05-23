/**
 * @file namecard update.js
 * @description 更新成就系列数据
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import path from "node:path";
import fs from "node:fs";
// TGAssistant
import { defaultLogger,consoleLogger } from "../tools/logger.js";
import pathList from "../../root.js";
import { fileExist } from "../tools/utils.js";

defaultLogger.info("[名片][更新] 正在运行 update.js");

const outASPath = path.resolve(pathList.out.json, "achievementSeries.json");
const outNCPath = path.resolve(pathList.out.json, "namecard.json");

defaultLogger.info("[名片][更新] 读取数据文件");

if (!fileExist(outASPath)) {
	defaultLogger.error("[名片][更新] achievementSeries.json 文件不存在，请先执行 achievement/convert.js");
	process.exit(1);
}
if (!fileExist(outNCPath)) {
	defaultLogger.error("[名片][更新] namecard.json 文件不存在，请先执行 download.js");
	process.exit(1);
}

const outASData = JSON.parse(fs.readFileSync(outASPath, "utf-8"));
const outNCData = JSON.parse(fs.readFileSync(outNCPath, "utf-8")).filter(item => item.type === 1);

outASData.forEach((item) => {
	if (item.card !== "") return;
	const nc = outNCData.find(nc => nc.source.includes(item.name));
	if (nc) {
		consoleLogger.info(`[名片][更新][${item.id}] 找到 ${item.name} 的成就名片: ${nc.name}`);
		item.card = nc.name;
	} else {
		defaultLogger.warn(`[名片][更新][${item.id}] 未找到 ${item.name} 的成就名片`);
	}
});

defaultLogger.info("[名片][更新] 保存数据文件");
outASData.sort((a, b) => a.order - b.order);
fs.writeFileSync(outASPath, JSON.stringify(outASData, null, 2));

defaultLogger.info("[名片][更新] 成功完成 update.js");
