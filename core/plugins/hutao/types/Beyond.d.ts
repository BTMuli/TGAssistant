/**
 * 千星奇域类型
 * @since 2.5.0
 */

declare namespace TGACore.Plugins.Hutao.Beyond {
  /**
   * Metadata 数据
   * @since 2.5.0
   */
  type RawBeyondItem = Array<BeyondItem>;

  /**
   * 千星奇域物品数据
   * @since 2.5.0
   */
  type BeyondItem = {
    /** id */
    Id: number;
    /** 名称 */
    Name: string;
    /** 描述 */
    Description: string;
    /** 图标 */
    Icon?: string;
    /**
     * 类型
     * @remarks 枚举
     * @example
     * 2 - COSTUME_SUIT 装扮
     * 3 - COSTUME_DRAWING 部件形录
     * 5 - EMOJI 表情
     * 6 - POSE 动作
     * 7 - TRANSFER_EFFECT 特效
     */
    Type: number;
    /** 类型描述 */
    TypeDescription?: string;
    /** 星级 */
    RankLevel: number;
  };
}
