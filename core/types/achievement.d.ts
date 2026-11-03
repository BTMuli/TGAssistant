/**
 * 成就类型声明文件
 * @since 2.7.0
 */

declare namespace TGACore.Components.Achievement {
  /**
   * 成就目录转换所需的来源数据。
   * @since 2.7.0
   */
  type CatalogSources = {
    achievements: TGACore.Plugins.Hutao.Achievement.RawAchievement;
    categories: TGACore.Plugins.Hutao.Achievement.RawAchievementGoal;
    namecards: TGACore.Plugins.Hutao.NameCard.RawNameCard;
    yatta: TGACore.Plugins.Yatta.Achievement.AchiRes;
    nanoka: TGACore.Plugins.Nanoka.Achievement.All;
    nanokaVersion: string;
    amos?: ReadonlyArray<TGACore.Plugins.Amos.AchievementSupplement>;
  };

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
