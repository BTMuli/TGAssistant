/**
 * @file core types achievement.d.ts
 * @description 成就类型声明文件
 * @since 2.0.0
 */

/**
 * @description 成就 namespace
 * @since 2.0.0
 * @namespace TGACore.Components.Achievement
 * @memberof TGACore.Components
 */
declare namespace TGACore.Components.Achievement {
  /**
   * @description 成就元数据类型-Paimon
   * @since 2.0.0
   * @memberof TGACore.Components.Achievement
   * @return RawPaimon
   */
  type RawPaimon = Record<number, PaimonSeries>;

  /**
   * @description 成就元数据类型-Paimon-成就系列
   * @since 2.0.0
   * @memberof TGACore.Components.Achievement
   * @property {string} name 成就系列名称
   * @property {[PaimonItem|PaimonItem[]]} achievements 成就列表
   * @property {number} order 成就系列排序
   * @return PaimonSeries
   */
  interface PaimonSeries {
    name: string;
    achievements: [PaimonItem | PaimonItem[]];
    order: number;
  }
  /**
   * @description 成就元数据类型-Paimon-成就
   * @since 2.0.0
   * @memberof TGACore.Components.Achievement
   * @property {number} id 成就编号
   * @property {string} name 成就名称
   * @property {string} desc 成就描述
   * @property {number} reward 成就奖励
   * @property {string} ver 成就版本
   * @return PaimonItem
   */
  interface PaimonItem {
    id: number;
    name: string;
    desc: string;
    reward: number;
    ver: string;
  }

  /**
   * @description 成就元数据类型-成就
   * @since 2.0.0
   * @memberof TGACore.Components.Achievement
   * @property {number} Id 成就编号
   * @property {number} Goal 成就系列编号
   * @property {number} Order 成就排序
   * @property {string} Title 成就名称
   * @property {string} Description 成就描述
   * @property {number} FinishReward.Id 成就奖励编号
   * @property {number} FinishReward.Count 成就奖励数量
   * @property {boolean} IsDeleteWatcherAfterFinish 完成后是否删除观察者
   * @property {number} Progress 成就进度
   * @property {string} Version 成就版本
   * @return RawAchievement
   */
  interface RawAchievement {
    Id: number;
    Goal: number;
    Order: number;
    Title: string;
    Description: string;
    FinishReward: {
      Id: number;
      Count: number;
    };
    IsDeleteWatcherAfterFinish: boolean;
    Progress: number;
    Version: string;
  }

  /**
   * @description 成就元数据类型-成就系列
   * @since 2.0.0
   * @memberof TGACore.Components.Achievement
   * @property {number} Id 成就系列编号
   * @property {number} Order 成就系列排序
   * @property {string} Name 成就系列名称
   * @property {string} Icon 成就系列图标
   * @return RawSeries
   */
  interface RawSeries {
    Id: number;
    Order: number;
    Name: string;
    Icon: string;
  }

  /**
   * @description 转换后的成就系列数据
   * @since 2.0.0
   * @memberof TGACore.Components.Achievement
   * @property {number} id 成就系列编号
   * @property {number} order 成就系列排序
   * @property {string} name 成就系列名称
   * @property {string} version 成就系列版本
   * @property {string} card 成就系列名片
   * @property {string} icon 成就系列图标
   * @return ConvertSeries 转换后的成就系列数据
   */
  interface ConvertSeries {
    id: number;
    order: number;
    name: string;
    version: string;
    card: string;
    icon: string;
  }

  /**
   * @description 转换后的成就数据
   * @since 2.0.0
   * @memberof TGACore.Components.Achievement
   * @property {number} id 成就编号
   * @property {number} series 成就系列编号
   * @property {number} order 成就排序
   * @property {string} name 成就名称
   * @property {string} description 成就描述
   * @property {number} reward 成就奖励
   * @property {string} version 成就版本
   * @return ConvertAchievement 转换后的成就数据
   */
  interface ConvertAchievement {
    id: number;
    series: number;
    order: number;
    name: string;
    description: string;
    reward: number;
    version: string;
  }
}
