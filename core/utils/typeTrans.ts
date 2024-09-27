/**
 * @file core utils typeTrans.ts
 * @description 类型转换工具
 * @since 2.0.0
 */

/**
 * @description 将 hutao.json 的武器类型转换为所需的武器类型
 * @since 2.0.0
 * @param {TGACore.Plugins.Hutao.WeaponType} weaponType 武器类型
 * @return {TGACore.Constant.WeaponType} 武器类型
 */
export function getHutaoWeapon(
  weaponType: TGACore.Plugins.Hutao.WeaponType,
): TGACore.Constant.WeaponType {
  switch (weaponType) {
    case 12:
      return "弓";
    case 10:
      return "法器";
    case 11:
      return "双手剑";
    case 13:
      return "长柄武器";
    case 1:
      return "单手剑";
  }
}
