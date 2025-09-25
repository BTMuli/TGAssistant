/**
 * @file core/types/weapon.d.ts
 * @description 武器组件类型定义
 * @since 2.3.0
 */

declare namespace TGACore.Components.Weapon {
  /**
   * @description 元数据-胡桃
   * @since 2.0.1
   * @memberof TGACore.Components.Weapon
   * @description RawHutaoItem => Rhi
   * @property {number} Id 角色编号
   * @property {number} PromoteId 未知
   * @property {TGACore.Plugins.Hutao.WeaponType} WeaponType 武器类型
   * @property {number} RankLevel 武器星级
   * @property {string} Name 武器名称
   * @property {string} Description 武器简介
   * @property {string} Icon 武器图标
   * @property {string} AwakenIcon 武器觉醒图标
   * @property {number} GrowCurves.InitValue 未知
   * @property {number} GrowCurves.Type 未知
   * @property {number} GrowCurves.Value 未知
   * @property {RhiAffix} Affix 精炼描述
   * @property {number[]} CultivationItems 武器培养材料
   * @return RawHutaoItem
   */
  interface RawHutaoItem {
    Id: number;
    PromoteId: number;
    WeaponType: TGACore.Plugins.Hutao.WeaponType;
    RankLevel: number;
    Name: string;
    Description: string;
    Icon: string;
    AwakenIcon: string;
    GrowCurves: {
      InitValue: number;
      Type: number;
      Value: number;
    };
    Affix?: RhiAffix;
    CultivationItems: number[];
  }

  /**
   * @description 转换后的武器数据
   * @since 2.4.0
   * @interface Weapon
   * @property {number} id 武器 id
   * @property {number} contentId 武器 contentId
   * @property {string} name 武器名称
   * @property {number} star 武器星级
   * @property {string} weapon 武器类型
   */
  type Weapon = {
    id: number;
    contentId: number;
    name: string;
    star: number;
    weapon: string;
  };

  /**
   * @description 转换后的武器数据
   * @since 2.4.0
   * @interface WikiItem
   * @property {number} id 武器 id
   * @property {string} name 武器名称
   * @property {string} description 武器简介
   * @property {number} star 武器星级
   * @property {string} weapon 武器类型
   * @property {TGACore.Components.Calendar.Material[]} materials 武器材料
   * @property {TGACore.Plugins.Hutao.Weapon.WeaponAffix} affix 精炼描述
   * @property {Array<string>} story 武器故事
   */
  type WikiItem = {
    id: number;
    name: string;
    description: string;
    star: number;
    weapon: string;
    materials: Array<TGACore.Components.Calendar.Material>;
    affix?: TGACore.Plugins.Hutao.Weapon.WeaponAffix;
    story: string[];
  };
}
