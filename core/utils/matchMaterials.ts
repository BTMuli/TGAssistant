/**
 * @file core/utils/matchMaterials.ts
 * @description 用于匹配材料名称的工具函数
 * @since 2.4.0
 */

import hutaoTool from "@hutao/hutao.ts";
import logger from "@tools/logger.ts";

/**
 * @description 传入材料ID列表，返回匹配的材料资料列表
 * @since 2.4.0
 * @function matchMaterials
 * @param {Array<number>} materialIds - 材料ID列表
 * @return {Array<TGACore.Components.Calendar.Material>}
 */
function matchMaterials(materialIds: Array<number>): Array<TGACore.Components.Calendar.Material> {
  const check = hutaoTool.check(hutaoTool.enum.file.Material);
  if (!check) throw new Error(`[utils][matchMaterials] 缺失元数据文件 Material.json，请检查`);
  const rawMaterials = hutaoTool.read<TGACore.Plugins.Hutao.Material.RawMaterial>(
    hutaoTool.enum.file.Material,
  );
  const res: Array<TGACore.Components.Calendar.Material> = [];
  for (const id of materialIds) {
    const materialFind = rawMaterials.find((m) => m.Id === id);
    if (materialFind) {
      res.push({ id: materialFind.Id, name: materialFind.Name, star: materialFind.RankLevel });
    } else {
      logger.default.warn(`[utils][matchMaterials] 未找到ID为 ${id} 的材料`);
    }
  }
  return res;
}

export default matchMaterials;
