/**
 * @file core/plugins/yatta/types/Avatar.d.ts
 * @description Yatta 角色类型声明文件
 * @since 2.4.0
 */
declare namespace TGACore.Plugins.Yatta.Avatar {
  /**
   * @description Yatta 角色数据返回响应
   * @since 2.4.0
   * @interface AvatarResponse
   * @extends TGACore.Plugins.Yatta.Base.Response2
   */
  type AvatarResponse = TGACore.Plugins.Yatta.Base.Response2<
    AvatarItem,
    Record<string, string>,
    Record<string, string>
  >;

  /**
   * @description Yatta 角色数据项
   * @since 2.4.0
   * @interface AvatarItem
   * @extends TGACore.Plugins.Yatta.Base.ResItem
   * @property {number} rank 角色星级
   * @property {string} element 角色元素类型
   * @property {TGACore.Plugins.Yatta.Weapon.WeaponTypeKey} weaponType 角色武器类型
   * @property {string} region 角色所属地区
   * @property {string} specialProp 角色特殊属性
   * @property {string} bodyType 角色身体类型
   * @property {[number, number]} birthday 角色生日，格式为 [月, 日]
   * @property {number} release 角色上线时间戳（秒）
   */
  type AvatarItem = TGACore.Plugins.Yatta.Base.ResItem & {
    rank: number;
    element: string;
    weaponType: TGACore.Plugins.Yatta.Weapon.WeaponTypeKey;
    region: string;
    specialProp: string;
    bodyType: string;
    birthday: [number, number];
    release: number;
  };
}
