/**
 * 材料类型声明文件
 * @since 2.4.0
 */

declare namespace TGACore.Plugins.Hutao.Material {
  /**
   * 材料数据
   * @since 2.4.0
   */
  type FullInfo = Array<MaterialItem>;

  /**
   * 材料数据
   * @since 2.4.0
   */
  type MaterialItem = {
    /** 分组 */
    Rank: number;
    /**
     * 类型
     * @remarks 枚举类
     */
    MaterialType: number;
    /** 效果 */
    EffectDescription?: string;
    /** ID */
    Id: number;
    /** 星级 */
    RankLevel: number;
    /**
     * 材料类型
     * @remarks 枚举类
     */
    ItemType: number;
    /** 名称 */
    Name: string;
    /** 描述 */
    Description: string;
    /** 类型描述 */
    TypeDescription: string;
    /**
     * 图标
     * @remarks ItemIcon/
     */
    Icon: string;
  };
}
