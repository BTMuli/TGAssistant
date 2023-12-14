/**
 * @file core types weapon.d.ts
 * @description 武器组件类型定义
 * @since 2.0.0
 */

/**
 * @description 武器类型 namespace
 * @since 2.0.0
 * @namespace TGACore.Components.Weapon
 * @memberof TGACore.Components
 */
declare namespace TGACore.Components.Weapon {
  /**
   * @description 元数据-胡桃
   * @since 2.0.0
   * @memberof TGACore.Components.Weapon
   * @description RawHutaoItem => Rhi
   * @property {number} Id 角色编号
   * @property {number} PromoteId 未知
   * @property { TGACore.Plugins.Hutao.WeaponType} WeaponType 武器类型
   * @property {number} RankLevel 武器星级
   * @property {string} Name 武器名称
   * @property {string} Description 武器简介
   * @property {string} Icon 武器图标
   * @property {string} AwakenIcon 武器觉醒图标
   * @property {number} GrowCurves.InitValue 未知
   * @property {number} GrowCurves.Type 未知
   * @property {number} GrowCurves.Value 未知
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
    CultivationItems: number[];
  }

  /**
   * @description 转换后的武器数据
   * @since 2.0.0
   * @memberof TGACore.Components.Weapon
   * @interface ConvertData
   * @property {number} id 武器 id
   * @property {number} contentId 武器 contentId
   * @property {string} name 武器名称
   * @property {number} star 武器星级
   * @property {string} bg 武器背景
   * @property {string} weaponIcon 武器类型图标
   * @property {string} icon 武器图标
   * @return ConvertData
   */
  interface ConvertData {
    id: number;
    contentId: number;
    name: string;
    star: number;
    bg: string;
    weaponIcon: string;
    icon: string;
  }

  /**
   * @description 转换后的武器数据
   * @since 2.0.0
   * @interface WikiItem
   * @memberof TGACore.Components.Weapon
   * @todo 后续补充
   */
  type WikiItem = any;
}
