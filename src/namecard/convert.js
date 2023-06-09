/**
 * @file namecard convert.js
 * @description 转换图像资源，获取目标数据文件
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import path from "node:path";
import fs from "node:fs";
import sharp from "sharp";
// TGAssistant
import { defaultLogger,consoleLogger } from "../tools/logger.js";
import pathList from "../../root.js";
import { dirCheck, fileExist } from "../tools/utils.js";

defaultLogger.info("[名片][转换] 正在运行 convert.js");

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
dirCheck(srcImgDir);
dirCheck(outImgDir);
dirCheck(srcJsonDir);
dataList.forEach(data => {
	dirCheck(data.srcDir);
	dirCheck(data.outDir);
});
// 检测数据文件是否存在
if (!fileExist(dataPaths.src)) {
	consoleLogger.error("[名片][转换] 源数据文件不存在，请先运行 download.js");
	process.exit(1);
}

defaultLogger.info("[名片][转换] 开始获取原始数据");
const rawData = JSON.parse(fs.readFileSync(dataPaths.src, "utf-8"));
defaultLogger.info("[名片][转换] 原始数据获取成功，开始转换数据");
const outData = rawData.map(nameCard => convertNameCard(nameCard));
defaultLogger.info("[名片][转换] 对数据进行排序");
outData.sort((a, b) => a.type - b.type || a.name.localeCompare(b.name));
defaultLogger.info("[名片][转换] 数据转换成功，开始写入数据文件");
fs.writeFileSync(dataPaths.out, JSON.stringify(outData, null, 4));
defaultLogger.info("[名片][转换] 数据写入成功，开始转换图像资源");
await Promise.allSettled(rawData.map(nameCard => convertImg(nameCard)));
defaultLogger.info("[名片][转换] 图像资源转换成功，请执行 update.js 更新成就数据");

// 用到的函数
/**
 * @description 转换 i
 * @since 1.1.0
 * @param {number} i
 * @return {string}
 */
function transI(i) {
	return i.toString().padStart(3,"0");
}

/**
 * @description 转换图像
 * @since 1.1.0
 * @param {object} nameCard 名片数据
 * @returns {void} 无返回值
 */
function convertImg(nameCard) {
	dataList.map(async item => {
		// 查找 item.srcDir/index.webp
		if (!fs.existsSync(`${item.srcDir}/${nameCard.index}.webp`)) {
			defaultLogger.error(`[名片][转换][${transI(nameCard.index)}] 名片 ${nameCard.name} ${item.type} 图像不存在`);
			return;
		}
		// item.srcDir/index.webp -> item.outDir/name.webp
		if(item.type === "icon") {
			await sharp(`${item.srcDir}/${nameCard.index}.webp`).webp().resize(250,165).toFile(`${item.outDir}/${nameCard.name}.webp`);
		} else if(item.type === "bg") {
			await sharp(`${item.srcDir}/${nameCard.index}.webp`).webp().resize(880,140).toFile(`${item.outDir}/${nameCard.name}.webp`);
		} else if((item.type === "profile")){
			await sharp(`${item.srcDir}/${nameCard.index}.webp`).webp().resize(840,400).toFile(`${item.outDir}/${nameCard.name}.webp`);
		}
		consoleLogger.mark(`[名片][转换][${transI(nameCard.index)}] 名片 ${nameCard.name} ${item.type} 图像转换成功`);
	});
}

/**
 * @description 获取名片 type
 * @since 1.1.0
 * @param {object} nameCard 名片数据
 * @returns {number} 名片 type
 */
function getNameCardType(nameCard) {
	let sourceStr = "";
	try {
		sourceStr = nameCard.source.toString();
	} catch (e) {
		defaultLogger.error(`[名片][下载][${transI(nameCard.index)}] 名片 ${nameCard.name} source 数据类型错误`);
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
 * @since 1.1.0
 * @param {object} nameCard 名片数据
 * @returns {object} 转换后的名片数据
 */
function convertNameCard(nameCard) {
	const type = getNameCardType(nameCard);
	return {
		name: nameCard.name,
		type: type,
		desc: nameCard.description,
		source: nameCard.source,
		icon: `/source/nameCard/icon/${nameCard.name}.webp`,
		bg: `/source/nameCard/bg/${nameCard.name}.webp`,
		profile: `/source/nameCard/profile/${nameCard.name}.webp`,
	};
}