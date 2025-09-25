/**
 * @file core/plugins/hutao/types/Gacha.d.ts
 * @description 胡桃卡池数据类型声明文件
 * @since 2.4.0
 */

declare namespace TGACore.Plugins.Hutao.Gacha {
  /**
   * @description 卡池数据返回JSON
   * @since 2.4.0
   * @interface RawGacha
   */
  type RawGacha = Array<Gacha>;

  /**
   * @description 卡池数据
   * @since 2.4.0
   * @interface Gacha
   * @property {string} Name 卡池名称
   * @property {string} Version 卡池版本
   * @property {number} Order 卡池排序
   * @property {string} Banner 卡池图片
   * @property {string} Banner2 卡池图片2
   * @property {string} From 卡池开始时间
   * @property {string} To 卡池结束时间
   * @property {number} Type 卡池类型
   * @property {Array<number>} UpOrangeList 5星UP角色/武器ID列表
   * @property {Array<number>} UpPurpleList 4星UP角色/武器ID列表
   */
  type Gacha = {
    Name: string;
    Version: string;
    Order: number;
    Banner: string;
    Banner2: string;
    From: string;
    To: string;
    Type: number;
    UpOrangeList: Array<number>;
    UpPurpleList: Array<number>;
  };
}
