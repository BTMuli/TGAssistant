/**
 * @file core/plugins/amos/utils.ts
 * @description amos-data 触发器解析
 * @since 2.4.0
 */
import amosIndexJson from "@yuehaiteam/amos-data/json/achievements/index.json" assert { type: "json" };
import amosPartialJson from "@yuehaiteam/amos-data/json/achievements/partial.json" assert { type: "json" };
import amosTextMapJson from "@yuehaiteam/amos-data/json/TextMap/TextMap-CHS.json" assert { type: "json" };

/**
 * @description 将 amos-data 成就数据扁平化
 * @since 2.4.0
 * @returns {Array<TGACore.Plugins.Amos.Achievement>} 扁平化后的成就数据
 */
export function flattenAchievements(): Array<TGACore.Plugins.Amos.Achievement> {
  const res: Array<TGACore.Plugins.Amos.Achievement> = [];
  const totalJson = <Array<TGACore.Plugins.Amos.AchievementCategory>>amosIndexJson;
  for (const category of totalJson) res.push(...category.achievements);
  return res;
}

/**
 * @description 判断成就是否有任务触发器
 * @since 2.4.0
 * @param {TGACore.Plugins.Amos.Achievement} achievement 成就数据
 * @return {boolean | Array<TGACore.Plugins.Amos.TriggerMetaItem>} 如果有任务触发器则返回任务触发器数组，否则返回 false
 */
function hasTaskTrigger(
  achievement: TGACore.Plugins.Amos.Achievement,
): false | Array<TGACore.Plugins.Amos.TriggerMetaItem> {
  if (!achievement.trigger.task || achievement.trigger.task.length === 0) return false;
  const partialJson = <TGACore.Plugins.Amos.TriggerMeta>amosPartialJson;
  const partial = partialJson[achievement.id];
  if (partial === undefined || partial === null) return true;
  return partial;
}

/**
 * @description 解析任务类型
 * @since 2.4.0
 * @param {string} type 任务类型
 * @return {string} 解析后的任务类型
 */
function parseTaskType(type: string): string {
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
    case "":
      return "";
    default:
      return `未知类型:${type}`;
  }
}

/**
 * @description 解析任务触发器文本
 * @since 2.4.0
 * @param {TGACore.Plugins.Amos.TriggerTask} task 任务触发器
 * @return {TGACore.Components.Achievement.TriggerTask}
 */
function parseTask(
  task: TGACore.Plugins.Amos.TriggerTask,
): TGACore.Components.Achievement.TriggerTask {
  const textMap = <Record<string, string>>amosTextMapJson;
  const nameText = textMap[task.name.toString()];
  if (nameText === undefined || nameText === null) {
    throw new Error(`缺失文本 ID 为 ${task.name} 的文本数据`);
  }
  const typeText = parseTaskType(task.type);
  return { questId: task.questId, name: nameText, type: typeText };
}

/**
 * @description 根据任务触发器解析对应文本
 * @since 2.4.0
 * @param {TGACore.Plugins.Amos.TriggerMetaItem} task 任务触发器
 * @returns {TGACore.Components.Achievement.TriggerTask} 解析后的任务触发器文本
 */
function parsePartialTask(
  task: TGACore.Plugins.Amos.TriggerMetaItem,
): TGACore.Components.Achievement.TriggerTask {
  const textMap = <Record<string, string>>amosTextMapJson;
  let parsedName = "";
  for (const namePart of task.name) {
    if (typeof namePart === "number") {
      const nameText = textMap[`${namePart}`];
      if (nameText === undefined || nameText === null) {
        throw new Error(`缺失文本 ID 为 ${namePart} 的文本数据`);
      }
      parsedName += nameText;
      continue;
    }
    // 判断是否正则
    const regex = /^\/(.+)\/$/;
    const match = namePart.match(regex);
    if (!match) {
      parsedName += namePart;
      continue;
    }
    // 对已有文本进行正则替换
    const pattern = match[1];
    const reg = new RegExp(pattern);
    const existingText = textMap[task.questId.toString()];
    if (existingText === undefined || existingText === null) {
      throw new Error(`缺失文本 ID 为 ${task.questId} 的文本数据`);
    }
    parsedName += existingText.replace(reg, "");
  }
  return { questId: task.id, name: parsedName, type: task.type };
}

/**
 * @description 解析成就触发器
 * @since 2.4.0
 * @param {TGACore.Plugins.Amos.Achievement} achievement 成就数据
 * @return {TGACore.Components.Achievement.Trigger} 解析后的成就触发器
 */
export function parseTrigger(
  achievement: TGACore.Plugins.Amos.Achievement,
): TGACore.Components.Achievement.Trigger {
  const hasTask = hasTaskTrigger(achievement);
  if (!hasTask) return { type: achievement.trigger.type };
  let taskArr = [];
  if (achievement.trigger.task && achievement.trigger.task.length > 0) {
    for (const taskItem of achievement.trigger.task) {
      const parsedTask = parseTask(taskItem);
      taskArr.push(parsedTask);
    }
  }
  if (Array.isArray(hasTask)) {
    for (const taskItem of hasTask) {
      try {
        taskArr.push(parsePartialTask(taskItem));
      } catch (e) {
        console.warn(e);
        console.warn(
          `[plugins][amos][utils][${achievement.id}] 解析任务触发器失败: ${JSON.stringify(taskItem)}`,
        );
      }
    }
  }
  // 移除type:quest的重复任务
  taskArr = taskArr.filter((taskItem) => taskItem.type !== "quest");
  return { type: achievement.trigger.type, task: taskArr };
}
