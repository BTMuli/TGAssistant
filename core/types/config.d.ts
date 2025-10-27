/**
 * 配置类型声明文件
 * @since 2.5.0
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
   * 应用数据目录配置文件类型枚举
   * @since 2.5.0
   */
  enum AppDataDirTypeEnum {
    /** 成就 */
    achievement,
    /** 素材日历 */
    calendar,
    /** 角色 */
    character,
    /** 祈愿 */
    gacha,
    /** 千星奇域祈愿 */
    gachaB,
    /** 材料 */
    material,
    /** 名片 */
    nameCard,
    /** 武器 */
    weapon,
    /** 维基 */
    wiki,
    /** 维基-角色 */
    wikiAvatar,
    /** 角色天赋 */
    talents,
    /** 角色命座 */
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
