/**
 * @file core/plugins/hutao/types/base.d.ts
 * @description 一些关于胡桃的基础类型声明
 * @since 2.4.0
 */

declare namespace TGACore.Plugins.Hutao.Base {
  /**
   * @description Github 文件路径类型
   * @since 2.4.0
   * @const GithubFileType
   * @enum {string}
   * @property {string} Achievement 成就
   * @property {string} AchievementGoal 成就系列
   * @property {string} Avatar 角色
   * @property {string} Gacha 祈愿
   * @property {string} NameCard 名片
   * @property {string} Material 材料
   * @property {string} Meta 元数据
   * @property {string} Weapon 武器
   */
  const GithubFileType = <const>{
    Achievement: "Achievement.json",
    AchievementGoal: "AchievementGoal.json",
    Avatar: "Avatar/",
    Gacha: "GachaEvent.json",
    NameCard: "NameCard.json",
    Meta: "Meta.json",
    Weapon: "Weapon.json",
    Material: "Material.json",
  };

  /**
   * @description Github 文件路径类型 key
   * @since 2.4.0
   * @interface GithubFileTypeEnum
   */
  type GithubFileTypeEnum = (typeof GithubFileType)[keyof typeof GithubFileType];

  /**
   * @description Avatar 文件路径类型
   * @since 2.4.0
   * @interface AvatarFileType
   */
  type AvatarFileType = typeof GithubFileType.Avatar;

  /**
   * @description 移除 Avatar 后的单文件类型
   * @since 2.4.0
   * @interface SingleFileType
   */
  type SingleFileType = Exclude<GithubFileTypeEnum, AvatarFileType>;

  /**
   * 属性
   * @since 2.5.0
   */
  type Prop = {
    /** 类型 */
    Type: number;
    /** 值 */
    Value: number;
  };
}
