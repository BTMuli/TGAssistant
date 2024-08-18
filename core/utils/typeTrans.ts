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
    case TGACore.Plugins.Hutao.WeaponType.bow:
      return TGACore.Constant.WeaponType.bow;
    case TGACore.Plugins.Hutao.WeaponType.catalyst:
      return TGACore.Constant.WeaponType.catalyst;
    case TGACore.Plugins.Hutao.WeaponType.claymore:
      return TGACore.Constant.WeaponType.claymore;
    case TGACore.Plugins.Hutao.WeaponType.pole:
      return TGACore.Constant.WeaponType.pole;
    case TGACore.Plugins.Hutao.WeaponType.sword:
      return TGACore.Constant.WeaponType.sword;
  }
}
