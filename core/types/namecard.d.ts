/**
 * @file core/types/namecard.d.ts
 * @description 名片类型声明文件
 * @since 2.0.0
 */

/**
 * @description 名片 namespace
 * @since 2.0.0
 * @namespace TGACore.Components.Namecard
 * @memberof TGACore.Components
 */
declare namespace TGACore.Components.Namecard {
  /**
   * @description 原始数据
   * @since 2.0.0
   * @memberof TGACore.Components.Namecard
   * @property {number} index 名片编号
   * @property {string} name 名片名称
   * @property {string} description 名片描述
   * @property {string} source 名片来源
   * @return RawData 原始数据
   */
  interface RawData {
    index: number;
    name: string;
    description: string;
    source: string;
  }

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
   * @since 2.0.0
   * @memberof TGACore.Components.Namecard
   * @property {string} name 名片名称
   * @property {number} index 名片编号
   * @property {number} type 名片类型 // 0-其他,1-成就,2-角色,3-纪行,4-活动
   * @property {string} desc 名片描述
   * @property {string} source 名片来源
   * @property {string} icon 图标
   * @property {string} bg 背景
   * @property {string} profile 大图
   * @return ConvertData 转换后的数据
   */
  interface ConvertData {
    name: string;
    index: number;
    type: NamecardType;
    desc: string;
    source: string;
    icon: string;
    bg: string;
    profile: string;
  }
}
