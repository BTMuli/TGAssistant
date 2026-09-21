/** Nanoka 原神成就数据类型。 */

declare namespace TGACore.Plugins.Nanoka.Achievement {
  /** achievement/achievement.json 返回的分类映射。 */
  type All = Record<string, Category>;

  type Category = {
    id: number;
    priority: number;
    icon: string;
    name: string;
    list: Array<Detail>;
  };

  type Detail = {
    id: number;
    priority: number;
    name: string;
    desc: string;
    show_type: "HIDDEN" | "VISIBLE";
    param: number;
    reward: { item_count: number; item_id: number };
    trigger_config: { param_list: Array<string>; trigger_type: string };
    prev?: number;
  };
}
