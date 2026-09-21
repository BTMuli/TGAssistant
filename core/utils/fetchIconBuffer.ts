/** 从本地静态资源读取 PNG，缺失时从 Nanoka 获取并转换为 PNG。 */
import path from "node:path";

import nanokaTool from "../plugins/nanoka/nanoka.ts";
import sharp from "sharp";

import fetchSgBuffer from "./fetchSgBuffer.ts";

/**
 * 按目录顺序读取本地图标，全部失败后使用 Nanoka 图标。
 * @param dirs 本地静态资源目录，按优先级排列
 * @param filename 带扩展名的图标文件名
 * @returns PNG 图片数据
 */
async function fetchIconBuffer(
  dirs: string | ReadonlyArray<string>,
  filename: string,
): Promise<Buffer> {
  const directories = typeof dirs === "string" ? [dirs] : dirs;
  for (const dir of directories) {
    try {
      return await fetchSgBuffer(dir, filename);
    } catch {
      // 继续尝试其他本地目录。
    }
  }
  const icon = path.parse(filename).name;
  const webp = await nanokaTool.fetchIcon(icon);
  return sharp(webp).png().toBuffer();
}

export default fetchIconBuffer;
