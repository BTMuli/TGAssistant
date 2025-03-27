/**
 * @file core/types/namecard.d.ts
 * @description 名片类型声明文件
 * @since 2.3.0
 */

declare namespace TGACore.Components.Namecard {
  /**
   * @description 图片类型枚举
   * @since 2.0.0
   * @memberof TGACore.Components.Namecard
   * @enum {number} ImageType
   * @property {number} icon 图标
   * @property {number} bg 背景
   * @property {number} profile 大图
   * @return ImageTypeEnum 图片类型枚举
   */
  enum ImageTypeEnum {
    icon,
    bg,
    profile,
  }

  /**
   * @description 图片类型
   * @since 2.0.0
   * @memberof TGACore.Components.Namecard
   * @return ImageType 图片类型
   */
  type ImageType = keyof typeof ImageTypeEnum;

  /**
   * @description 转换后的数据
   * @since 2.3.0
   * @memberof TGACore.Components.Namecard
   * @property {number} id 编号
   * @property {string} name 名称
   * @property {string} type 类型
   * @property {string} desc 描述
   * @property {string} source 来源
   * @return ConvertData 转换后的数据
   */
  type ConvertData = {
    id: number;
    name: string;
    type: string;
    desc: string;
    source: string;
  };
}
