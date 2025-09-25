/**
 * @file core/plugins/hutao/types/NameCard.d.ts
 * @description 胡桃名片数据类型声明文件
 * @since 2.4.0
 */

declare namespace TGACore.Plugins.Hutao.NameCard {
  /**
   * @description 名片数据返回JSON
   * @since 2.4.0
   * @interface RawNameCard
   */
  type RawNameCard = Array<NameCard>;

  /**
   * @description 名片数据
   * @since 2.4.0
   * @interface NameCard
   * @property {number} Id 名片ID
   * @property {number} RankLevel 名片星级
   * @property {string} ItemType 名片类型
   * @property {string} Name 名片名称
   * @property {string} Description 名片描述
   * @property {string} Icon 名片图标
   * @property {[string, string,string]} Pictures 名片图片列表，第2个是bg，第3个是profile
   */
  type NameCard = {
    Id: number;
    RankLevel: number;
    ItemType: string;
    Name: string;
    Description: string;
    Icon: string;
    Pictures: [string, string, string];
  };
}
