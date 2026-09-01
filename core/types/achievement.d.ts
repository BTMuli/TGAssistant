/**
 * 成就类型声明文件
 * @since 2.6.0
 */

declare namespace TGACore.Components.Achievement {
  /**
   * v2 成就目录
   * @since 2.6.0
   */
  type AchievementCatalog = {
    schemaVersion: 2;
    gameVersion: string;
    categories: Array<AchievementCategory>;
  };

  /**
   * @description v2 成就分类
   * @since 2.4.0
   */
  type AchievementCategory = {
    id: number;
    key: string;
    order: number;
    name: string;
    version: string;
    totalReward: number;
    namecardId: number | null;
    icon: string;
    achievements: Array<AchievementDefinition>;
  };

  /**
   * @description v2 成就定义
   * @since 2.4.0
   */
  type AchievementDefinition = {
    id: number;
    categoryId: number;
    order: number;
    name: string;
    description: string;
    reward: number;
    version: string;
    hidden: boolean;
    target: number;
    preStageId?: number;
    postStageId?: number;
    trigger: AchievementTrigger;
    partials: Array<AchievementPartial>;
  };

  /**
   * @description v2 成就触发条件
   * @since 2.4.0
   */
  type AchievementTrigger = { type: string; tasks: Array<AchievementTriggerTask> };

  /**
   * @description v2 成就触发任务
   * @since 2.4.0
   */
  type AchievementTriggerTask = {
    taskId: number;
    questId: number;
    type: string;
    name: string;
  };

  /**
   * @description v2 成就分步项
   * @since 2.4.0
   */
  type AchievementPartial = {
    id: number;
    type: "achievement" | "quest" | "subquest" | "task" | "subtask";
    name: string;
  };
}
