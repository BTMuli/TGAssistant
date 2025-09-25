/**
 * @file core/utils/fetchSgBuffer.ts
 * @description 获取 SnapGenshin 静态资源图片 buffer
 * @since 2.4.0
 */

const SG_STATIC_URL = "https://static.snapgenshin.cn/";

/**
 * @description 获取图片 buffer
 * @since 2.4.0
 * @function fecthSgBuffer
 * @param {string} dir 目录
 * @param {string} filename 文件名
 * @returns {Promise<Buffer>} 图片 buffer
 */
async function fecthSgBuffer(dir: string, filename: string): Promise<Buffer> {
  const link = `${SG_STATIC_URL}${dir}/${filename}`;
  const resp = await fetch(link);
  const arrayBuffer = await resp.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export default fecthSgBuffer;
