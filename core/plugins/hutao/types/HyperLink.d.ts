/**
 * Hyperlink types
 * @since 2.5.0
 */

declare namespace TGACore.Plugins.Hutao.HyperLink {
  /**
   * 原始数据
   * @since 2.5.0
   */
  type RawHyperLinks = Array<HyperLink>;

  /**
   * Hyperlink
   * @since 2.5.0
   */
  type Hyperlink = {
    /** ID */
    Id: number;
    /** 名称 */
    Name: string;
    /** 描述 */
    Description: string;
  };
}
