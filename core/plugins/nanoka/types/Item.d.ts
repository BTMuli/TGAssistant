/**
 * Nanoka 原神物品数据类型
 */

declare namespace TGACore.Plugins.Nanoka.Item {
  /** item_all.json 返回的 ID 到物品映射。 */
  type All = Record<string, Detail>;

  type Detail = {
    name: string;
    desc: string;
    rank: number;
    icon: string;
    item_type: string;
    material_type: string | null;
    jump_descs: string[];
    source_list: string[];
    title: string;
    effect: string;
    special: string;
    type: string;
    food_quality?: string;
    week?: number;
  };
}
