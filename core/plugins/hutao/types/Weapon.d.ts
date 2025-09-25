/**
 * @file core/plugins/hutao/types/Weapon.d.ts
 * @description 胡桃武器类型声明文件
 * @since 2.3.0
 */

declare namespace TGACore.Plugins.Hutao.Weapon {
  /**
   * @description 武器数据返回JSON
   * @since 2.4.0
   * @interface RawWeapon
   */
  type RawWeapon = Array<Weapon>;

  /**
   * @description 武器类型枚举
   * @since 2.4.0
   * @const WeaponType
   * @property {number} sword 单手剑 = 1
   * @property {number} catalyst 法器 = 10
   * @property {number} claymore 双手剑 = 11
   * @property {number} bow 弓 = 12
   * @property {number} pole 长柄武器 = 13
   */
  const WeaponType = <const>{
    sword: 1,
    catalyst: 10,
    claymore: 11,
    bow: 12,
    pole: 13,
  };

  /**
   * @description 武器类型枚举
   * @since 2.4.0
   * @interface WeaponTypeEnum
   */
  type WeaponTypeEnum = (typeof WeaponType)[keyof typeof WeaponType];

  /**
   * @description 武器数据
   * @since 2.4.0
   * @interface Weapon
   * @property {number} Id 武器编号
   * @property {number} PromoteId 武器突破编号
   * @property {number} Sort 排序
   * @property {WeaponType} WeaponType 武器类型
   * @property {number} RankLevel 武器星级
   * @property {string} Name 武器名称
   * @property {string} Description 武器描述
   * @property {string} Icon 武器图标
   * @property {string} AwakenIcon 武器精炼图标
   * @property {Array<GrowCurves>} GrowCurves 武器成长曲线
   * @property {WeaponAffix} [Affix] 武器副属性
   * @property {Array<number>} CultivationItems 武器养成材料
   */
  type Weapon = {
    Id: number;
    PromoteId: number;
    Sort: number;
    WeaponType: WeaponTypeEnum;
    RankLevel: number;
    Name: string;
    Description: string;
    Icon: string;
    AwakenIcon: string;
    GrowCurves: Array<GrowCurves>;
    Affix?: WeaponAffix;
    CultivationItems: Array<number>;
  };

  /**
   * @description 武器成长曲线
   * @since 2.4.0
   * @interface GrowCurves
   * @property {number} InitValue 初始值
   * @property {number} Type 成长曲线类型
   * @property {number} Value 成长曲线数值
   */
  type GrowCurves = { InitValue: number; Type: number; Value: number };

  /**
   * @description 武器副属性
   * @since 2.4.0
   * @interface WeaponAffix
   * @property {string} Name 副属性名称
   * @property {Array<AffixDesc>} Descriptions 副属性描述
   */
  type WeaponAffix = { Name: string; Descriptions: Array<AffixDesc> };

  /**
   * @description 武器副属性描述
   * @since 2.4.0
   * @interface AffixDesc
   * @property {number} Level 副属性等级
   * @property {string} Description 副属性描述
   */
  type AffixDesc = { Level: number; Description: string };
}
