/**
 * @file namecard download.js
 * @description 下载图像资源，获取原始数据文件
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import path from "node:path";
import fs from "node:fs";
import axios from "axios";
import sharp from "sharp";
import { load } from "cheerio";
// TGAssistant
import { defaultLogger,consoleLogger } from "../tools/logger.js";
import pathList from "../../root.js";
import { dirCheck, fileExist } from "../tools/utils.js";

defaultLogger.info("[名片][下载] 正在运行 downloadImg.js");

const srcImgDir = path.resolve(pathList.src.img, "namecard");
const outImgDir = path.resolve(pathList.out.img, "namecard");
const srcJsonDir = path.resolve(pathList.src.json, "namecard");
const dataPaths = {
	src: path.resolve(srcJsonDir, "namecard.json"),
	out: path.resolve(pathList.out.json, "namecard.json"),
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
const urlList = {
	pre: "https://genshin.honeyhunterworld.com/img/i_7",
	curr: "https://genshin.honeyhunterworld.com/img/i_n210",
};

// 检测目录是否存在
dirCheck(srcImgDir);
dirCheck(outImgDir);
dirCheck(srcJsonDir);
dataList.forEach(data => {
	dirCheck(data.srcDir);
	dirCheck(data.outDir);
});

// 下载图像
defaultLogger.info("[名片][下载] 开始下载图像");
for (let i = 1; i <= 163; i++) {
	if (i <= 117) {
		await downloadImgByIndex(i, "pre");
	} else if (i >= 122) {
		await downloadImgByIndex(i, "curr");
	} else {
		consoleLogger.info(`[名片][下载][${i}] 不存在, 跳过`);
	}
}
defaultLogger.info("[名片][下载] 图像下载完成");

defaultLogger.info("[名片][下载] 开始获取原始数据");
let nameCardsData;
try {
	nameCardsData = JSON.parse(fs.readFileSync(dataPaths.src, "utf-8"));
	nameCardsData = nameCardsData.filter(item => item !== null);
	fs.writeFileSync(dataPaths.src, JSON.stringify(nameCardsData, null, 2));
} catch (error) {
	nameCardsData = [];
}
const nameCardSet = new Set();
nameCardsData.map(item => nameCardSet.add(item.index));
for (let i = 1; i <= 163; i++) {
	if (i <= 117) {
		if (nameCardSet.has(i)) {
			consoleLogger.info(`[名片][下载][${i}] 已存在, 跳过`);
			continue;
		}
		const dataGet = await getNameCardByIndex(i, "pre");
		nameCardsData.push(dataGet);
		fs.writeFileSync(dataPaths.src, JSON.stringify(nameCardsData, null, 2));
	} else if (i >= 122) {
		if (nameCardSet.has(i)) {
			consoleLogger.info(`[名片][下载][${i}] 已存在, 跳过`);
			continue;
		}
		const dataGet = await getNameCardByIndex(i, "curr");
		nameCardsData.push(dataGet);
		fs.writeFileSync(dataPaths.src, JSON.stringify(nameCardsData, null, 2));
	}
}
defaultLogger.info("[名片][下载] 获取原始数据完成，请执行 convert.js 处理数据");

// 使用的函数

/**
 * @description 获取文件保存路径
 * @param {string} fileType 文件类型
 * @param {number} index 文件索引
 * @returns {string} 文件保存路径
 */
function getSavePath(fileType, index) {
	return path.resolve(srcImgDir, fileType, `${index}.webp`);
}

/**
 * @description 下载图像
 * @param {string} url 图像链接
 * @param {number} index 图像索引
 * @param {string} imgType 图像类型
 * @returns {Promise<void>} 无返回值
 */
async function downloadImg(url, index, imgType) {
	const savePath = getSavePath(imgType, index);
	if (fileExist(savePath)) {
		consoleLogger.info(`[名片][下载][${index}] ${imgType} 已存在, 跳过`);
		return;
	}
	try {
		await axios.get(url, {
			responseType: "arraybuffer",
		}).then(res => {
			sharp(res.data).webp().toFile(savePath, (err, info) => {
				if (err) {
					defaultLogger.error(`[名片][下载][${index}] ${imgType} 下载失败`);
				} else {
					defaultLogger.info(`[名片][下载][${index}] ${imgType} 下载成功，大小为 ${info.size}`);
				}
			});
		});
	} catch (e) {
		defaultLogger.error(`[名片][下载][${index}] ${index} 下载失败`);
	}
}

