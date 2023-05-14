/**
 * @file gcg convert.js
 * @description 处理 gcg 原始图像&JSON 数据，生成可用的图像&JSON 数据，以及对应的图像文件
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import path from "node:path";
import fs from "node:fs";
// TGAssistant
import { defaultLogger,consoleLogger } from "../tools/logger.js";
import pathList from "../../root.js";
import sharp from "sharp";
import { dirCheck } from "../tools/utils.js";

defaultLogger.info("[GCGenerator][转换] 正在运行 convert.js");

const srcJsonDir = path.resolve(pathList.src.json, "gcg");
const srcImgDir = path.resolve(pathList.src.img, "gcg");
const outImgDir = path.resolve(pathList.out.img, "gcg");
const srcJsonMys = path.resolve(srcJsonDir, "mys.json");
const srcJsonAmber = path.resolve(srcJsonDir, "amber.json");
const jsonSavePath = path.resolve(pathList.out.json, "GCG.json");

// 检测资源文件是否存在
if (!fs.existsSync(srcJsonMys)) {
	defaultLogger.error("[GCG][转换] 未找到原始数据文件 mys.json，请执行 download.js");
	process.exit(1);
}
if (!fs.existsSync(srcJsonAmber)) {
	defaultLogger.error("[GCG][转换] 未找到原始数据文件 amber.json，请执行 download.js");
	process.exit(1);
}
// 检查输出目录是否存在
dirCheck(outImgDir);

const gcgData = [];

// 获取 AmberJson 的所有图像数据
defaultLogger.info("[GCG][转换] 正在读取 amber.json");
const amberJson = JSON.parse(fs.readFileSync(srcJsonAmber, "utf-8"));
const amberKeys = Object.keys(amberJson);
const gcgTitleSet = new Set();
amberKeys.map(key => {
	const item = amberJson[key];
	gcgTitleSet.add(item.name);
});
defaultLogger.info(`[GCG][转换] amber.json 读取完成，共 ${gcgTitleSet.size} 个图像数据`);

// 获取 MysJson 的所有图像数据
defaultLogger.info("[GCG][转换] 正在读取 mys.json");
const mysJson = JSON.parse(fs.readFileSync(srcJsonMys, "utf-8"));
await Promise.allSettled(mysJson.map(async itemList => {
	consoleLogger.info(`[GCG][转换] 正在读取 ${itemList.name} 列表`);
	await itemList.list.map(item => {
		const gcgItem = getGcgItem(itemList.name, amberJson, item);
		gcgData.push(gcgItem);
		convertImg(gcgItem);
	});
}));

defaultLogger.info(`[GCG][转换] mys.json 读取完成，共 ${gcgData.length} 个图像数据`);
defaultLogger.info("[GCG][转换] 对 GCG.json 进行排序");
gcgData.sort((a, b) => a.type.localeCompare(b.type) || a.id - b.id || a.content_id - b.content_id);
fs.writeFileSync(jsonSavePath, JSON.stringify(gcgData, null, 2), "utf-8");
defaultLogger.info(`[GCG][转换] GCG.json 保存完成，共 ${gcgData.length} 个图像数据`);

if (gcgTitleSet.size > 0) {
	defaultLogger.warn(`[GCG][转换] amber.json 中有 ${gcgTitleSet.size} 个图像数据未被使用`);
}

defaultLogger.info("[GCG][转换] convert.js 运行结束");

// 用到的函数

/**
 * @description 获取 GCG JSON 数据
 * @param {string} name 卡牌类型
 * @param {object} amberJson AmberJson 数据
 * @param {object} item MysJson 数据
 * @returns {object} GCG JSON 数据
 */
function getGcgItem(name, amberJson, item) {
	const itemFind = Object.values(amberJson).find(amberItem => amberItem.name === item.title);
	let idFind = 0;
	if (!itemFind) {
		defaultLogger.warn(`[GCG][转换] AmberJson 中未找到 ${item.title} 的数据，id 设置为 0`);
	} else {
		idFind = itemFind.id;
	}
	return {
		id: idFind,
		content_id: item.content_id,
		name: item.title,
		type: name,
		icon: `/WIKI/GCG/normal/${item.title}.webp`,
	};
}

/**
 * @description 转换图像
 * @param {object} item GCG JSON 数据
 * @returns {void}
 */
function convertImg(item) {
	if (!item) return;
	const srcImgPath = path.resolve(srcImgDir, `${item.name}.png`);
	const outImgPath = path.resolve(outImgDir, `${item.name}.webp`);
	gcgTitleSet.delete(item.name);
	if (!fs.existsSync(srcImgPath)) {
		defaultLogger.error(`[GCG][转换] 未找到 ${item.name} 的图像文件`);
		return;
	}
	if (fs.existsSync(outImgPath)) {
		consoleLogger.info(`[GCG][转换] ${item.name} 图像已存在，跳过`);
		return;
	}
	sharp(srcImgPath).png().toFormat("webp").toFile(outImgPath, (err) => {
		if (err) {
			defaultLogger.error(`[GCG][转换] ${item.name} 图像转换失败`);
			return;
		}
		defaultLogger.info(`[GCG][转换] ${item.name} 图像转换成功`);
	});
}