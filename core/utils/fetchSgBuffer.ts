/**
 * 获取 SnapGenshin 静态资源图片 buffer
 * @since 2.6.0
 */
import fs from "node:fs/promises";

import appRootPath from "app-root-path";

const SG_STATIC_URL = `${appRootPath.path}/repos/Snap.Static/`;

/**
 * 获取图片 buffer
 * @since 2.6.0
 * @function fecthSgBuffer
 * @param {string} dir 目录
 * @param {string} filename 文件名
 * @returns {Promise<Buffer>} 图片 buffer
 */
async function fecthSgBuffer(dir: string, filename: string): Promise<Buffer> {
  const link = `${SG_STATIC_URL}${dir}/${filename}`;
  return fs.readFile(link);
}

export default fecthSgBuffer;
