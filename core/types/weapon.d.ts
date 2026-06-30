/**
 * 武器组件类型定义
 * @since 2.6.0
 */

declare namespace TGACore.Components.Weapon {
  /**
   * 转换后的武器简略数据
   * @since 2.4.0
   */
  type Weapon = {
    /** 武器ID */
    id: number;
    /** 武器内容ID */
    contentId: number;
    /** 名称 */
    name: string;
    /* 星级 */
    star: number;
    /** 类型 */
    weapon: string;
  };

  /**
   * 转换后的武器WIKI数据
   * @since 2.4.0
   */
  type WikiItem = {
    /** 武器ID */
    id: number;
    /** 武器名称 */
    name: string;
    /** 武器描述 */
    description: string;
    /** 武器星级 */
    star: number;
    /** 武器类型 */
    weapon: string;
    /** 养成材料 */
    materials: Array<TGACore.Components.Calendar.Material>;
    /** 精炼描述 */
    affix?: TGACore.Plugins.Hutao.Weapon.WeaponAffix;
    /** 初始词条(1精1级) */
    curves: Array<InitCurve>;
    /** 武器故事 */
    story: string[];
  };

  /**
   * 初始词条
   * @since 2.6.0
   */
  type InitCurve = {
    /** 词条类型 */
    curve: number;
    /** 属性类型 */
    prop: number;
    /** 初始值 */
    val: number;
  };

  /**
   * 转换后的武器突破文件
   * @since 2.6.0
   */
  type WeaponPromote = Record<number, PromoteItem>;

  /**
   * 单个武器突破
   * @since 2.6.0
   */
  type PromoteItem = Record<number, Array<PropItem>>;

  /**
   * Prop项
   * @since 2.6.0
   */
  type PropItem = {
    /** 添加的属性值 */
    addVal: number;
    /** 属性类型 */
    type: number;
  };

  /**
   * 转换后的武器升级文件
   * @since 2.6.0
   */
  type WeaponCurve = Record<number, Array<PropItem>>;
}
