/**
 * 获取 SnapGenshin 静态资源图片 buffer
 * @since 2.5.0
 */
import fs from "node:fs/promises";

import appRootPath from "app-root-path";

const SG_STATIC_URL = `${appRootPath.path}/repos/Snap.Static/`;

/**
 * 获取图片 buffer
 * @since 2.5.0
 * @function fecthSgBuffer
 * @param {string} dir 目录
 * @param {string} filename 文件名
 * @returns {Promise<Buffer>} 图片 buffer
 */
async function fecthSgBuffer(dir: string, filename: string): Promise<Buffer> {
  const link = `${SG_STATIC_URL}${dir}/${filename}`;
  // 读取文件
  const res = await fs.readFile(link);
  return <Buffer>(<unknown>res.buffer);
}

export default fecthSgBuffer;
