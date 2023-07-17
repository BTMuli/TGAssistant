/**
 * @file character convert.js
 * @description 转换原始数据为可用数据
 * @author BTMuli <bt-muli@outlook.com>
 * @since 1.3.0
 */

// Node
import path from "node:path";
import fs from "node:fs";
import sharp from "sharp";
// TGAssistant
import pathList from "../../root.js";
import { consoleLogger, defaultLogger } from "../tools/logger.js";
import { dirCheck, fileExist } from "../tools/utils.js";

defaultLogger.info("[角色][转换] 开始执行 convert.js");

// 检测原始数据是否存在
const srcJsonAmber = path.join(pathList.src.json, "character", "amber.json");
const srcJsonMys = path.join(pathList.src.json, "character", "mys.json");
const srcNameCard = path.join(pathList.src.json, "namecard", "namecard.json");
const srcJsonHutao = path.join(pathList.src.json, "character", "hutao.json");

if (!fileExist(srcJsonAmber)) {
	consoleLogger.error("[角色][转换] amber.json 不存在，请执行 download.js");
	process.exit(1);
}
if (!fileExist(srcJsonMys)) {
	consoleLogger.error("[角色][转换] mys.json 不存在，请执行 download.js");
	process.exit(1);
}
if (!fileExist(srcNameCard)) {
	consoleLogger.error("[角色][转换] namecard.json 不存在，请执行 namecard/download.js");
	process.exit(1);
}
if (!fileExist(srcJsonHutao)) {
	consoleLogger.error("[角色][转换] hutao.json 不存在，请执行 download.js");
	process.exit(1);
}

// 检测保存路径是否存在
const outJsonDir = pathList.out.json;
const outJsonPath = path.join(pathList.out.json, "character.json");
const outImgDir = path.join(pathList.out.img, "character");
dirCheck(outJsonDir);
dirCheck(outImgDir);

// 读取原始数据
const amberJson = JSON.parse(fs.readFileSync(srcJsonAmber, "utf-8"));
const mysJson = JSON.parse(fs.readFileSync(srcJsonMys, "utf-8"));
const nameCardJson = JSON.parse(fs.readFileSync(srcNameCard, "utf-8"));
const hutaoJson = JSON.parse(fs.readFileSync(srcJsonHutao, "utf-8"));

const characterData = [];
const characterIdSet = new Set();

const count = {
	total: 0,
	success: 0,
	fail: 0,
	skip: 0,
};

// 处理 amber.json
defaultLogger.info("[角色][转换] 开始处理 amber.json");
const amberKey = Object.keys(amberJson["items"]);
for (const key of amberKey) {
	let keyGet = -1;
	const item = amberJson["items"][key];
	let name = item["name"];
	count.total++;
	if (isNaN(Number(key))) {
		keyGet = Number(key.slice(0, 8));
	} else {
		keyGet = Number(key);
	}
	if (keyGet === 10000005) name = "旅行者-空";
	if (keyGet === 10000007) name = "旅行者-荧";
	if (characterIdSet.has(keyGet)) {
		count.skip++;
		consoleLogger.mark(`[角色][转换][${key}] ${name} 数据重复，跳过`);
		continue;
	}
	characterIdSet.add(keyGet);
	const character = {
		id: keyGet,
		contentId: 0,
		name: name,
		title: "",
		description: "",
		birthday: item["birthday"],
		star: item["rank"],
		element: keyGet === 10000005 ? "" : keyGet === 10000007 ? "" : getAmberElement(item["element"]),
		weapon: getAmberWeapon(item["weaponType"]),
		nameCard: "",
	};
	count.success++;
	characterData.push(character);
}
defaultLogger.info(
	`[角色][转换] amber.json 处理完成，共处理 ${count.success} 个，跳过 ${count.skip} 个`,
);
// 处理 mys.json
count.success = 0;
count.skip = 0;
defaultLogger.info("[角色][转换] 开始添加 content_id");
characterData.forEach((character) => {
	const mysFind = mysJson.find((item) => item.title === character["name"]);
	if (!mysFind) {
		count.fail++;
		defaultLogger.warn(`[角色][转换][${character["id"]}] ${character["name"]} 未找到 content_id`);
		return;
	}
	character.contentId = mysFind["content_id"];
	count.success++;
});
defaultLogger.info(
	`[角色][转换] content_id 添加完成，共添加 ${count.success} 个，失败 ${count.fail} 个`,
);
// 处理 namecard.json
count.success = 0;
count.fail = 0;
defaultLogger.info("[角色][转换] 开始添加 namecard");
characterData.forEach((character) => {
	// 是否包含角色名或者角色名后两个字
	const nameCardFind = nameCardJson.find(
		(item) =>
			item.source.includes(character["name"]) || item.source.includes(character["name"].slice(-2)),
	);
	if (!nameCardFind) {
		count.fail++;
		defaultLogger.warn(`[角色][转换][${character["id"]}] ${character["name"]} 未找到 namecard`);
		return;
	}
	character.nameCard = nameCardFind["name"];
	count.success++;
});
defaultLogger.info(
	`[角色][转换] namecard 添加完成，共添加 ${count.success} 个，失败 ${count.fail} 个`,
);
// 处理 hutao.json
count.success = 0;
count.fail = 0;
defaultLogger.info("[角色][转换] 开始添加 title、description");
characterData.forEach((character) => {
	const hutaoFind = hutaoJson.find((item) => item["Id"] === character.id);
	if (!hutaoFind) {
		count.fail++;
		defaultLogger.warn(
			`[角色][转换][${character["id"]}] ${character["name"]} 未找到 title、description`,
		);
		return;
	}
	character.title = hutaoFind["FetterInfo"]["Title"];
	character.description = hutaoFind["FetterInfo"]["Detail"];
	count.success++;
});
defaultLogger.info(
	`[角色][转换] title、description 添加完成，共添加 ${count.success} 个，失败 ${count.fail} 个`,
);

