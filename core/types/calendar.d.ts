/**
 * @file core/types/calendar.d.ts
 * @description 日历组件类型定义
 * @since 2.4.0
 */

declare namespace TGACore.Components.Calendar {
  /**
   * @description 日历项基类
   * @since 2.4.0
   * @interface CalendarBase
   * @property {number} id 角色/武器 id
   * @property {number} contentId 角色/武器 观测枢 id
   * @property {Array<number>} dropDays 掉落日
   * @property {string} name 角色/武器 名称
   * @property {number} star 角色/武器 星级
   * @property {string} weapon 角色武器类型
   * @property {Array<Material>} materials 角色/武器 材料
   * @property {Source} source 角色/武器 来源
   */
  type CalendarBase = {
    id: number;
    contentId: number;
    dropDays: Array<number>;
    name: string;
    star: number;
    weapon: string;
    materials: Array<Material>;
    source: Source;
  };

  /**
   * @description 日历角色项
   * @since 2.4.0
   * @interface CalendarAvatar
   * @extends CalendarBase
   * @property {"character"} itemType 角色/武器 类型
   * @property {string} element 角色元素
   */
  type CalendarAvatar = CalendarBase & { itemType: "character"; element: string };

  /**
   * @description 日历武器项
   * @since 2.4.0
   * @interface CalendarWeapon
   * @extends CalendarBase
   * @property {"weapon"} itemType 角色/武器 类型
   */
  type CalendarWeapon = CalendarBase & { itemType: "weapon" };

  /**
   * @description 转换后的数据
   * @since 2.3.0
   * @interface CalendarItem
   */
  type CalendarItem = CalendarAvatar | CalendarWeapon;

  /**
   * @description 转换后的材料
   * @since 2.4.0
   * @interface Material
   * @property {number} id 材料 id
   * @property {string} name 材料名称
   * @property {number} star 材料星级
   */
  type Material = { id: number; name: string; star: number };

  /**
   * @description 转换后的来源
   * @since 2.4.0
   * @interface Source
   * @property {TGACore.Constant.NationIndex} index 国家索引
   * @property {TGACore.Constant.NationType} area 国家名称
   * @property {string} name 来源名称
   */
  type Source = { index: TGACore.Constant.NationIndex; area: string; name: string };
}
