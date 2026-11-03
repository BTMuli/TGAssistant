/**
 * 为一次转换建立材料索引，复用材料匹配结果。
 * @since 2.7.0
 */

import hutaoTool from "@hutao/hutao.ts";
import logger from "@tools/logger.ts";

/**
 * 读取一次材料表，创建按 ID 匹配材料的函数。
 * @since 2.7.0
 * @returns 保留输入顺序并跳过缺失 ID 的材料匹配函数
 */
function createMaterialMatcher(): (
  materialIds: ReadonlyArray<number>,
) => Array<TGACore.Components.Calendar.Material> {
  const rawMaterials = hutaoTool.read<TGACore.Plugins.Hutao.Material.FullInfo>(
    hutaoTool.enum.file.Material,
  );
  const materials = new Map(rawMaterials.map((material) => [material.Id, material]));
  /**
   * 按输入 ID 匹配当前材料索引。
   * @since 2.7.0
   * @param materialIds - 材料 ID 列表
   * @returns 匹配到的材料资料
   */
  return function matchMaterials(
    materialIds: ReadonlyArray<number>,
  ): Array<TGACore.Components.Calendar.Material> {
    const result: Array<TGACore.Components.Calendar.Material> = [];
    for (const id of materialIds) {
      const material = materials.get(id);
      if (material) {
        result.push({ id: material.Id, name: material.Name, star: material.RankLevel });
      } else {
        logger.default.warn(`[utils][matchMaterials] 未找到ID为 ${id} 的材料`);
      }
    }
    return result;
  };
}

export default createMaterialMatcher;
