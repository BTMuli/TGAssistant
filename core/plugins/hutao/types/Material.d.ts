/**
 * @file core/plugins/hutao/types/Material.d.ts
 * @description 胡桃材料类型声明文件
 * @since 2.4.0
 */

declare namespace TGACore.Plugins.Hutao.Material {
  /**
   * @description 材料数据返回响应
   * @since 2.4.0
   * @interface RawMaterial
   */
  type RawMaterial = Array<Material>;

  /**
   * @description 材料数据
   * @since 2.4.0
   * @interface Material
   * @property {number} Rank 材料星级
   * @property {number} MaterialType 材料类型
   * @property {number} Id 材料编号
   * @property {number} RankLevel 材料星级
   * @property {number} ItemType 材料类型
   * @property {string} Name 材料名称
   * @property {string} Description 材料描述
   * @property {string} TypeDescription 材料类型描述
   * @property {string} Icon 材料图标
   */
  type Material = {
    Rank: number;
    MaterialType: number;
    Id: number;
    RankLevel: number;
    ItemType: number;
    Name: string;
    Description: string;
    TypeDescription: string;
    Icon: string;
  };
}
