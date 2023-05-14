/**
 * @file material download.js
 * @description 材料原始数据下载
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.0.0
 */

// Node
import fs from "node:fs";
import path from "node:path";
import axios from "axios";
import sharp from "sharp";
// TGAssistant
import pathList, { AMBER_VH } from "../../root.js";
import { consoleLogger, defaultLogger } from "../tools/logger.js";
import { dirCheck, fileExist } from "../tools/utils.js";

defaultLogger.info("[材料][下载] 开始执行 download.js");

// 检测保存路径是否存在
const srcImgDir = path.resolve(pathList.src.img, "material");
const srcJsonDir = path.resolve(pathList.src.json, "material");
dirCheck(srcImgDir);
dirCheck(srcJsonDir);

const amberUrl = `https://api.ambr.top/v2/chs/material?vh=${AMBER_VH}`;
const amberSavePath = path.resolve(srcJsonDir, "amber.json");

// 下载JSON
defaultLogger.info("[材料][下载] 正在下载 JSON");
if (!fileExist(amberSavePath)) {
	try {
		await axios.get(amberUrl).then(res => {
			const dataGet = res.data["data"];
			fs.writeFileSync(amberSavePath, JSON.stringify(dataGet, null, 2));
			defaultLogger.info("[材料][下载] amber.json 下载完成");
		});
	} catch (error) {
		defaultLogger.error("[材料][下载] amber.json 下载失败");
		defaultLogger.error(error.message);
	}
}

// 下载图片
defaultLogger.info("[材料][下载] 正在下载图片");
const count = {
	total: 0,
	success: 0,
	skip: 0,
	fail: 0
};
const amberJson = JSON.parse(fs.readFileSync(amberSavePath, "utf-8"));
const amberKeys = Object.keys(amberJson["items"]);
await Promise.allSettled(amberKeys.map(async (key) => {
	count.total++;
	const item = amberJson["items"][key];
	const url = getAmberUrl(item["icon"]);
	const savePath = path.resolve(srcImgDir, `${key}.png`);
	if (!fileExist(savePath)) {
		await downloadImg(url, savePath, key);
	} else {
		count.skip++;
		consoleLogger.mark(`[材料][下载][${key}] 图像已存在，跳过下载`);
	}
}));
defaultLogger.info(`[材料][下载] 图片下载完成，共 ${count.total} 张，成功 ${count.success} 张，跳过 ${count.skip} 张，失败 ${count.fail} 张`);
defaultLogger.info("[材料][下载] download.js 执行完毕");

// 用到的函数

/**
 * @description 获取 Amber.top 图片链接
 * @since 1.1.0
 * @param {string} pre 原始链接
 * @returns {string} Amber.top 图片链接
 */
function getAmberUrl(pre) {
	return `https://api.ambr.top/assets/UI/${pre}.png`;
}

/**
 * @description 下载图片
 * @since 1.1.0
 * @param {string} url 图片链接
 * @param {string} savePath 保存路径
 * @param {string} index 图片索引
 * @returns {Promise<void>} 下载完成
 */
async function downloadImg(url, savePath, index) {
	try {
		await axios.get(url, {
			responseType: "arraybuffer",
		}).then(res => {
			defaultLogger.info(`[材料][下载][${index}] 图像下载完成`);
			sharp(res.data).png().toFile(savePath, (err, info) => {
				if (err) {
					defaultLogger.error(`[材料][下载][${index}] 图像保存失败`);
				} else {
					consoleLogger.info(`[材料][下载][${index}] 图像保存成功`);
				}
			});
			count.success++;
		});
	} catch (error) {
		count.fail++;
		defaultLogger.error(`[材料][下载][${index}] ${savePath} 下载失败`);
		defaultLogger.error(error.message);
	}
}