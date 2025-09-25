/**
 * @file core/plugins/yatta/types/NameCard.d.ts
 * @description yatta 名片数据类型声明文件
 * @since 2.4.0
 */

declare namespace TGACore.Plugins.Yatta.NameCard {
  /**
   * @description 名片详情返回数据
   * @since 2.4.0
   * @interface DetailResponse
   * @extends TGACore.Plugins.Yatta.Base.Response
   */
  type DetailResponse = TGACore.Plugins.Yatta.Base.Response<NameCardDetail>;

  /**
   * @description 名片详情
   * @since 2.4.0
   * @interface NameCardDetail
   * @property {string} description 名片描述
   * @property {string} descriptionSpecial 名片特殊描述
   * @property {string} icon 名片图标
   * @property {number} id 名片 id
   * @property {string} name 名片名称
   * @property {number} rank 名片星级
   * @property {string} route 名片边框
   * @property {string|null} source 名片获取途径
   * @property {string} type 名片类型
   */
  type NameCardDetail = {
    description: string;
    descriptionSpecial: string;
    icon: string;
    id: number;
    name: string;
    rank: number;
    route: string;
    source: string | null;
    type: string;
  };
}
