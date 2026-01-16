/**
 * 一些关于胡桃的基础类型声明
 * @since 2.5.0
 */

declare namespace TGACore.Plugins.Hutao.Base {
  /**
   * Github 文件路径类型
   * @since 2.5.0
   */
  const GithubFileType = <const>{
    /** 成就 */
    Achievement: "Achievement.json",
    /** 成就系列 */
    AchievementGoal: "AchievementGoal.json",
    /** 角色 */
    Avatar: "Avatar/",
    /** 祈愿历史 */
    Gacha: "GachaEvent.json",
    /** hyperlink */
    HyperLink: "HyperLinkName.json",
    /** 元数据 */
    Meta: "Meta.json",
    /** 名片 */
    NameCard: "NameCard.json",
    /** 武器 */
    Weapon: "Weapon.json",
    /** 材料 */
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
