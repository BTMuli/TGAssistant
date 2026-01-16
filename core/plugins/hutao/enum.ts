/**
 * 一些关于胡桃的枚举
 * @since 2.5.0
 */

/**
 * Github 文件类型枚举
 * @since 2.5.0
 */
export const HutaoGithubFileEnum: typeof TGACore.Plugins.Hutao.Base.GithubFileType = {
  Achievement: "Achievement.json",
  AchievementGoal: "AchievementGoal.json",
  Avatar: "Avatar/",
  Gacha: "GachaEvent.json",
  Meta: "Meta.json",
  HyperLink: "HyperLinkName.json",
  NameCard: "NameCard.json",
  Weapon: "Weapon.json",
  Material: "Material.json",
};

/**
 * @description 武器类型枚举
 * @since 2.4.0
 * @enum TGACore.Plugins.Hutao.Weapon.WeaponTypeEnum
 */
export const HutaoWeaponTypeEnum: typeof TGACore.Plugins.Hutao.Weapon.WeaponType = {
  sword: 1,
  catalyst: 10,
  claymore: 11,
  bow: 12,
  pole: 13,
};

/**
 * @description 传入武器枚举类，返回武器类型字符串
 * @since 2.4.0
 * @function getWeaponTypeString
 * @param {TGACore.Plugins.Hutao.Weapon.WeaponTypeEnum} type 武器类型枚举
 * @returns {string} 武器类型字符串
 */
export function getWeaponTypeString(type: TGACore.Plugins.Hutao.Weapon.WeaponTypeEnum): string {
  switch (type) {
    case HutaoWeaponTypeEnum.sword:
      return "单手剑";
    case HutaoWeaponTypeEnum.catalyst:
      return "法器";
    case HutaoWeaponTypeEnum.claymore:
      return "双手剑";
    case HutaoWeaponTypeEnum.bow:
      return "弓";
    case HutaoWeaponTypeEnum.pole:
      return "长柄武器";
    default:
      return "未知类型";
  }
}
