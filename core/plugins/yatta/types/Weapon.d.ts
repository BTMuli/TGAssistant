/**
 * @file core/plugins/yatta/types/Weapon.d.ts
 * @description Yatta 武器类型声明文件
 * @since 2.4.0
 */
declare namespace TGACore.Plugins.Yatta.Weapon {
  /**
   * @description 武器数据返回响应
   * @since 2.4.0
   * @interface WeaponResponse
   * @extends TGACore.Plugins.Yatta.Base.Response2
   */
  type WeaponResponse = TGACore.Plugins.Yatta.Base.Response2<
    WeaponItem,
    Record<string, string>,
    Record<string, string>
  >;

  /**
   * @description 武器阅读物返回响应
   * @since 2.4.0
   * @interface WeaponReadResponse
   * @extends TGACore.Plugins.Yatta.Base.Response
   */
  type WeaponReadResponse = TGACore.Plugins.Yatta.Base.Response<string>;

  /**
   * @description 武器详细数据返回响应
   * @since 2.4.0
   * @interface WeaponDetailResponse
   * @extends TGACore.Plugins.Yatta.Base.Response<WeaponDetail>
   */
  type WeaponDetailResponse = TGACore.Plugins.Yatta.Base.Response<WeaponDetail>;

  /**
   * @description 存储于本地的武器数据
   * @since 2.4.0
   * @interface LocalWeaponList
   */
  type LocalWeaponList = Array<LocalWeapon>;

  /**
   * @description 存储于本地的武器数据项
   * @since 2.4.0
   * @interface LocalWeapon
   * @extends WeaponDetail
   * @property {Array<string>} story 武器故事
   */
  type LocalWeapon = WeaponDetail & { story: Array<string> };

  /**
   * @description 武器类型
   * @since 2.4.0
   * @interface WeaponType
   * @property {string} WEAPON_SWORD_ONE_HAND 单手剑
   * @property {string} WEAPON_CATALYST 法器
   * @property {string} WEAPON_CLAYMORE 双手剑
   * @property {string} WEAPON_BOW 弓
   * @property {string} WEAPON_POLE 长柄武器
   */
  const WeaponType = <const>{
    WEAPON_SWORD_ONE_HAND: "单手剑",
    WEAPON_CATALYST: "法器",
    WEAPON_CLAYMORE: "双手剑",
    WEAPON_BOW: "弓",
    WEAPON_POLE: "长柄武器",
  };

  /**
   * @description 武器类型Key
   * @since 2.4.0
   * @interface WeaponTypeKey
   */
  type WeaponTypeKey = keyof typeof WeaponType;

  /**
   * @description 武器项
   * @since 2.4.0
   * @interface WeaponItem
   * @extends TGACore.Plugins.Yatta.Base.ResItem
   * @property {number} rank 武器星级
   * @property {WeaponTypeKey} type 武器类型
   * @property {string} specialProp 武器特殊属性
   */
  type WeaponItem = TGACore.Plugins.Yatta.Base.ResItem & {
    rank: number;
    type: WeaponTypeKey;
    specialProp: string;
  };

  /**
   * @description 武器详细数据
   * @since 2.4.0
   * @interface WeaponDetail
   * @property {number} id 武器编号
   * @property {number} rank 武器星级
   * @property {string} type 武器类型
   * @property {string} name 武器名称
   * @property {string} description 武器描述
   * @property {string} specialProp 武器特殊属性
   * @property {string} icon 武器图标
   * @property {Array<string>} storyId 武器故事编号
   * @property {Record<string,Affix>} affix 武器词条
   * @property {string} route 路由
   * @property {Upgrade} upgrade 武器升级属性
   * @property {Record<string,number>} ascension 武器突破属性
   * @property {Record<string,WeaponMaterial>} items 武器养成材料
   */
  type WeaponDetail = {
    id: number;
    rank: number;
    type: string;
    name: string;
    description: string;
    specialProp: string;
    icon: string;
    storyId: Array<string>;
    affix: Record<string, Affix>;
    route: string;
    upgrade: Upgrade;
    ascension: Record<string, number>;
    items: Record<string, WeaponMaterial>;
  };

  /**
   * @description 武器精炼效果
   * @since 2.4.0
   * @interface Affix
   * @property {string} name 精炼名称
   * @property {Record<string,string>} upgrade 精炼效果
   */
  type Affix = { name: string; upgrade: Record<string, string> };

  /**
   * @description 武器升级属性
   * @since 2.4.0
   * @interface Upgrade
   * @property {Array<number>} awakenCost 武器精炼消耗
   * @property {Array<UpgradeProp>} prop 武器属性
   * @property {Array<UpgradePromote>} promote 武器突破
   */
  type Upgrade = {
    awakenCost: Array<number>;
    prop: Array<UpgradeProp>;
    promote: Array<UpgradePromote>;
  };

  /**
   * @description 武器升级属性-属性
   * @since 2.4.0
   * @interface UpgradeProp
   * @todo 目前没使用，用unknown占位
   */
  type UpgradeProp = unknown;

  /**
   * @description 武器升级属性-突破
   * @since 2.4.0
   * @interface UpgradePromote
   * @todo 目前没使用，用unknown占位
   */
  type UpgradePromote = unknown;

  /**
   * @description 武器养成材料
   * @since 2.4.0
   * @interface WeaponMaterial
   * @property {string} name 材料名称
   * @property {number} rank 材料星级
   * @property {string} icon 材料图标
   */
  type WeaponMaterial = {
    name: string;
    rank: number;
    icon: string;
  };
}
