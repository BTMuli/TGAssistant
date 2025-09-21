/**
 * @file core/plugins/amos/types.d.ts
 * @description amos-data 类型定义
 * @since 2.4.0
 */

declare namespace TGACore.Plugins.Amos {
  /**
   * @description 成就系列
   * @since 2.4.0
   * @interface AchievementCategory
   * @see @yuehaiteam/amos-data/amos/achievements/typing.d.ts
   * @property {number} id 成就分类编号
   * @property {string} key 成就分类键
   * @property {number} name 成就分类名称（文本 ID）
   * @property {number} order 成就分类排序
   * @property {number} totalReward 成就分类总奖励（文本 ID）
   * @property {Array<Achievement>} achievements 成就列表
   */
  type AchievementCategory = {
    id: number;
    key: string;
    name: number;
    order: number;
    totalReward: number;
    achievements: Array<Achievement>;
  };

  /**
   * @description 成就项
   * @since 2.4.0
   * @interface Achievement
   * @see @yuehaiteam/amos-data/amos/achievements/typing.d.ts
   * @property {number} id 成就编号
   * @property {number} name 成就名称（文本 ID）
   * @property {number} desc 成就描述（文本 ID）
   * @property {number} reward 成就奖励（文本 ID）
   * @property {boolean} hidden 成就是否隐藏
   * @property {number} order 成就排序
   * @property {number} [preStage] 前置成就编号
   * @property {number} [postStage] 后置成就编号
   * @property {number} categoryId 成就分类编号
   * @property {number} total 成就总量
   * @property {Trigger} trigger 成就触发器
   */
  type Achievement = {
    id: number;
    name: number;
    desc: number;
    reward: number;
    hidden: boolean;
    order: number;
    preStage?: number;
    postStage?: number;
    categoryId: number;
    total: number;
    trigger: Trigger;
  };

  /**
   * @description 成就触发器
   * @since 2.4.0
   * @interface Trigger
   * @see @yuehaiteam/amos-data/amos/achievements/typing.d.ts
   * @property {string} type 触发器类型
   * @property {Array<TriggerTask>} task 触发器任务列表
   */
  type Trigger = { type: string; task?: Array<TriggerTask> };

  /**
   * @description 触发器任务
   * @since 2.4.0
   * @interface TriggerTask
   * @see @yuehaiteam/amos-data/amos/achievements/typing.d.ts
   * @property {number} taskId 任务编号
   * @property {number} questId 任务所属任务编号
   * @property {number} name 任务名称（文本 ID）
   * @property {string} type 任务类型
   */
  type TriggerTask = { taskId: number; questId: number; name: number; type: string };

  /**
   * @description 触发器元数据
   * @since 2.4.0
   * @interface TriggerMeta
   * @see @yuehaiteam/amos-data/amos/achievements/typing-partial.d.ts
   */
  type TriggerMeta = Record<string | number, Array<TriggerMetaItem>>;

  /**
   * @description 触发器元数据项
   * @since 2.4.0
   * @interface TriggerMetaItem
   * @see @yuehaiteam/amos-data/amos/achievements/typing-partial.d.ts
   * @property {number} id 元数据项编号
   * @property {"quest" | "subquest" | "task" | "subtask"} type 元数据项类型
   * @property {Array<string | number>} name 元数据项名称（文本 ID 或字符串）
   */
  type TriggerMetaItem = {
    id: number;
    type: "quest" | "subquest" | "task" | "subtask";
    name: Array<string | number>;
  };
}
