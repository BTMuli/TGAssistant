/**
 * @file core/types/achievement.d.ts
 * @description 成就类型声明文件
 * @since 2.4.0
 */

declare namespace TGACore.Components.Achievement {
  /**
   * @description 转换后的成就系列数据
   * @since 2.4.0
   * @interface Series
   * @property {number} id 成就系列编号
   * @property {number} order 成就系列排序
   * @property {string} name 成就系列名称
   * @property {string} version 成就系列版本
   * @property {string} card 成就系列名片
   * @property {string} icon 成就系列图标
   */
  type Series = {
    id: number;
    order: number;
    name: string;
    version: string;
    card: string;
    icon: string;
  };

  /**
   * @description 转换后的成就数据
   * @since 2.4.0
   * @property {number} id 成就编号
   * @property {number} series 成就系列编号
   * @property {number} order 成就排序
   * @property {string} name 成就名称
   * @property {string} description 成就描述
   * @property {number} reward 成就奖励
   * @property {string} version 成就版本
   * @property {Trigger} trigger 成就触发条件
   */
  type Achievement = {
    id: number;
    series: number;
    order: number;
    name: string;
    description: string;
    reward: number;
    version: string;
    trigger: Trigger;
  };

  /**
   * @description 转换后的成就触发条件
   * @since 2.4.0
   * @memberof TGACore.Components.Achievement
   * @property {string} type 成就触发类型
   * @property {object} task 成就触发任务
   * @property {string} task.taskId 成就触发任务编号
   * @property {string} task.questId 成就触发任务所属任务编号
   * @property {string} task.name 成就触发任务名称
   * @property {string} task.type 成就触发任务类型
   */
  type Trigger = { type: string; task?: Array<TriggerTask> };

  /**
   * @description 转换后的任务数据
   * @since 2.4.0
   * @memberof TGACore.Components.Achievement
   * @property {number} questId 任务所属任务编号
   * @property {string} name 任务名称
   * @property {string} type 任务类型
   */
  type TriggerTask = { questId: number; name: string; type: string };
}
