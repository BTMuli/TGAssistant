/**
 * @file core/types/amber.d.ts
 * @description amber 插件类型定义
 * @since 2.3.0
 */

declare namespace TGACore.Plugins.Amber {
  /**
   * @description 通用 api 返回数据类型
   * @since 2.0.0
   * @memberof TGACore.Plugins.Amber
   * @interface Response<T, U>
   * @template T, U
   * @property {number} response 返回状态码
   * @property {T} data.types 返回数据
   * @property {Record<string, U>} data.items 返回数据类型
   * @return Response<T, U>
   */
  interface Response<T, U> {
    response: number;
    data: {
      types: T;
      items: Record<string, U>;
    };
  }

  /**
   * @description 通用数据类型，data.items 的类型
   * @since 2.0.0
   * @memberof TGACore.Plugins.Amber
   * @interface Item
   * @property {number} id 编号
   * @property {string} name 名称
   * @property {string} icon 图标
   * @property {string} route 路由
   * @return Item
   */
  interface Item {
    id: string;
    name: string;
    icon: string;
    route: string;
  }

  /**
   * @description 武器类型枚举
   * @since 2.0.0
   * @memberof TGACore.Plugins.Amber
   * @enum {string}
   * @property {string} sword 单手剑
   * @property {string} claymore 双手剑
   * @property {string} pole 长柄武器
   * @property {string} bow 弓
   * @property {string} catalyst 书
   * @return WeaponType
   */
  const enum WeaponType {
    sword = "WEAPON_SWORD_ONE_HAND",
    claymore = "WEAPON_CLAYMORE",
    pole = "WEAPON_POLE",
    bow = "WEAPON_BOW",
    catalyst = "WEAPON_CATALYST",
  }

  /**
   * @description 武器类型对照表
   * @since 2.0.0
   * @memberof TGACore.Plugins.Amber
   * @return WeaponTypeMap
   */
  type WeaponTypeMap = Record<WeaponType, TGACore.Constant.WeaponType>;

  /**
   * @description 元素类型枚举
   * @since 2.0.0
   * @memberof TGACore.Plugins.Amber
   * @enum {string}
   * @property {string} anemo 风
   * @property {string} geo 岩
   * @property {string} electro 雷
   * @property {string} hydro 水
   * @property {string} pyro 火
   * @property {string} cryo 冰
   * @property {string} dendro 草
   * @return ElementType
   */
  const enum ElementType {
    anemo = "Wind",
    geo = "Rock",
    electro = "Electric",
    hydro = "Water",
    pyro = "Fire",
    cryo = "Ice",
    dendro = "Grass",
  }

  /**
   * @description 返回数据-角色
   * @since 2.0.0
   * @memberof TGACore.Plugins.Amber
   * @interface ResponseCharacter
   * @template WeaponTypeMap, Character
   * @extends Response<WeaponTypeMap, Character>
   * @property {WeaponTypeMap} data.types 武器类型对照表
   * @property {Record<string, Character>} data.items 角色数据
   * @return ResponseCharacter
   */
  type ResponseCharacter = Response<WeaponTypeMap, Character>;

  /**
   * @description 角色数据
   * @since 2.0.0
   * @memberof TGACore.Plugins.Amber
   * @interface Character
   * @extends Item
   * @property {number} rank 星级
   * @property {string} element 元素
   * @property {WeaponType} weaponType 武器类型
   * @property {[number,number]} birthday 生日
   * @property {number} release 发布时间
   * @return Character
   */
  interface Character extends Item {
    rank: number;
    element: ElementType;
    weaponType: WeaponType;
    birthday: [number, number];
    release: number;
  }

  /**
   * @description 返回数据-武器
   * @since 2.0.0
   * @memberof TGACore.Plugins.Amber
   * @interface ResponseWeapon
   * @template WeaponTypeMap, Weapon
   * @extends Response<WeaponTypeMap, Weapon>
   * @property {WeaponTypeMap} data.types 武器类型对照表
   * @property {Record<string, Weapon>} data.items 武器数据
   * @return ResponseWeapon
   */
  type ResponseWeapon = Response<WeaponTypeMap, Weapon>;

  /**
   * @description 武器数据
   * @since 2.0.0
   * @memberof TGACore.Plugins.Amber
   * @interface Weapon
   * @extends Item
   * @property {number} rank 星级
   * @property {WeaponType} type 武器类型
   * @return Weapon
   */
  interface Weapon extends Item {
    rank: number;
    type: WeaponType;
  }

  /**
   * @description 返回数据-武器详情
   * @since 2.3.0
   * @interface WeaponDetailResp
   * @property {number} response 返回状态码
   * @property {WeaponDetail} data 返回数据
   * @return WeaponDetailResp
   */
  type WeaponDetailResp = { response: number; data: WeaponDetail };

  /**
   * @description 武器详情
   * @since 2.3.0
   * @interface WeaponDetail
   * @description 只写了用到的字段
   *
   */
  type WeaponDetail = {
    affix: unknown;
    ascension: unknown;
    description: string;
    icon: string;
    id: number;
    items: unknown;
    name: string;
    rank: number;
    route: string;
    specialProp: string;
    storyId: Array<string>;
    type: string;
    upgrade: unknown;
  };

  /**
   * @description 返回数据-材料
   * @since 2.0.1
   * @memberof TGACore.Plugins.Amber
   * @interface ResponseMaterial
   * @template MaterialTypeMap, Material
   * @extends Response<MaterialTypeMap, Material>
   * @property {MaterialTypeMap} data.types 材料类型对照表
   * @property {Record<string, Material>} data.items 材料数据
   * @return ResponseMaterial
   */
  type ResponseMaterial = Response<MaterialTypeMap, Material>;

  /**
   * @description 材料类型对照表
   * @since 2.0.1
   * @memberof TGACore.Plugins.Amber
   * @return MaterialTypeMap
   */
  type MaterialTypeMap = Record<string, string>;

  /**
   * @description 材料数据
   * @since 2.0.1
   * @memberof TGACore.Plugins.Amber
   * @interface Material
   * @extends Item
   * @property {string} type 材料类型
   * @property {false} recipe 是否有配方
   * @property {boolean} mapMark 是否有地图标记
   * @property {number} rank 星级
   * @return Material
   */
  interface Material extends Item {
    type: string;
    recipe: false;
    mapMark: boolean;
    rank: number;
  }

  /**
   * @description 返回响应-名片详情
   * @since 2.3.0
   * @interface NameCardDetailResp
   * @property {number} response 返回状态码
   * @property {NameCardDetail} data 返回数据
   * @return NameCardDetailResp
   */
  type NameCardDetailResp = { response: number; data: NameCardDetail };

  /**
   * @description 名片详情
   * @since 2.3.0
   * @interface NameCardDetail
   * @property {string} description 描述
   * @property {number} descriptionSpecial 特殊描述
   * @property {string} icon 图标
   * @property {number} id 编号
   * @property {string} name 名称
   * @property {number} rank 星级
   * @property {string} route 路由
   * @property {string} source 来源
   * @property {string} type 类型
   * @return NameCardDetail
   */
  type NameCardDetail = {
    description: string;
    descriptionSpecial: number;
    icon: string;
    id: number;
    name: string;
    rank: number;
    route: string;
    source: string | null;
    type: string;
  };
}
