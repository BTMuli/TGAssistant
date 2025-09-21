/**
 * @description core/plugins/hutao/types/Achievement.d.ts
 * @description 一些关于胡桃成就的类型声明
 * @since 2.4.0
 */

declare namespace TGACore.Plugins.Hutao.Achievement {
  /**
   * @description 成就数据返回JSON
   * @since 2.4.0
   * @interface RawAchievement
   */
  type RawAchievement = Array<AchievementItem>;

  /**
   * @description 成就系列数据返回JSON
   * @since 2.4.0
   * @interface RawAchievementGoal
   */
  type RawAchievementGoal = Array<SeriesItem>;

  /**
   * @description 成就数据项
   * @since 2.4.0
   * @interface AchievementItem
   * @property {number} Id 成就编号
   * @property {number} Goal 成就系列编号
   * @property {number} Order 成就排序
   * @property {string} Title 成就名称
   * @property {string} Description 成就描述
   * @property {AchievementReward} FinishReward 成就奖励
   * @property {boolean} IsDeleteWatcherAfterFinish 完成后是否删除观察者
   * @property {number} Progress 成就进度
   * @property {string} Version 成就版本
   */
  type AchievementItem = {
    Id: number;
    Goal: number;
    Order: number;
    Title: string;
    Description: string;
    FinishReward: AchievementReward;
    IsDeleteWatcherAfterFinish: boolean;
    Progress: number;
    Version: string;
  };

  /**
   * @description 成就奖励
   * @since 2.4.0
   * @interface AchievementReward
   * @property {number} Id 成就奖励物品ID
   * @property {number} Count 成就奖励数量
   */
  type AchievementReward = { Id: number; Count: number };

  /**
   * @description 成就系列数据项
   * @since 2.4.0
   * @interface SeriesItem
   * @property {number} Id 成就系列编号
   * @property {number} Order 成就系列排序
   * @property {string} Name 成就系列名称
   * @property {string} Icon 成就系列图标
   */
  type SeriesItem = { Id: number; Order: number; Name: string; Icon: string };
}
