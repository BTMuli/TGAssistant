/**
 * @file namecard convert.js
 * @description 转换图像资源，获取目标数据文件
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import path from "node:path";
import fs from "node:fs";
import log4js from "log4js";
// TGAssistant
import logger from "../tools/logger.js";
import pathList from "../../root.js";
import { fileCheck, fileExist } from "../tools/utils.js";

const consoleLog = log4js.getLogger("console");
logger.info("[名片][转换] 正在运行 convert.js");

const srcImgDir = path.join(pathList.src.img, "namecard");
const outImgDir = path.join(pathList.out.img, "namecard");
const srcJsonDir = path.join(pathList.src.json, "namecard");
const dataPaths = {
	src: path.resolve(srcJsonDir, "namecard.json"),
	out: path.resolve(pathList.out.json, "namecard.json")
};
const dataList = [
	{
		name: "名片-icon",
		type: "icon",
		srcDir: path.resolve(srcImgDir, "icon"),
		outDir: path.resolve(outImgDir, "icon"),
	},
	{
		name: "名片-bg",
		type: "bg",
		srcDir: path.resolve(srcImgDir, "bg"),
		outDir: path.resolve(outImgDir, "bg"),
	},
	{
		name: "名片-profile",
		type: "profile",
		srcDir: path.resolve(srcImgDir, "profile"),
		outDir: path.resolve(outImgDir, "profile"),
	}
];

// 检测目录是否存在
fileCheck(srcImgDir);
fileCheck(outImgDir);
fileCheck(srcJsonDir);
dataList.forEach(data => {
	fileCheck(data.srcDir);
	fileCheck(data.outDir);
});
// 检测数据文件是否存在
if (!fileExist(dataPaths.src)) {
	consoleLog.error("[名片][转换] 源数据文件不存在，请先运行 download.js");
	process.exit(1);
}

logger.info("[名片][转换] 开始获取原始数据");
const rawData = JSON.parse(fs.readFileSync(dataPaths.src, "utf-8"));
logger.info("[名片][转换] 原始数据获取成功，开始转换数据");
const outData = rawData.map(nameCard => convertNameCard(nameCard));
logger.info("[名片][转换] 对数据进行排序");
outData.sort((a, b) => a.type - b.type || a.name.localeCompare(b.name));
logger.info("[名片][转换] 数据转换成功，开始写入数据文件");
fs.writeFileSync(dataPaths.out, JSON.stringify(outData, null, 4));
logger.info("[名片][转换] 数据写入成功，开始转换图像资源");
await Promise.allSettled(rawData.map(nameCard => convertImg(nameCard)));
logger.info("[名片][转换] 图像资源转换成功，请执行 update.js 更新成就数据");

// 用到的函数

/**
 * @description 转换图像
 * @param {srcData.NameCard} nameCard 名片数据
 * @returns {void} 无返回值
 */
function convertImg(nameCard) {
	dataList.map(item => {
		// 查找 item.srcDir/index.webp
		if (!fs.existsSync(`${item.srcDir}/${nameCard.index}.webp`)) {
			logger.error(`[名片][转换][${nameCard.index}] 名片 ${nameCard.name} ${item.type} 图像不存在`);
			return;
		}
		// 查找 item.outDir/name.webp
		if (fs.existsSync(`${item.outDir}/${nameCard.name}.webp`)) {
			consoleLog.info(`[名片][转换][${nameCard.index}] 名片 ${nameCard.name} ${item.type} 图像已存在，跳过`);
			return;
		}
		// item.srcDir/index.webp -> item.outDir/name.webp
		fs.copyFileSync(`${item.srcDir}/${nameCard.index}.webp`, `${item.outDir}/${nameCard.name}.webp`);
		logger.info(`[名片][转换][${nameCard.index}] 名片 ${nameCard.name} ${item.type} 图像转换成功`);
	});
}

/**
 * @description 获取名片 type
 * @param {srcData.NameCard} nameCard 名片数据
 * @returns {number} 名片 type
 */
function getNameCardType(nameCard) {
	let sourceStr = "";
	try {
		sourceStr = nameCard.source.toString();
	} catch (e) {
		logger.error(`[名片][下载][${nameCard.index}] 名片 ${nameCard.name} source 数据类型错误`);
	}
	if (sourceStr.includes("成就")) {
		return 1;
	} else if (sourceStr.includes("纪行")) {
		return 3;
	} else if (sourceStr.includes("活动") || sourceStr.includes("庆典")) {
		return 4;
	} else if (sourceStr.includes("好感")) {
		return 2;
	} else {
		return 0;
	}
}

/**
 * @description 转换名片数据
 * @param {srcData.NameCard} nameCard 名片数据
 * @returns {outData.NameCard} 转换后的名片数据
 */
function convertNameCard(nameCard) {
	const type = getNameCardType(nameCard);
	return {
		name: nameCard.name,
		type: type,
		description: nameCard.description,
		source: nameCard.source,
		icon: `/source/nameCard/icon/${nameCard.name}.webp`,
		bg: `/source/nameCard/bg/${nameCard.name}.webp`,
		profile: `/source/nameCard/profile/${nameCard.name}.webp`,
	};
}