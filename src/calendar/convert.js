/**
 * @file calendar convert.js
 * @description 转换原始数据为可用数据
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import path from "node:path";
import fs from "node:fs";
// TGAssistant
import pathList from "../../root.js";
import { consoleLogger, defaultLogger } from "../tools/logger.js";
import { dirCheck, fileExist } from "../tools/utils.js";

defaultLogger.info("[日历][转换] 开始执行 convert.js");

// 检测源数据文件是否存在
const srcJsonMys = path.resolve(pathList.src.json, "calendar", "mys.json");
const srcJsonCharacter = path.resolve(pathList.out.json, "character.json");
const srcJsonWeapon = path.resolve(pathList.out.json, "weapon.json");
const srcJsonMaterial = path.resolve(pathList.out.json, "material.json");
if(!fileExist(srcJsonMys)) {
	consoleLogger.error("[日历][转换][mys] 源数据文件不存在，请执行 download.js");
	process.exit(1);
}
if(!fileExist(srcJsonCharacter)) {
	consoleLogger.error("[日历][转换][character] 源数据文件不存在，请执行 character/convert.js");
	process.exit(1);
}
if(!fileExist(srcJsonWeapon)) {
	consoleLogger.error("[日历][转换][weapon] 源数据文件不存在，请执行 weapon/convert.js");
	process.exit(1);
}
if(!fileExist(srcJsonMaterial)) {
	consoleLogger.error("[日历][转换][material] 源数据文件不存在，请执行 material/convert.js");
	process.exit(1);
}

// 检测保存路径是否存在
const outJsonPath = path.resolve(pathList.out.json, "calendar.json");
dirCheck(pathList.out.json);

// 读取源数据
const mysJson = JSON.parse(fs.readFileSync(srcJsonMys, "utf-8"));
const characterJson = JSON.parse(fs.readFileSync(srcJsonCharacter, "utf-8"));
const weaponJson = JSON.parse(fs.readFileSync(srcJsonWeapon, "utf-8"));
const materialJson = JSON.parse(fs.readFileSync(srcJsonMaterial, "utf-8"));
const calendarData = [];
const materialIdsSet = new Set();
const materialSourceRecord = {};

// 处理数据
mysJson.map(item => {
	const name = item["title"];
	const calendarItem = getCalendarBaseInfo(item["break_type"], name);
	calendarItem.drop_day = item["drop_day"].map(day => Number(day));
	calendarItem.materials = getCalendarMaterials(item["contentInfos"], name);
	calendarItem.source = getCalendarSource(item["contentSource"], name);
	const ids = calendarItem.materials.map(material => material.id).join(",");
	if(materialSourceRecord[ids] === undefined && calendarItem.source["type"]!==undefined) {
		materialSourceRecord[ids] = calendarItem.source;
		consoleLogger.mark(`[日历][转换][source}] 素材来源已添加 [${ids}]`);
	}
	calendarData.push(calendarItem);
	consoleLogger.mark(`[日历][转换][${name}] 处理完成`);
});

// 处理没有 source 的数据
consoleLogger.mark("[日历][转换][source] 开始处理没有 source 的数据");
calendarData.map(item => {
	if(item.source["type"] === undefined) {
		const ids = item.materials.map(material => material.id).join(",");
		if(materialSourceRecord[ids] !== undefined) {
			item.source = materialSourceRecord[ids];
			defaultLogger.warn(`[日历][转换][${item.name}] 检测到 source 为空，已补全`);
		} else {
			defaultLogger.error(`[日历][转换][${item.name}] 素材来源未找到，请检查`);
		}
	}
});

// 排序
calendarData.sort((a, b) => {
	if(a.type !== b.type) {
		return a.type - b.type;
	}
	if(a.star !== b.star) {
		return b.star - a.star;
	}
	return a.id - b.id;
});

// 保存
fs.writeFileSync(outJsonPath, JSON.stringify(calendarData, null, 2));
defaultLogger.info(`[日历][转换] 转换完成，共 ${calendarData.length} 个数据`);
defaultLogger.info("[日历][转换] convert.js 执行完毕");

// 用到的函数

/**
 * @description 获取素材日历项基本信息
 * @since 1.1.0
 * @param {string} breakType 分隔类型
 * @param {string} name 项名称
 * @returns {object}
 */
