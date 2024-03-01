/**
 * @file core/types/gacha.d.ts
 * @description 祈愿类型声明文件
 * @since 2.1.0
 */

/**
 * @description 祈愿 namespace
 * @since 2.1.0
 * @namespace TGACore.Components.Gacha
 * @memberof TGACore.Components
 */
declare namespace TGACore.Components.Gacha {
  /**
   * @description 祈愿类型枚举
   * @since 2.1.0
   * @memberof TGACore.Components.Gacha
   * @enum {number}
   * @property {number} Newbie 新手祈愿 = 100
   * @property {number} Normal 常驻祈愿 = 200
   * @property {number} CharacterUp 角色活动祈愿 = 301
   * @property {number} CharacterUp2 角色活动祈愿2 = 400
   * @property {number} WeaponUp 武器活动祈愿 = 302
   * @property {number} MixUp 集录祈愿 = 500
   * @return GachaType
   */
  const enum GachaType {
    Newbie = 100,
    Normal = 200,
    CharacterUp = 301,
    CharacterUp2 = 400,
    WeaponUp = 302,
    MixUp = 500,
  }

  /**
   * @description 祈愿元数据类型-胡桃
   * @since 2.1.0
   * @memberof TGACore.Components.Gacha
   * @return RawHutao
   */
  type RawHutao = RawHutaoItem[];

  /**
   * @description 祈愿元数据类型-胡桃-祈愿项
   * @since 2.1.0
   * @memberof TGACore.Components.Gacha
   * @property {string} Name 卡池名称
   * @property {string} Version 卡池版本
   * @property {number} Order 卡池排序
   * @property {string} Banner 卡池横幅
   * @property {string} Banner2 卡池横幅2
   * @property {string} From 卡池开始时间 yyyy-MM-ddTHH:mm:ss+08:00
   * @property {string} To 卡池结束时间 yyyy-MM-ddTHH:mm:ss+08:00
   * @property {GachaType} Type 卡池类型
   * @property {number[]} UpOrangeList up五星
   * @property {number[]} UpPurpleList up四星
   * @return RawHutaoItem
   */
  interface RawHutaoItem {
    Name: string;
    Version: string;
    Order: number;
    Banner: string;
    Banner2: string;
    From: string;
    To: string;
    Type: GachaType;
    UpOrangeList: number[];
    UpPurpleList: number[];
  }

  /**
   * @description 转换后的祈愿数据
   * @since 2.1.0
   * @memberof TGACore.Components.Gacha
   * @property {string} name 卡池名称
   * @property {string} version 卡池版本
   * @property {number} order 卡池排序
   * @property {string} banner 卡池横幅
   * @property {string} from 卡池开始时间 yyyy-MM-ddTHH:mm:ss+08:00
   * @property {string} to 卡池结束时间 yyyy-MM-ddTHH:mm:ss+08:00
   * @property {GachaType} type 卡池类型
   * @property {number[]} up5List up五星
   * @property {number[]} up4List up四星
   * @return ConvertHutaoItem 转换后的祈愿数据
   */
  interface ConvertItem {
    name: string;
    version: string;
    order: number;
    banner: string;
    from: string;
    to: string;
    type: GachaType;
    up5List: number[];
    up4List: number[];
  }
}
