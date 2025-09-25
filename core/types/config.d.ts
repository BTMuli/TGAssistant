/**
 * @file core/types/config.d.ts
 * @description 配置类型声明文件
 * @since 2.4.0
 */

declare namespace TGACore.Config {
  /**
   * @description 应用数据目录类型枚举
   * @since 2.0.0
   * @memberof TGACore.Config
   * @enum {number}
   * @readonly
   * @property {number} data 应用数据目录类型
   * @property {number} assets 应用资源目录类型
   * @property {number} temp 应用临时目录类型
   * @return AppDirTypeEnum 应用数据目录类型枚举
   */
  enum AppDirTypeEnum {
    data,
    assets,
    temp,
  }

  /**
   * @description 应用数据目录类型
   * @since 2.0.0
   * @interface AppDirType
   */
  type AppDirType = keyof typeof AppDirTypeEnum;

  /**
   * @description 应用数据目录配置文件类型枚举
   * @since 2.2.0
   * @enum {number}
   * @property {number} achievement 成就数据目录
   * @property {number} calendar 日历数据目录
   * @property {number} character 角色数据目录
   * @property {number} gacha 抽卡数据目录
   * @property {number} material 材料数据目录
   * @property {number} nameCard 名片数据目录
   * @property {number} weapon 武器数据目录
   * @property {number} wiki wiki数据目录
   * @property {number} wikiAvatar 角色wiki数据目录
   * @property {number} talents 角色天赋数据目录
   * @property {number} constellations 角色命座数据目录
   */
  enum AppDataDirTypeEnum {
    achievement,
    calendar,
    character,
    gacha,
    material,
    nameCard,
    weapon,
    wiki,
    wikiAvatar,
    talents,
    constellations,
  }

  /**
   * @description 应用数据目录配置文件类型
   * @since 2.0.0
   * @interface AppDataDirType
   */
  type AppDataDirType = keyof typeof AppDataDirTypeEnum;

  /**
   * @description 基本数据目录类型
   * @since 2.0.0
   * @interface BaseDirType
   * @property {string} src 源数据目录
   * @property {string} out 输出数据目录
   * @property {string} http http 数据目录
   */
  type BaseDirType = { src: string; out: string; http?: string };
}