/**
 * @description 获取下载链接
 * @param {string} baseUrl 基础链接
 * @param {number} index 图像索引
 * @returns {[{type: string, url: string}]} 下载链接列表
 */
function getDownloadUrls(baseUrl, index) {
	const indexStr = index.toString().padStart(3, "0");
	return [
		{
			type: "icon",
			url: `${baseUrl}${indexStr}_70.webp`,
		},
		{
			type: "bg",
			url: `${baseUrl}${indexStr}_back.webp`,
		},
		{
			type: "profile",
			url: `${baseUrl}${indexStr}_profile.webp`,
		}
	];
}

/**
 * @description 根据 index 和 urlType 下载图像
 * @param {number} index 图像索引
 * @param {string} urlType 图像类型
 * @returns {Promise<void>} 无返回值
 */
async function downloadImgByIndex(index, urlType) {
	let baseUrl = "";
	if (urlType === "pre") {
		baseUrl = urlList.pre;
	} else if (urlType === "curr") {
		baseUrl = urlList.curr;
	} else {
		defaultLogger.error(`[名片][下载][${index}] 图像类型错误`);
		return;
	}
	const downloadList = getDownloadUrls(baseUrl, index);
	downloadList.map(async item => await downloadImg(item.url, index, item.type));
}

/**
 * @description 根据 url 获取名片对应 table 的 html
 * @param {string} url 名片链接
 * @param {number} index 名片索引
 * @returns {Promise<srcData.NameCard>} 名片对应 table 的 html
 */
async function getNameCard(url, index) {
	try {
		const html = (await axios.get(url)).data;
		const tbSelector = "body > div.wp-site-blocks > div.wp-block-columns > div:nth-child(3) > div.entry-content.wp-block-post-content > table";
		const htmlDom = load(html);
		const trsGet = htmlDom(tbSelector).find("tr");
		let nameCard = {
			index: index,
			name: "",
			description: "",
			source: "",
		};
		trsGet.each((i, tr) => {
			const tds = htmlDom(tr).find("td");
			if (tds.length === 3) {
				if (htmlDom(tds[1]).text().trim() === "Name") {
					nameCard.name = htmlDom(tds[2]).text().trim();
				}
			}
			if (tds.length === 2) {
				const tdsFirst = htmlDom(tds[0]).text().trim();
				if (tdsFirst.startsWith("Description")) {
					nameCard.description = htmlDom(tds[1]).text().trim();
				}
				if (tdsFirst.startsWith("Item Source")) {
					nameCard.source = htmlDom(tds[1]).text().trim();
				}
			}
		});
		if (nameCard.name !== "？？？") {
			consoleLogger.info(`[名片][下载][${index}] 名片 ${nameCard.name} 解析成功`);
		} else {
			defaultLogger.warn(`[名片][下载][${index}] 名片 ${nameCard.name} 数据不完整`);
		}
		return nameCard;
	} catch (e) {
		defaultLogger.error(`[名片][下载][${index}] 获取 html 失败`);
	}
}


/**
 * @description 根据 index 获取名片数据
 * @param {number} index 名片索引
 * @param {string} urlType 图像类型
 * @returns {Promise<srcData.NameCard|void>} 名片数据
 */
async function getNameCardByIndex(index, urlType) {
	let url = "";
	if (urlType === "pre") {
		url = `${urlList.pre}${index.toString().padStart(3, "0")}/?lang=CHS`;
	} else if (urlType === "curr") {
		url = `${urlList.curr}${index.toString().padStart(3, "0")}/?lang=CHS`;
	} else {
		defaultLogger.error(`[名片][下载][${index}] 图像类型错误`);
		return;
	}
	return await getNameCard(url, index);
}


