/**
 * 成就目录校验
 * @since 2.6.0
 */

import Ajv from "ajv";

import achievementCatalogSchema from "./achievementCatalog.schema.json" with { type: "json" };

const ajv = new Ajv({ allErrors: true, strict: true });
const validateSchema = ajv.compile(achievementCatalogSchema);

/**
 * @description 比较两个点分版本号
 * @since 2.4.0
 * @param {string} left 左侧版本号
 * @param {string} right 右侧版本号
 * @returns {number} 左侧较新返回 1，右侧较新返回 -1，相等返回 0
 */
export function compareVersions(left: string, right: string): number {
  const leftParts = left.split(".").map(Number);
  const rightParts = right.split(".").map(Number);
  const maxLength = Math.max(leftParts.length, rightParts.length);
  for (let index = 0; index < maxLength; index++) {
    const leftPart = leftParts[index] ?? 0;
    const rightPart = rightParts[index] ?? 0;
    if (leftPart > rightPart) return 1;
    if (leftPart < rightPart) return -1;
  }
  return 0;
}

/**
 * @description 校验 v2 成就目录的结构和领域约束
 * @since 2.4.0
 * @param {TGACore.Components.Achievement.AchievementCatalog} catalog 成就目录
 * @returns {void}
 */
export function validateAchievementCatalog(
  catalog: TGACore.Components.Achievement.AchievementCatalog,
): void {
  if (!validateSchema(catalog)) {
    throw new Error(`成就目录未通过 JSON Schema：\n${ajv.errorsText(validateSchema.errors)}`);
  }

  const categoryIds = new Set<number>();
  const categoryKeys = new Set<string>();
  const achievementMap = new Map<number, TGACore.Components.Achievement.AchievementDefinition>();
  for (const category of catalog.categories) {
    if (categoryIds.has(category.id)) throw new Error(`成就分类 ID ${category.id} 重复`);
    categoryIds.add(category.id);
    if (categoryKeys.has(category.key)) throw new Error(`成就分类键 ${category.key} 重复`);
    categoryKeys.add(category.key);

    const totalReward = category.achievements.reduce((total, item) => total + item.reward, 0);
    if (totalReward !== category.totalReward) {
      throw new Error(
        `成就分类 ${category.id} 的总奖励不一致：${category.totalReward} / ${totalReward}`,
      );
    }
    const version = category.achievements.reduce((max, item) => {
      return compareVersions(item.version, max) > 0 ? item.version : max;
    }, category.achievements[0].version);
    if (version !== category.version) {
      throw new Error(`成就分类 ${category.id} 的版本不一致：${category.version} / ${version}`);
    }

    for (const achievement of category.achievements) {
      if (achievement.categoryId !== category.id) {
        throw new Error(
          `成就 ${achievement.id} 的分类不一致：${achievement.categoryId} / ${category.id}`,
        );
      }
      if (achievementMap.has(achievement.id)) throw new Error(`成就 ID ${achievement.id} 重复`);
      achievementMap.set(achievement.id, achievement);

      const taskKeys = new Set<string>();
      for (const task of achievement.trigger.tasks) {
        const key = `${task.taskId}:${task.questId}:${task.type}`;
        if (taskKeys.has(key)) throw new Error(`成就 ${achievement.id} 的任务键 ${key} 重复`);
        taskKeys.add(key);
      }
      const partialKeys = new Set<string>();
      for (const partial of achievement.partials) {
        const key = `${partial.type}:${partial.id}`;
        if (partialKeys.has(key)) throw new Error(`成就 ${achievement.id} 的分步项键 ${key} 重复`);
        partialKeys.add(key);
      }
    }
  }
  const gameVersion = catalog.categories.reduce((max, category) => {
    return compareVersions(category.version, max) > 0 ? category.version : max;
  }, catalog.categories[0].version);
  if (gameVersion !== catalog.gameVersion) {
    throw new Error(`成就目录的游戏版本不一致：${catalog.gameVersion} / ${gameVersion}`);
  }

  for (const achievement of achievementMap.values()) {
    if (achievement.preStageId !== undefined) {
      const preStage = achievementMap.get(achievement.preStageId);
      if (preStage === undefined) {
        throw new Error(`成就 ${achievement.id} 的前置阶段 ${achievement.preStageId} 不存在`);
      }
      if (preStage.categoryId !== achievement.categoryId) {
        throw new Error(`成就 ${achievement.id} 与前置阶段 ${preStage.id} 不属于同一分类`);
      }
      if (preStage.postStageId !== achievement.id) {
        throw new Error(`成就 ${achievement.id} 与前置阶段 ${preStage.id} 的引用不双向`);
      }
    }
    if (achievement.postStageId !== undefined) {
      const postStage = achievementMap.get(achievement.postStageId);
      if (postStage === undefined) {
        throw new Error(`成就 ${achievement.id} 的后置阶段 ${achievement.postStageId} 不存在`);
      }
      if (postStage.categoryId !== achievement.categoryId) {
        throw new Error(`成就 ${achievement.id} 与后置阶段 ${postStage.id} 不属于同一分类`);
      }
      if (postStage.preStageId !== achievement.id) {
        throw new Error(`成就 ${achievement.id} 与后置阶段 ${postStage.id} 的引用不双向`);
      }
    }
  }

  const visiting = new Set<number>();
  const visited = new Set<number>();
  function visitStageChain(achievementId: number): void {
    if (visiting.has(achievementId)) throw new Error(`成就阶段链在 ${achievementId} 处形成环`);
    if (visited.has(achievementId)) return;
    visiting.add(achievementId);
    const postStageId = achievementMap.get(achievementId)?.postStageId;
    if (postStageId !== undefined) visitStageChain(postStageId);
    visiting.delete(achievementId);
    visited.add(achievementId);
  }
  for (const achievementId of achievementMap.keys()) visitStageChain(achievementId);
}
