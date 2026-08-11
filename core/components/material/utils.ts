/**
 * 材料组件工具
 * @since 2.6.0
 */

import fetchSgBuffer from "@utils/fetchSgBuffer.ts";

const MATERIAL_ICON_DIRECTORIES: ReadonlyArray<string> = ["ItemIcon-Minimum", "ItemIcon"];

/**
 * 获取材料图标，按目录优先级依次尝试
 * @since 2.6.0
 * @param {string} filename 图标文件名
 * @return {Promise<Buffer>} 图标数据
 */
async function fetchMaterialIcon(filename: string): Promise<Buffer> {
  let lastError: unknown;
  for (const directory of MATERIAL_ICON_DIRECTORIES) {
    try {
      return await fetchSgBuffer(directory, filename);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

export default fetchMaterialIcon;
