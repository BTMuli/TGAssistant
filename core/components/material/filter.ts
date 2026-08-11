/**
 * 材料组件数据过滤规则
 * @since 2.6.0
 */

export const IGNORE_TYPE_DESCRIPTIONS: ReadonlySet<string> = new Set([
  "命之座激活",
  "奇域经验",
  "功能开启凭证",
  "角色解锁",
  "龙血BUFF",
  "未知武器",
  "任务物品",
  "宝箱",
  "食谱",
  "合成产物",
  "纪行经验",
  "礼包",
  "获取燃素",
  "角色装扮",
  "探索资源",
  "鱼",
  "海灯节材料",
  "雪山材料",
  "精炼材料",
  "碎果残块",
  "碎果裂片",
  "碎果细屑",
  "鱼饵",
  "鱼竿",
  "合成图纸",
  "锻造图纸",
  "鱼饵图纸",
  "烟花",
  "臻冰造物外观",
  "头像",
  "摆设套装图纸",
  "摆设图纸",
]);

export const KEEP_CONSUMABLE_IDS: ReadonlySet<number> = new Set([
  // 100225 狩猎陷阱
  100225,
  // 101692 光界之印、101693 光界之核
  101692, 101693,
  // 103001-103008 奇卡卡
  103001, 103002, 103003, 103004, 103005, 103006, 103007, 103008,
  // 104201 嬗变之尘
  104201,
  // 105005 祝圣之霜、105006 启圣之尘
  105005, 105006,
  // 107009 脆弱树脂、107012 须臾树脂、107022 净光翎
  107009, 107012, 107022,
  // 113021 异梦溶媒
  113021,
  // 120858/120912/120914/121103/121105/121107 曜石断片
  120858, 120912, 120914, 121103, 121105, 121107,
  // 121279 蛋卷螺栓
  121279,
  // 220001/220002/220032/220057/220086/220103 共鸣石
  220001, 220002, 220032, 220057, 220086, 220103,
  // 220005 口袋锚点、220006 寻仙的美食家、220007 浓缩树脂、220017 放热瓶、220043 四方八方之网
  220005, 220006, 220007, 220017, 220043,
]);

export const KEEP_CONSUMABLE_NAMES: ReadonlySet<string> = new Set([
  // 当前 Metadata 中暂无对应条目，保留该名称以覆盖后续数据
  "消耗品",
]);

/**
 * 判断 Metadata 材料是否需要进入下载和转换流程。
 *
 * @param metadata Metadata 材料数据
 * @returns 是否需要处理
 */
export function shouldConvertMaterial(
  metadata: TGACore.Plugins.Hutao.Material.MaterialItem,
): boolean {
  if (IGNORE_TYPE_DESCRIPTIONS.has(metadata.TypeDescription)) return false;
  if (
    metadata.TypeDescription === "消耗品" &&
    !KEEP_CONSUMABLE_NAMES.has(metadata.Name) &&
    !KEEP_CONSUMABLE_IDS.has(metadata.Id)
  )
    return false;
  return true;
}
