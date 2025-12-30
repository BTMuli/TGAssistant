/**
 * 角色突破属性
 * @since 2.5.0
 */

declare namespace TGACore.Plugins.Hutao.AvatarPromote {
  /**
   * 完整信息
   * @since 2.5.0
   */
  type FullInfo = Array<PromoteItem>;

  /**
   * 单个突破项
   * @since Beta v0.2.5
   */
  type PromoteItem = {
    /** 突破编号 */
    Id: number;
    /** 等级 */
    Level: number;
    /** 属性改变值 */
    AddProperties: Array<TGACore.Plugins.Hutao.Base.Prop>;
  };
}
