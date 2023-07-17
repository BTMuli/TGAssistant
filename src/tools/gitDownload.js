/**
 * @file tools gitDownload.js
 * @description 下载 GitHub 仓库的文件
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.3.0
 */

// Node
import { writeFileSync } from "node:fs";
import axios from "axios";
// TGAssistant
import { defaultLogger, consoleLogger } from "./logger.js";

/**
 * @description 获取 GitHub 仓库的文件对应下载地址
 * @since 1.3.0
 * @param {string} repo 仓库地址
 * @param {string} tree 分支
 * @param {string} file 文件路径
 * @returns {string} 下载地址
 */
function getDownloadUrl(repo, file, tree = "master") {
  return `https://raw.kgithub.com/${repo}/${tree}/${file}`;
}

/**
 * @description 下载 GitHub 仓库的文件
 * @since 1.3.0
 * @param {string} repo 仓库地址
 * @param {string} file 文件路径
 * @param {string} savePath 保存路径
 * @returns {Promise<void>} 无返回值
 */
async function gitDownload(repo, file, savePath) {
  consoleLogger.info(`[gitDownload] 开始下载 ${file}`);
  const downloadUrl = getDownloadUrl(repo, file);
  await axios
    .get(downloadUrl, {
      responseType: "text",
    })
    .then((res) => {
      writeFileSync(savePath, res.data);
      defaultLogger.info(`[gitDownload] ${file} 下载完成`);
    })
    .catch((error) => {
      defaultLogger.error(`[gitDownload] ${downloadUrl} 下载失败`);
      defaultLogger.error(error.message);
    });
}

export default gitDownload;
