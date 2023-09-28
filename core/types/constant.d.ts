/**
 * @file core types constant.d.ts
 * @description 核心常量类型声明文件
 * @since 2.0.0
 */

/**
 * @description 核心常量 namespace
 * @since 2.0.0
 * @namespace TGACore.Constant
 * @memberof TGACore
 */
declare namespace TGACore.Constant {
  /**
   * @description 武器类型枚举，英文-中文对照
   * @since 2.0.0
   * @memberof TGACore.Constant
   * @enum {string}
   * @property {string} sword 单手剑
   * @property {string} claymore 双手剑
   * @property {string} pole 长柄武器
   * @property {string} bow 弓
   * @property {string} catalyst 法器
   * @return WeaponTypeEnum
   */
  const enum WeaponType {
    sword = "单手剑",
    claymore = "双手剑",
    pole = "长柄武器",
    bow = "弓",
    catalyst = "法器",
  }

  /**
   * @description 胡桃的武器类型枚举，英文-中文对照
   */

  /**
   * @description 元素类型枚举，英文-中文对照
   * @since 2.0.0
   * @memberof TGACore.Constant
   * @enum {string}
   * @property {string} anemo 风
   * @property {string} geo 岩
   * @property {string} electro 雷
   * @property {string} hydro 水
   * @property {string} pyro 火
   * @property {string} cryo 冰
   * @property {string} dendro 草
   * @return ElementTypeEnum
   */
  const enum ElementType {
    anemo = "风",
    geo = "岩",
    electro = "雷",
    hydro = "水",
    pyro = "火",
    cryo = "冰",
    dendro = "草",
  }

  /**
   * @description 国家枚举-索引
   * @since 2.0.0
   * @memberof TGACore.Constant
   * @enum {number}
   * @property {number} Mondstadt 蒙德 =1
   * @property {number} Liyue 璃月 =2
   * @property {number} Inazuma 稻妻 =3
   * @property {number} Sumeru 须弥 =4
   * @property {number} Fontaine 枫丹 =5
   * @todo 后续版本更新后，需要更新此枚举
   * @return NationIndex
   */
  const enum NationIndex {
    Mondstadt = 1,
    Liyue = 2,
    Inazuma = 3,
    Sumeru = 4,
    Fontaine = 5,
  }

  /**
   * @description 国家枚举-中文
   * @since 2.0.0
   * @memberof TGACore.Constant
   * @enum {string}
   * @property {string} Mondstadt 蒙德
   * @property {string} Liyue 璃月
   * @property {string} Inazuma 稻妻
   * @property {string} Sumeru 须弥
   * @property {string} Fontaine 枫丹
   * @todo 后续版本更新后，需要更新此枚举
   * @return NationType
   */
  const enum NationType {
    Mondstadt = "蒙德",
    Liyue = "璃月",
    Inazuma = "稻妻",
    Sumeru = "须弥",
    Fontaine = "枫丹",
  }

  /**
   * @description 星期枚举
   * @since 2.0.0
   * @memberof TGACore.Constant
   * @enum {number}
   * @property {number} monday 星期一
   * @property {number} tuesday 星期二
   * @property {number} wednesday 星期三
   * @property {number} thursday 星期四
   * @property {number} friday 星期五
   * @property {number} saturday 星期六
   * @property {number} sunday 星期日
   * @return WeekIndex
   */
  const enum WeekIndex {
    monday = 1,
    tuesday = 2,
    wednesday = 3,
    thursday = 4,
    friday = 5,
    saturday = 6,
    sunday = 7,
  }

  /**
   * @description 星期枚举
   * @since 2.0.0
   * @memberof TGACore.Constant
   * @enum {string}
   * @property {string} monday 星期一
   * @property {string} tuesday 星期二
   * @property {string} wednesday 星期三
   * @property {string} thursday 星期四
   * @property {string} friday 星期五
   * @property {string} saturday 星期六
   * @property {string} sunday 星期日
   * @return WeekType
   */
  const enum Week {
    monday = "monday",
    tuesday = "tuesday",
    wednesday = "wednesday",
    thursday = "thursday",
    friday = "friday",
    saturday = "saturday",
    sunday = "sunday",
  }
}
