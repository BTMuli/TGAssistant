/**
 * @file core types config.d.ts
 * @description 配置类型声明文件
 * @since 2.0.0
 */

/**
 * @description 配置 namespace
 * @since 2.0.0
 * @namespace TGACore.Config
 * @memberof TGACore
 */
declare namespace TGACore.Config {
  /**
   * @description 配置文件类型枚举
   * @since 2.0.0
   * @memberof TGACore.Config
   * @enum {string}
   * @readonly
   * @property {string} Constant 常量配置文件类型
   * @property {string} Github Github 配置文件类型
   * @property {string} Material 材料配置文件类型
   * @return ConfigFileEnum 配置文件类型枚举
   */
  const enum ConfigFileEnum {
    Constant = "constant",
    Github = "github",
    Material = "material",
  }

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
   * @memberof TGACore.Config
   * @return AppDirType 应用数据目录类型
   */
  type AppDirType = keyof typeof AppDirTypeEnum;

  /**
   * @description 应用数据目录配置文件类型枚举
   * @since 2.0.0
   * @memberof TGACore.Config
   * @enum {number}
   * @property {number} achievement 成就数据目录
   * @property {number} calendar 日历数据目录
   * @property {number} character 角色数据目录
   * @property {number} gcg 卡牌图鉴数据目录
   * @property {number} material 材料数据目录
   * @property {number} namecard 名片数据目录
   * @property {number} weapon 武器数据目录
   * @property {number} wiki wiki数据目录
   * @return AppDataDirTypeEnum 应用数据目录配置文件类型枚举
   */
  enum AppDataDirTypeEnum {
    achievement,
    calendar,
    character,
    gcg,
    material,
    namecard,
    weapon,
    wiki,
  }

  /**
   * @description 应用数据目录配置文件类型
   * @since 2.0.0
   * @memberof TGACore.Config
   * @return AppDataDirType 应用数据目录配置文件类型
   */
  type AppDataDirType = keyof typeof AppDataDirTypeEnum;

  /**
   * @description 基本数据目录类型
   * @since 2.0.0
   * @memberof TGACore.Config
   * @property {string} src 源数据目录
   * @property {string} out 输出数据目录
   * @property {string} http http 数据目录
   * @return BaseDirType 基本数据目录类型
   */
  interface BaseDirType {
    src: string;
    out: string;
    http?: string;
  }

  /**
   * @description Constant 配置文件类型
   * @since 2.0.0
   * @memberof TGACore.Config
   * @property {string} amber.version Amber 版本号
   * @property {string} honeyhunter.url HoneyHunter 数据源地址
   * @property {string} honeyhunter.namecard.prefix.old HoneyHunter 旧版名片前缀
   * @property {string} honeyhunter.namecard.prefix.new HoneyHunter 新版名片前缀
   * @property {string} honeyhunter.namecard.suffix.icon HoneyHunter 名片图标后缀
   * @property {string} honeyhunter.namecard.suffix.bg HoneyHunter 名片背景后缀
   * @property {string} honeyhunter.namecard.suffix.profile HoneyHunter 名片大图后缀
   * @property {number} honeyhunter.namecard.endIndex HoneyHunter 名片结束索引
   * @return ConstantConfig Constant 配置文件类型
   */
  interface ConstantConfig {
    amber: {
      version: string;
    };
    honeyhunter: {
      url: string;
      namecard: {
        prefix: {
          old: string;
          new: string;
        };
        suffix: {
          icon: string;
          bg: string;
          profile: string;
        };
        endIndex: number;
      };
    };
  }

  /**
   * @description Snap.Metadata 所需文件枚举类型
   * @since 2.0.0
   * @memberof TGACore.Config
   * @enum {number}
   * @readonly
   * @property {number} Achievement 成就数据文件
   * @property {number} AchievementGoal 成就系列数据文件
   * @property {number} Avatar 角色数据文件
   * @property {number} Meta 元数据文件，用于校验数据更新
   * @property {number} Weapon 武器数据文件
   * @property {number} Material 材料数据文件
   * @return GithubFileEnum Snap.Metadata 所需文件枚举类型
   */
  const enum GithubFileEnum {
    Achievement,
    AchievementGoal,
    Avatar,
    Meta,
    Weapon,
    Material,
  }

  /**
   * @description Snap.Metadata 所需文件类型
   * @since 2.0.0
   * @memberof TGACore.Config
   * @return GithubFile Snap.Metadata 所需文件类型
   */
  type GithubFile = keyof typeof GithubFileEnum;

  /**
   * @description Github 配置文件通用类型
   * @since 2.0.0
   * @memberof TGACore.Config
   * @property {string} repo 仓库
   * @property {string} base 基础路径
   * @property {string} branch 分支
   * @property {Record<GithubFile, string>} include 包含文件
   * @return GithubRepoConfig Github 配置文件通用类型
   */
  interface GithubRepoConfig {
    repo: string;
    base: string;
    branch: string;
    include: Record<GithubFile, string>;
  }

  /**
   * @description Github 配置文件类型
   * @since 2.0.0
   * @memberof TGACore.Config
   * @property {GithubRepoConfig} snap Snap 配置文件类型
   * @property {GithubRepoConfig} paimon Paimon 配置文件类型
   * @return GithubConfig Github 配置文件类型
   */
  interface GithubConfig {
    snap: GithubRepoConfig;
    paimon: GithubRepoConfig;
  }

  /**
   * @description 材料配置文件类型
   * @since 2.0.0
   * @memberof TGACore.Config
   * @property {number[]} material 材料配置文件
   * @return MaterialConfig 材料配置文件类型
   */
  interface MaterialConfig {
    material: number[];
  }
}
