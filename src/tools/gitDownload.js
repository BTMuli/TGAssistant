/**
 * @file tools gitDownload.js
 * @description 下载 GitHub 仓库的文件
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import axios from "axios";
import { writeFileSync } from "node:fs";
// TGAssistant
import logger from "./logger.js";

/**
 * @description 获取 GitHub 仓库的文件对应下载地址
 * @param {string} repo 仓库地址
 * @param {string} tree 分支
 * @param {string} file 文件路径
 * @returns {string} 下载地址
 */
function getDownloadUrl(repo, file, tree = "master") {
	return `https://raw.fastgit.org/${repo}/${tree}/${file}`;
}

/**
 * @description 下载 GitHub 仓库的文件
 * @param {string} repo 仓库地址
 * @param {string} file 文件路径
 * @param {string} savePath 保存路径
 * @returns {Promise<void>} 无返回值
 */
async function gitDownload(repo, file, savePath) {
	logger.info(`[gitDownload] 开始下载 ${file}`);
	const downloadUrl = getDownloadUrl(repo, file);
	try {
		await axios.get(downloadUrl, {
			responseType: "text",
		}).then((res) => {
			writeFileSync(savePath, res.data);
			logger.info(`[gitDownload] ${file} 下载完成`);
		});
	} catch (error) {
		logger.error(`[gitDownload] ${file} 下载失败`);
	}
}

export default gitDownload;
