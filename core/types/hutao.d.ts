/**
 * @file core types hutao.d.ts
 * @description 胡桃类型定义
 * @since 2.0.0
 */

/**
 * @description 胡桃插件 namespace
 * @since 2.0.0
 * @namespace TGACore.Plugins.Hutao
 * @memberof TGACore.Plugins
 */
declare namespace TGACore.Plugins.Hutao {
  /**
   * @description 武器类型枚举
   * @since 2.0.0
   * @memberof TGACore.Plugins.Hutao
   * @enum {number}
   * @property {number} sword 单手剑 = 1
   * @property {number} catalyst 法器 = 10
   * @property {number} claymore 双手剑 = 11
   * @property {number} bow 弓 = 12
   * @property {number} pole 长柄武器 = 13
   * @return WeaponType
   */
  const enum WeaponType {
    sword = 1,
    catalyst = 10,
    claymore = 11,
    bow = 12,
    pole = 13,
  }

  /**
   * @description 材料类型
   * @since 2.0.0
   * @property {number} MaterialType - 材料类型
   * @property {number} Id - 材料 Id
   * @property {number} RankLevel - 星级
   * @property {number} ItemType - 物品类型
   * @property {string} Name - 材料名称
   * @property {string} Description - 材料描述
   * @property {string} TypeDescription - 物品类型描述
   * @property {string} Icon - 材料图标
   * @return Material
   */
  interface Material {
    MaterialType: number;
    Id: number;
    RankLevel: number;
    ItemType: number;
    Name: string;
    Description: string;
    TypeDescription: string;
    Icon: string;
  }
}