function getCalendarBaseInfo(breakType, name) {
	let baseInfo = {};
	if(breakType === "1") {
		const itemFind = weaponJson.find(item => item.name === name);
		if(!itemFind) {
			defaultLogger.error(`[日历][转换][${name}] 未找到对应的武器数据`);
		} else {
			consoleLogger.mark(`[日历][转换][${name}] 武器数据已添加`);
			baseInfo = {
				id: itemFind.id,
				content_id: itemFind.content_id,
				drop_day:[],
				name: itemFind.name,
				item_type: "weapon",
				star: itemFind.star,
				bg: itemFind.bg,
				weapon_type: itemFind.type,
				icon: itemFind.icon,
				materials: [],
				source: {},
			};
		}
	} else if(breakType === "2") {
		const itemFind = characterJson.find(item => item.name === name);
		if(!itemFind) {
			defaultLogger.error(`[日历][转换][${name}] 未找到对应的角色数据`);
		} else {
			consoleLogger.mark(`[日历][转换][${name}] 角色数据已添加`);
			baseInfo = {
				id: itemFind.id,
				content_id: itemFind.content_id,
				drop_day:[],
				name: itemFind.name,
				item_type: "character",
				star: itemFind.star,
				bg: itemFind.bg,
				element: itemFind.element,
				weapon_type: itemFind.weapon,
				icon: itemFind.icon,
				materials: [],
				source: {},
			};
		}
	} else {
		defaultLogger.error(`[日历][转换][${name}] 未知的 breakType: ${breakType}`);
	}
	return baseInfo;
}

/**
 * @description 获取日历素材信息
 * @since 1.1.0
 * @param {array} contentInfos 内容信息
 * @param {string} name 项名称
 * @returns {array}
 */
function getCalendarMaterials(contentInfos, name) {
	const materialInfo = [];
	contentInfos.map(item => {
		let materialItem = {
			id: 0,
			content_id: 0,
			name: "",
			type: "",
			star: 0,
			bg: "",
			icon: "",

		};
		const itemFind = materialJson.find(material => material.name === item["title"]);
		if(!itemFind) {
			defaultLogger.error(`[日历][转换][${name}] 未找到对应的材料数据 ${item["title"]}`);
		} else {
			materialItem = {
				id: itemFind.id,
				content_id: item["content_id"],
				name: itemFind.name,
				type: itemFind.type,
				star: itemFind.star,
				bg: itemFind.bg,
				icon: itemFind.icon,
			};
			consoleLogger.mark(`[日历][转换][${name}] 材料数据 ${item["title"]} 已添加`);
			materialInfo.push(materialItem);
		}
	});
	materialInfo.sort((a, b) => b.star - a.star);
	const ids = materialInfo.map(item => item.id).join(",");
	if(!materialIdsSet.has(ids)) {
		materialIdsSet.add(ids);
		consoleLogger.mark(`[日历][转换][material] 添加新的材料组合 [${ids}]`);
	}
	return materialInfo;
}

/**
 * @description 获取日历来源信息
 * @since 1.1.0
 * @param {array} contentSource 内容来源
 * @param {string} name 项名称
 * @returns {object}
 */
function getCalendarSource(contentSource, name) {
	const sourceMap = {
		"忘却之峡": {
			type: "character",
			area: "蒙德"
		},
		"太山府":{
			type: "character",
			area: "璃月"
		},
		"菫色之庭": {
			type: "character",
			area: "稻妻"
		},
		"昏识塔": {
			type: "character",
			area: "须弥"
		},
		"塞西莉亚苗圃":{
			type: "weapon",
			area: "蒙德"
		},
		"震雷连山密宫": {
			type: "weapon",
			area: "璃月"
		},
		"砂流之庭": {
			type: "weapon",
			area: "稻妻"
		},
		"有顶塔": {
			type: "weapon",
			area: "须弥"
		}
	};
	const sourceKey = Object.keys(sourceMap);
	let sourceData = {};
	let sourceName;
	try {
		sourceName = contentSource[0]["title"];
	} catch (error) {
		consoleLogger.warn(`[日历][转换][${name}] 未找到对应的来源数据`);
		return sourceData;
	}
	if(!sourceKey.includes(sourceName)) {
		defaultLogger.error(`[日历][转换][${name}] 未知的来源: ${sourceName}`);
		return sourceData;
	}
	sourceData = {
		type: sourceMap[sourceName].type,
		area: sourceMap[sourceName].area,
		name: sourceName,
		content_id: contentSource["content_id"],
	};
	return sourceData;

}