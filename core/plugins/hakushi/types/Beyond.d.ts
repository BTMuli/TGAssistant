/**
 * Hakushi 千星奇域类型
 * @since 2.5.0
 */
declare namespace TGACore.Plugins.Hakushi.Beyond {
  /**
   * 部件返回响应
   * @since 2.5.0
   */
  type CostumeResp = Record<string, CostumeInfo>;

  /**
   * 套装返回响应
   * @since 2.5.0
   */
  type SuitResp = Record<string, SuitInfo>;

  /**
   * 部件稀有度类型
   * @since 2.5.0
   */
  type BeyondRank = "Green" | "Blue" | "Purple" | "Orange";

  /**
   * 部件类型
   * @since 2.5.0
   */
  type BeyondBody = "BODY_GIRL" | "BODY_BOY";

  /**
   * 部件位置
   * @since 2.5.0
   * @remarks 待补充
   */
  type BeyondSlot = string;

  /**
   * 部件信息
   * @since 2.5.0
   */
  type CostumeInfo = {
    /** 名称 */
    Name: string;
    /** 稀有度 */
    Rank: BeyondRank;
    /** 图标 */
    Icon: string;
    /** 体型 */
    Body: Array<BeyondBody>;
    /** 颜色 */
    Color: Array<string>;
    /** 位置 */
    Slot: Array<BeyondSlot>;
  };

  /**
   * 套装信息
   * @since 2.5.0
   */
  type SuitInfo = {
    /** 名称 */
    Name: string;
    /** 稀有度 */
    Rank: BeyondRank;
    /** 图标 */
    Icon: string;
    /** 体型 */
    Body: Array<BeyondBody>;
    /** 颜色 */
    Color: Array<string>;
  };
}
