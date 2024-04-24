/**
 * @file core/components/achievements/utils.ts
 * @description 成就组件工具函数
 * @since 2.2.0
 */

import * as amosData from "@yuehaiteam/amos-data/amos/achievements/index";
import type { Achievement as AmosAchi } from "@yuehaiteam/amos-data/amos/achievements/typing";
import * as textMap from "@yuehaiteam/amos-data/amos/TextMap/TextMap-CHS";

/**
 * @description 扁平化成就数据
 * @since 2.0.1
 * @returns {AmosAchi[]} 扁平化后的成就数据
 */
function flattenAchievements(): AmosAchi[] {
  const achievements: AmosAchi[] = [];
  amosData.default.forEach((item) => {
    achievements.push(...item.achievements);
  });
  return achievements;
}

/**
 * @description 根据成就 ID 获取成就数据
 * @since 2.2.0
 * @param {string} id 成就 ID
 * @returns {AmosAchi} 成就数据
 */
export function getAchiTrigger(id: number): TGACore.Components.Achievement.Trigger {
  const totalAchievements = flattenAchievements();
  const achievement = totalAchievements.find((item) => item.id === Number(id));
  if (achievement === undefined || achievement === null) {
    return {
      type: "Unknown",
    };
  }
  const task = achievement.trigger.task?.map((taskItem) => {
    return {
      questId: taskItem.questId,
      name: textMap.default[taskItem.name],
      type: getTaskType(taskItem.type),
    };
  });
  return {
    type: achievement.trigger.type,
    task,
  };
}

/**
 * @description 根据任务类型获取任务类型名称
 * @param {string} type 任务类型
 * @returns {string} 任务类型名称
 */
function getTaskType(type: string): string {
  switch (type) {
    case "WQ":
      return "世界任务";
    case "IQ":
      return "每日委托";
    case "AQ":
    case "MQ":
      return "魔神任务";
    case "LQ":
      return "角色邀约/传说任务";
    default:
      throw new Error(`Unknown task type ${type}`);
  }
}
