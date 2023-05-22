/**
 * @file material convert.js
 * @description 材料原始数据转换为可用数据
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import path from "node:path";
import fs from "node:fs";
import sharp from "sharp";
// TGAssistant
import pathList from "../../root.js";
import { consoleLogger, defaultLogger } from "../tools/logger.js";
import { dirCheck, fileExist } from "../tools/utils.js";

defaultLogger.info("[材料][转换] 开始执行 convert.js");

// 检测原始数据是否存在
const srcJson = path.join(pathList.src.json, "material", "amber.json");
if(!fileExist(srcJson)) {
	consoleLogger.error("[材料][转换] amber.json 不存在，请执行 download.js");
	process.exit(1);
}

// 检测保存路径是否存在
const outJsonPath = path.join(pathList.out.json, "material.json");
const outImgDir = path.join(pathList.out.img, "material");
dirCheck(outImgDir);

// 读取原始数据
const amberJson = JSON.parse(fs.readFileSync(srcJson, "utf-8"));
const materialData = [];
const count = {
	total: 0,
	success: 0,
	fail: 0,
	skip: 0,
};
defaultLogger.info("[材料][转换] 开始处理 amber.json");
const amberKey = Object.keys(amberJson["items"]);
const amberType = amberJson["types"];
amberKey.forEach((key) => {
	count.total++;
	const item = amberJson["items"][key];
	// 如果 key 不是数字，跳过
	if (isNaN(Number(key))) {
		count.skip++;
		consoleLogger.warn(`[材料][转换][${key}] ${item["name"]} key 不是数字，跳过`);
		return;
	}
	const material = {
		id: Number(key),
		name: item["name"],
		type: amberType[item["type"]],
		star: item["rank"],
		starIcon: `/icon/star/${item["rank"]}.webp`,
		bg: `/icon/bg/${item["rank"]}-Star.webp`,
		icon: `/icon/material/${key}.webp`,
	};
	count.success++;
	consoleLogger.info(`[材料][转换][${key}] ${item["name"]} 数据已添加`);
	materialData.push(material);
});
defaultLogger.info(`[材料][转换] amber.json 处理完成，共 ${count.total} 条数据，成功 ${count.success} 条，失败 ${count.fail} 条，跳过 ${count.skip} 条`);

// 排序
const outData = materialData.sort((a, b) => {
	// 先按照 type.localeCompare 排序，再按照 star 排序
	if(a.type!==b.type) {
		return a.type.localeCompare(b.type);
	}
	if(a.star!==b.star) {
		return b.star-a.star;
	}
	return a.id-b.id;
});
// 写入文件
fs.writeFileSync(outJsonPath, JSON.stringify(outData, null, 2));
defaultLogger.info(`[材料][转换] material.json 写入完成，共 ${outData.length} 条数据`);
count.success = 0;
count.fail = 0;
count.skip = 0;
consoleLogger.info("[材料][转换] 开始处理 icon");
await Promise.all(amberKey.map(async (key) => {
	const src = path.join(pathList.src.img, "material", `${key}.png`);
	const out = path.join(outImgDir, `${key}.webp`);
	if(!fileExist(src)) {
		count.fail++;
		consoleLogger.error(`[材料][转换][${key}] ${amberJson["items"][key]["name"]} 源图片不存在`);
		return;
	}
	if(fileExist(out)) {
		count.skip++;
		consoleLogger.mark(`[材料][转换][${key}] ${amberJson["items"][key]["name"]} 目标图片已存在，跳过`);
		return;
	}
	await sharp(src).png().toFormat("webp").toFile(out);
	consoleLogger.info(`[材料][转换][${key}] ${amberJson["items"][key]["name"]} 图片转换完成`);
	count.success++;
}));
defaultLogger.info(`[材料][转换] icon 处理完成，共 ${count.total} 条数据，成功 ${count.success} 条，失败 ${count.fail} 条，跳过 ${count.skip} 条`);
defaultLogger.info("[材料][转换] convert.js 执行完毕");
