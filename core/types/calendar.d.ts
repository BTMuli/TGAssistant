/**
 * @file core types calendar.d.ts
 * @description 日历组件类型定义
 * @since 2.0.0
 */

/**
 * @description 日历组件 namespace
 * @since 2.0.0
 * @namespace TGACore.Components.Calendar
 * @memberof TGACore.Components
 */
declare namespace TGACore.Components.Calendar {
  /**
   * @description 元数据-Amber.top
   * @since 2.2.0
   * @memberof TGACore.Components.Calendar
   * @interface RawAmber
   * @property {number} response 返回码
   * @property {Record<keyof typeof TGACore.Constant.Week, Record<string,RawAmberItem>>} data 数据
   * @return RawAmber
   */
  interface RawAmber {
    response: number;
    data: Record<keyof typeof TGACore.Constant.Week, Record<string, RawAmberItem>>;
  }

  /**
   * @description 元数据-Amber.top-域
   * @since 2.0.0
   * @memberof TGACore.Components.Calendar
   * @interface RawAmberItem
   * @property {number} id 秘境 id
   * @property {string} name 秘境名称
   * @property {number[]} reward 掉落
   * @property {TGACore.Constant.NationIndex} city 所在城市
   * @return RawAmberItem
   */
  interface RawAmberItem {
    id: number;
    name: string;
    reward: number[];
    city: TGACore.Constant.NationIndex;
  }

  /**
   * @description 元数据-胡桃-材料
   * @since 2.0.0
   * @memberof TGACore.Components.Calendar
   * @interface RawHutaoMaterial
   * @property {number} MaterialType 材料类型
   * @property {number} Id 材料 id
   * @property {number} RankLevel 材料星级
   * @property {number} ItemType 材料类型
   * @property {string} Name 材料名称
   * @property {string} Description 材料描述
   * @property {string} TypeDescription 材料类型描述
   * @property {string} Icon 材料图标
   * @return RawHutaoMaterial
   */
  interface RawHutaoMaterial {
    MaterialType: number;
    Id: number;
    RankLevel: number;
    Name: string;
    Description: string;
    TypeDescription: string;
    Icon: string;
  }

  /**
   * @description 转换后的数据
   * @since 2.3.0
   * @memberof TGACore.Components.Calendar
   * @interface ConvertData
   * @property {number} id 角色/武器 id
   * @property {number} contentId 角色/武器 观测枢 id
   * @property {number[]} dropDays 掉落日
   * @property {string} name 角色/武器 名称
   * @property {ItemType} itemType 角色/武器 类型
   * @property {number} star 角色/武器 星级
   * @property {string} element 角色元素
   * @property {ConvertMaterial[]} materials 角色/武器 材料
   * @property {ConvertSource} source 角色/武器 来源
   * @return ConvertData
   */
  type ConvertData = {
    id: number;
    contentId: number;
    dropDays: number[];
    name: string;
    star: number;
    weapon: string;
    materials: ConvertMaterial[];
    source: ConvertSource;
  } & ({ itemType: "character"; element: string } | { itemType: "weapon" });

  /**
   * @description 转换后的材料
   * @since 2.3.0
   * @memberof TGACore.Components.Calendar
   * @interface ConvertMaterial
   * @property {number} id 材料 id
   * @property {string} name 材料名称
   * @property {number} star 材料星级
   * @return ConvertMaterial
   */
  type ConvertMaterial = { id: number; name: string; star: number };

  /**
   * @description 转换后的来源
   * @since 2.3.0
   * @memberof TGACore.Components.Calendar
   * @interface ConvertSource
   * @property {TGACore.Constant.NationIndex} index 国家索引
   * @property {TGACore.Constant.NationType} area 国家名称
   * @property {string} name 来源名称
   * @return ConvertSource
   */
  type ConvertSource = { index: TGACore.Constant.NationIndex; area: string; name: string };
}
