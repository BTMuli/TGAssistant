/**
 * 圣遗物类型声明文件
 * @since 2.6.0
 */

declare namespace TGACore.Plugins.Hutao.Relic {
  /**
   * 圣遗物套装JSON
   * @since 2.6.0
   */
  type RawSet = Array<RelicSetFull>;

  /**
   * 圣遗物主属性LvJSON
   * @since 2.6.0
   */
  type RawMainLv = Array<MainLv>;

  /**
   * 圣遗物主属性JSON
   * @since 2.6.0
   */
  type RawMain = Array<MainProp>;

  /**
   * 圣遗物副属性JSON
   * @since 2.6.0
   */
  type RawSub = Array<SubProp>;

  /**
   * 圣遗物套装文件类型
   * @since 2.6.0
   */
  type RelicSetFull = {
    /** 套装ID */
    SetId: number;
    /** 装备ID */
    EquipAffixId: number;
    /** 激活效果ID列表 */
    EquipAffixIds: Array<string>;
    /** 所需数量 */
    NeedNumber: Array<number>;
    /** 套装名称 */
    Name: string;
    /** 套装图标 */
    Icon: string;
    /** 效果描述 */
    Descriptions: Array<string>;
  };

  /**
   * 圣遗物文件类型
   * @since 2.6.0
   */
  type RelicFull = {
    /** 套装对应圣遗物ID列表 */
    Ids: Array<number>;
    /** 星级 */
    RankLevel: number;
    /** 套装ID */
    SetId: number;
    /**
     * 装备类型
     * @todo 枚举值
     */
    EquipType: number;
    /**
     * 物品类型
     * @todo 枚举值
     */
    ItemType: number;
    /** 套装名称 */
    Name: string;
    /** 套装描述 */
    Description: string;
    /** 套装图标 */
    Icon: string;
  };

  /**
   * 单项MainLv
   * @since 2.6.0
   */
  type MainLv = {
    /** 星级 */
    Rank: number;
    /** 等级 */
    Level: number;
    /** 属性 */
    Properties: Array<TGACore.Plugins.Hutao.Base.Prop>;
  };

  /**
   * 单项主属性
   * @since 2.6.0
   */
  type MainProp = {
    /** 属性ID */
    Id: number;
    /** 类型 */
    Type: number;
  };

  /**
   * 单项副属性
   * @since 2.6.0
   */
  type SubProp = TGACore.Plugins.Hutao.Base.Prop & {
    /** 副词条ID */
    Id: number;
  };
}
