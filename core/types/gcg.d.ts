/**
 * @file core types gcg.d.ts
 * @description 卡牌组件类型定义
 * @since 2.0.0
 */

/**
 * @description 卡牌组件 namespace
 * @since 2.0.0
 * @namespace TGACore.Components.GCG
 * @memberof TGACore.Components
 */
declare namespace TGACore.Components.GCG {
  /**
   * @description 转换后的卡牌数据
   * @since 2.0.0
   * @memberof TGACore.Components.GCG
   * @interface ConvertData
   * @property {number} id 卡牌 id
   * @property {number} contentId 卡牌 观测枢 id
   * @property {string} name 卡牌名称
   * @property {CardType} type 卡牌类型
   * @property {string} icon 卡牌图标
   * @property {Record<string, string>} tags 卡牌标签
   * @return ConvertData
   */
  interface ConvertData {
    id: number;
    contentId: number;
    name: string;
    type: CardType;
    icon: string;
    tags: Record<string, string>;
  }

  /**
   * @description 卡牌类型枚举
   * @since 2.0.0
   * @memberof TGACore.Components.GCG
   * @enum {string}
   * @property {string} character 角色卡
   * @property {string} action 行动卡
   * @property {string} monster 怪物卡
   * @return CardType
   */
  const enum CardType {
    character = "角色牌",
    action = "行动牌",
    monster = "魔物牌",
  }
}