// 按照 id 排序
const outData = characterData
	.filter((item) => item.contentId !== 0)
	.sort((a, b) => b["star"] - a["star"] || b["id"] - a["id"]);
// 写入文件
fs.writeFileSync(outJsonPath, JSON.stringify(outData, null, 2));
defaultLogger.info(
	`[角色][转换] 写入文件 character.json 完成, 处理${characterData.length}个，写入${outData.length}个`,
);
count.success = 0;
count.fail = 0;
defaultLogger.info("[角色][转换] 开始转换图片");
await Promise.allSettled(
	characterData.map(async (character) => {
		const src = path.join(pathList.src.img, "character", `${character["id"]}.png`);
		const out = path.join(outImgDir, `${character["id"]}.webp`);
		if (!fileExist(src)) {
			count.fail++;
			consoleLogger.error(`[角色][转换][${character["id"]}] ${character["name"]} 源图片不存在`);
			return;
		}
		if (character.contentId === 0) {
			defaultLogger.warn(`[角色][转换][${character["id"]}] ${character["name"]} content_id 不存在`);
		}
		if (fileExist(out)) {
			count.skip++;
			consoleLogger.mark(`[角色][转换][${character["id"]}] ${character["name"]} 目标图片已存在`);
			return;
		}
		await sharp(src).png().toFormat("webp").toFile(out);
		consoleLogger.info(`[角色][转换][${character["id"]}] ${character["name"]} 转换完成`);
		count.success++;
	}),
);
defaultLogger.info(
	`[角色][转换] 转换图片完成，共转换 ${count.success} 个，失败 ${count.fail} 个，跳过 ${count.skip} 个`,
);
defaultLogger.info("[角色][转换] convert.js 执行完成");

// 用到的函数

/**
 * @description 获取角色元素
 * @since 1.2.0
 * @param {string} element 原始数据中的元素
 * @returns {string} 角色元素
 */
function getAmberElement(element) {
	const elementMap = {
		Fire: "火",
		Water: "水",
		Wind: "风",
		Electric: "雷",
		Ice: "冰",
		Rock: "岩",
		Grass: "草",
	};
	return elementMap[element];
}

/**
 * @description 获取角色武器
 * @since 1.2.0
 * @param {string} weapon 原始数据中的武器
 * @returns {string} 角色武器
 */
function getAmberWeapon(weapon) {
	const weaponMap = {
		WEAPON_SWORD_ONE_HAND: "单手剑",
		WEAPON_CLAYMORE: "双手剑",
		WEAPON_POLE: "长柄武器",
		WEAPON_BOW: "弓",
		WEAPON_CATALYST: "法器",
	};
	return weaponMap[weapon];
}
