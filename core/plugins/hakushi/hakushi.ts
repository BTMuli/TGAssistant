/**
 * Hakushi 插件
 * @since 2.5.0
 */

const HAKUSHI_URL = "https://api.hakush.in/gi/";
const HAKUSHI_ASSET_URL = `${HAKUSHI_URL}/UI/`;

/**
 * 获取JSON数据
 * @template T 返回数据类型泛型
 * @param {string} relPath 相对路径
 * @return {Promise<T>}
 */
async function fetchJson<T>(relPath: string): Promise<T> {
  const link = `${HAKUSHI_URL}${relPath}`;
  const resp = await fetch(link);
  return <T>await resp.json();
}

/**
 * 获取图像数据
 * @param {string} icon 图像名称
 * @return {Promise<Buffer>} 图像Buffer
 */
async function fetchBuffer(icon: string): Promise<Buffer> {
  const link = `${HAKUSHI_ASSET_URL}${icon}.webp`;
  const resp = await fetch(link);
  const arrayBuffer = await resp.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

const hakushiTool = {
  fetchJson,
  fetchBuffer,
};

export default hakushiTool;
