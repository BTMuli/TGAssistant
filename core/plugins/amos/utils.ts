/**
 * @file core/plugins/amos/utils.ts
 * @description amos-data 触发器解析
 * @since 2.4.1
 */
import amosIndexJson from "@yuehaiteam/amos-data/json/achievements/index.json" with { type: "json" };
import amosPartialJson from "@yuehaiteam/amos-data/json/achievements/partial.json" with { type: "json" };
import amosTextMapJson from "@yuehaiteam/amos-data/json/TextMap/TextMap-CHS.json" with { type: "json" };

const achievementCategories = <Array<TGACore.Plugins.Amos.AchievementCategory>>amosIndexJson;
const achievementPartials = <TGACore.Plugins.Amos.TriggerMeta>amosPartialJson;
const textMap = <Record<string, string>>amosTextMapJson;

export type AchievementPartialParseResult = {
  partials: Array<TGACore.Components.Achievement.AchievementPartial>;
  errors: Array<Error>;
};

/**
 * @description 获取 amos-data 成就分类
 * @since 2.4.1
 * @returns {Array<TGACore.Plugins.Amos.AchievementCategory>} 成就分类
 */
export function getAchievementCategories(): Array<TGACore.Plugins.Amos.AchievementCategory> {
  return achievementCategories;
}

/**
 * @description 将 amos-data 成就数据扁平化
 * @since 2.4.0
 * @returns {Array<TGACore.Plugins.Amos.Achievement>} 扁平化后的成就数据
 */
export function flattenAchievements(): Array<TGACore.Plugins.Amos.Achievement> {
  const res: Array<TGACore.Plugins.Amos.Achievement> = [];
  for (const category of achievementCategories) res.push(...category.achievements);
  return res;
}

/**
 * @description 读取并校验 TextMap 文本
 * @since 2.4.1
 * @param {number} textId 文本 ID
 * @param {string} context 文本用途
 * @returns {string} 已解析文本
 */
function parseText(textId: number, context: string): string {
  const value = textMap[textId.toString()];
  if (value === undefined || value.trim() === "") {
    throw new Error(`${context} 缺失文本 ID 为 ${textId} 的非空文本数据`);
  }
  return value;
}

/**
 * @description 解析任务触发器文本
 * @since 2.4.0
 * @param {TGACore.Plugins.Amos.TriggerTask} task 任务触发器
 * @return {TGACore.Components.Achievement.TriggerTask}
 */
function parseTask(
  task: TGACore.Plugins.Amos.TriggerTask,
): TGACore.Components.Achievement.AchievementTriggerTask {
  return {
    taskId: task.taskId,
    questId: task.questId,
    type: task.type,
    name: parseText(task.name, "任务"),
  };
}

/**
 * @description 根据任务触发器解析对应文本
 * @since 2.4.0
 * @param {TGACore.Plugins.Amos.TriggerMetaItem} task 任务触发器
 * @returns {TGACore.Components.Achievement.TriggerTask} 解析后的任务触发器文本
 */
function parsePartialTask(
  task: TGACore.Plugins.Amos.TriggerMetaItem,
): TGACore.Components.Achievement.AchievementPartial {
  let parsedName = "";
  for (const namePart of task.name) {
    if (typeof namePart === "number") {
      parsedName += parseText(namePart, "分步项");
      continue;
    }
    if (!namePart.startsWith("/") || !namePart.endsWith("/")) {
      parsedName += namePart;
      continue;
    }
    const reg = new RegExp(namePart.slice(1, -1));
    const match = reg.exec(parsedName);
    if (match && match.length > 1) parsedName = match[1];
    else throw new Error(`正则 ${namePart} 在 ${parsedName} 中未匹配到任何内容，无法提取任务名称`);
  }
  if (parsedName.trim() === "") throw new Error("分步项名称解析为空字符串");
  return { id: task.id, name: parsedName, type: task.type };
}

/**
 * @description 解析成就触发器
 * @since 2.4.1
 * @param {TGACore.Plugins.Amos.Achievement} achievement 成就数据
 * @return {TGACore.Components.Achievement.Trigger} 解析后的成就触发器
 */
export function parseAchievementTrigger(
  achievement: TGACore.Plugins.Amos.Achievement,
): TGACore.Components.Achievement.AchievementTrigger {
  const taskMap = new Map<string, TGACore.Components.Achievement.AchievementTriggerTask>();
  for (const taskItem of achievement.trigger.task ?? []) {
    const parsedTask = parseTask(taskItem);
    const key = `${parsedTask.taskId}:${parsedTask.questId}:${parsedTask.type}`;
    const existing = taskMap.get(key);
    if (existing !== undefined && existing.name !== parsedTask.name) {
      throw new Error(
        `[plugins][amos][utils][${achievement.id}] 任务 ${key} 存在冲突文本：${existing.name} / ${parsedTask.name}`,
      );
    }
    if (existing === undefined) taskMap.set(key, parsedTask);
  }
  return { type: achievement.trigger.type, tasks: Array.from(taskMap.values()) };
}

/**
 * @description 解析成就分步项
 * @since 2.4.1
 * @param {number} achievementId 成就 ID
 * @returns {AchievementPartialParseResult} 已解析分步项及无法解析的条目
 */
export function parseAchievementPartials(achievementId: number): AchievementPartialParseResult {
  const partialMap = new Map<string, TGACore.Components.Achievement.AchievementPartial>();
  const errors: Array<Error> = [];
  for (const partialItem of achievementPartials[achievementId] ?? []) {
    let parsedPartial: TGACore.Components.Achievement.AchievementPartial;
    try {
      parsedPartial = parsePartialTask(partialItem);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(
        new Error(
          `[plugins][amos][utils][${achievementId}] 解析分步项失败：${JSON.stringify(partialItem)}；${message}`,
          { cause: error },
        ),
      );
      continue;
    }
    const key = `${parsedPartial.type}:${parsedPartial.id}`;
    const existing = partialMap.get(key);
    if (existing !== undefined && existing.name !== parsedPartial.name) {
      errors.push(
        new Error(
          `[plugins][amos][utils][${achievementId}] 分步项 ${key} 存在冲突文本：${existing.name} / ${parsedPartial.name}`,
        ),
      );
      continue;
    }
    if (existing === undefined) partialMap.set(key, parsedPartial);
  }
  return { partials: Array.from(partialMap.values()), errors };
}
