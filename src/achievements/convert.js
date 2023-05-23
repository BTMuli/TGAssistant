/**
 * @file achievements convert.js
 * @description 转换成就数据，生成目标数据文件
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import path from "node:path";
import fs from "node:fs";
// TGAssistant
import { consoleLogger, defaultLogger } from "../tools/logger.js";
import pathList, { GENSHIN_VER } from "../../root.js";
import { dirCheck, fileExist } from "../tools/utils.js";

defaultLogger.info("[成就][转换] 正在运行 convert.js");

// 检测目录是否存在
const srcDir = path.join(pathList.src.json, "achievements");
const dataDir = path.join(pathList.out.json);
dirCheck(srcDir);
dirCheck(dataDir);

const srcList = [
	{
		name: "胡桃-成就",
		file: path.resolve(srcDir, "SnapHutao.json"),
		data: {},
	},
	{
		name: "Paimon.moe-成就",
		file: path.resolve(srcDir, "Paimon.json"),
		data: {},
	}
];

// 检测数据文件是否存在
srcList.forEach((src) => {
	if (!fileExist(src.file)) {
		defaultLogger.error(`[成就][转换] ${src.name} 文件不存在，请先执行 download.js`);
		process.exit(1);
	}
});

const saveData = {
	achievements: {
		name: "成就",
		file: "achievements.json",
		savePath: path.resolve(dataDir, "achievements.json"),
		data: [],
	},
	series: {
		name: "成就系列",
		file: "achievementSeries.json",
		savePath: path.resolve(dataDir, "achievementSeries.json"),
		data: [],
	}
};

const tempData = {
	achievements: [],
	series: [],
};

// 读取数据
srcList.forEach((src) => {
	src.data = JSON.parse(fs.readFileSync(src.file, "utf-8"));
});

// 处理 Paimon.moe 的数据
await Object.entries(srcList[1].data).forEach(([key, series]) => {
	consoleLogger.mark(`[成就][转换][PMSeries][${key}] 处理成就系列 ${series.name}`);
	const achievementArray = flatArray(series.achievements);
	tempData.series[key] = {
		id: Number(key),
		order: series.order,
		name: series.name,
		version: "",
		card: "",
		icon: `/source/achievementSeries/${key}.webp`,
	};
	consoleLogger.info(`[成就][转换][PMSeries][${key}] 处理成就系列 ${series.name} 的成就`);
	achievementArray.forEach((o) => {
		consoleLogger.mark(`[成就][转换][PMItem][${o.id}] 处理成就 ${o.name}`);
		tempData.achievements[o.id] = {
			id: o.id,
			series: Number(key),
			order: 0,
			name: o.name,
			description: o["desc"],
			reward: o.reward,
			version: o["ver"],
		};
	});
});

// 处理 Snap.Hutao 的数据
defaultLogger.info("[成就][转换] 处理 Snap.Hutao 的数据");
await srcList[0].data.map((o) => {
	consoleLogger.mark(`[成就][转换][Hutao][${o["Id"]}] 处理成就 ${o["Title"]}`);
	if(tempData.achievements[o["Id"]] === undefined){
		tempData.achievements[o["Id"]] = {
			id: o["Id"],
			series: o["Goal"],
			order: o["Order"],
			name: o["Title"],
			description: o["Description"],
			reward: o["FinishReward"]["Count"],
			version: GENSHIN_VER,
		};
		consoleLogger.warn(`[成就][转换][Hutao] 添加缺失成就数据 ${o["Title"]}`);
	} else {
		tempData.achievements[o["Id"]].order = o["Order"];
	}
});

// 添加成就系列版本
tempData.achievements.map((item)=>{
	if(tempData.series[item.series].version === "" || item.version>tempData.series[item.series].version){
		tempData.series[item.series].version = item.version;
	}
});

// 排序
Object.values(tempData.achievements).sort((a, b) => a.id - b.id).forEach((o) => {
	saveData.achievements.data.push(o);
});
Object.values(tempData.series).sort((a, b) => a.id - b.id).forEach((o) => {
	saveData.series.data.push(o);
});
defaultLogger.info("[成就][转换] 对数据进行排序完成");

// 保存数据
fs.writeFileSync(saveData.achievements.savePath, JSON.stringify(saveData.achievements.data, null, 2));
fs.writeFileSync(saveData.series.savePath, JSON.stringify(saveData.series.data, null, 2));

defaultLogger.info("[成就][转换] merge.js 运行完成，请执行 namecard/update.js 更新成就系列数据");

// 用到的函数

/**
 * @description 递归将多维数组转换为一维数组
 * @since 1.1.0
 * @param {Array} data
 * @returns {Array} 一维数组
 */
function flatArray(data) {
	return data.reduce((pre, cur) => {
		return pre.concat(Array.isArray(cur) ? flatArray(cur) : cur);
	}, []);
}

/**
 * @description 获取最大的版本号
 * @since 1.1.0
 * @param {Array} data
 * @returns {String} 最大的版本号
 */
function getMaxVersion(data) {
	let maxVer = Math.max.apply(
		Math,
		data.map((o) => o["ver"])
	);
	if (!maxVer.toString().includes(".")) {
		maxVer = maxVer + ".0";
		return maxVer;
	}
	console.log(maxVer);
	return maxVer.toString();
}
