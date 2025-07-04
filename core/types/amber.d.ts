/**
 * @file core/types/amber.d.ts
 * @description amber 插件类型定义
 * @since 2.4.0
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
   * @description 返回响应-名片列表
   * @since 2.4.0
   * @interface NameCardListResp
   * @extends Response<NameCardTypeMap, NameCard>
   */
  type NameCardListResp = Response<NameCardTypeMap, NameCard>;

  /**
   * @description 名片类型对照表
   * @since 2.4.0
   * @interface NameCardTypeMap
   */
  type NameCardTypeMap = Record<string, string>;

  /**
   * @description 名片数据
   * @since 2.4.0
   * @interface NameCard
   * @extends Item
   * @property {string} type 类型
   * @property {number} rank 星级
   */
  type NameCard = Item & { type: string; rank: number };

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

  /**
   * @description 成就响应
   * @since 2.3.0
   * @interface AchiResp
   * @property {number} response 返回状态码
   * @property {AchiRes} data 返回数据
   * @return AchiResp
   */
  type AchiResp = { response: number; data: AchiRes };

  /**
   * @description 成就数据
   * @since 2.3.0
   * @interface AchiRes
   * @return AchiRes
   */
  type AchiRes = Record<string, AchiSeries>;

  /**
   * @description 成就系列
   * @since 2.3.0
   * @interface AchiSeries
   * @property {number} id 编号
   * @property {string} name 名称
   * @property {number} order 排序
   * @property {string} icon 图标
   * @property {Record<string,AchiList>} achievementList 成就列表
   * @property {Record<string,AchiReward>} finishReward 完成奖励
   * @return AchiSeries
   */
  type AchiSeries = {
    id: number;
    name: string;
    order: number;
    icon: string;
    achievementList: Record<string, AchiList>;
    finishReward: Record<string, AchiReward>;
  };

  /**
   * @description 成就列表
   * @since 2.3.0
   * @property {number} id 编号
   * @property {number} order 排序
   * @property {string} version 版本
   * @property {Array<AchiItem>} details 详情
   * @property {Array<AchiTask>} tasks 任务
   * @return AchiList
   */
  type AchiList = {
    id: number;
    order: number;
    version: string;
    details: Array<AchiItem>;
    tasks: Array<AchiTask>;
  };

  /**
   * @description 成就详情
   * @since 2.3.0
   * @interface AchiItem
   * @property {number} id 编号
   * @property {string} title 标题
   * @property {string} description 描述
   * @property {number} progress 进度
   * @property {Record<string,AchiReward>} rewards 奖励
   * @return AchiItem
   */
  type AchiItem = {
    id: number;
    title: string;
    description: string;
    progress: number;
    rewards: Record<string, AchiReward>;
  };

  /**
   * @description 成就任务
   * @since 2.3.0
   * @interface AchiTask
   * @property {string} type 类型
   * @property {Array<AchiQuest>} questList 任务列表
   * @return AchiTask
   */
  type AchiTask = { type: string; questList: Array<AchiQuest> };

  /**
   * @description 成就任务
   * @since 2.3.0
   * @interface AchiQuest
   * @property {number} id 编号
   * @property {string} questTitle 任务标题
   * @property {number} chapterId 章节编号
   * @property {string} chapterTitle 章节标题
   * @return AchiQuest
   */
  type AchiQuest = { id: number; questTitle?: string; chapterId: number; chapterTitle: string };

  /**
   * @description 奖励，成就系列的key是名片ID，成就详情的key是材料ID
   * @since 2.3.0
   * @interface AchiReward
   * @property {number} rank 星级
   * @property {number} count 数量
   * @property {string} icon 图标
   * @return AchiReward
   */
  type AchiReward = { rank: number; count: number; icon: string };
}
