/**
 * Yatta 插件圣遗物数据类型文件
 * @since 2.6.0
 */

declare namespace TGACore.Plugins.Yatta.Relic {
  /**
   * 圣遗物套装详情返回响应
   * @since 2.6.0
   */
  type RelicSetResp = TGACore.Plugins.Yatta.Base.Response<RelicSetRes>;

  /**
   * 圣遗物套装详情返回
   * @since 2.6.0
   */
  type RelicSetRes = {
    /** 套装 ID */
    id: number;
    /** 套装名称 */
    name: string;
    /** 套装星级 */
    levelList: Array<number>;
    /** 套装效果 */
    affixList: Record<string, string>;
    /** 套装图标 */
    icon: string;
    /** 路由 */
    route: string;
    /** 套装信息 */
    suit: Partial<RelicSuit>;
    /** 来源 */
    source: unknown;
  };

  /**
   * 套装信息
   * @since 2.6.0
   */
  type RelicSuit = {
    EQUIP_BRACER: RelicItem;
    EQUIP_NECKLACE: RelicItem;
    EQUIP_SHOES: RelicItem;
    EQUIP_RING: RelicItem;
    EQUIP_DRESS: RelicItem;
  };

  /**
   * 圣遗物信息
   * @since 2.6.0
   */
  type RelicItem = {
    /** 名称 */
    name: string;
    /** 描述 */
    description: string;
    /** 最大等级 */
    maxLevel: number;
    /** 图标 */
    icon: string;
  };

  /**
   * 存储于本地的圣遗物套装数据
   * @since 2.6.0
   */
  type LocalRelicSetList = Array<LocalRelicSet>;

  /**
   * 存储于本地的圣遗物套装
   * @since 2.6.0
   */
  type LocalRelicSet = RelicSetRes & { story: Record<string, string> };
}
