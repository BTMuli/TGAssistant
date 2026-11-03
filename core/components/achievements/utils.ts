/**
 * 合并成就来源及可选补充数据，生成兼容 v2 的成就目录。
 * @since 2.7.0
 */

import { CATEGORY_KEYS } from "./constant.ts";
import { compareVersions, validateAchievementCatalog } from "./validate.ts";

/**
 * 根据来源数据构建成就目录，补齐阶段关系并校验导出结构。
 * @since 2.7.0
 * @param sources - 成就、分类、名片及补充来源
 * @returns 保留既有字段和分类键的 v2 成就目录
 */
export function buildAchievementCatalog(
  sources: TGACore.Components.Achievement.CatalogSources,
): TGACore.Components.Achievement.AchievementCatalog {
  const snap = createUniqueMap(sources.achievements, (item) => item.Id, "Snap 成就");
  const series = createUniqueMap(sources.categories, (item) => item.Id, "Snap 成就分类");
  const namecards = createUniqueMap(sources.namecards, (item) => item.Id, "Snap 名片");
  const amosAchievements = createUniqueMap(sources.amos ?? [], (item) => item.id, "amos 成就");
  const yattaCategories = createUniqueMap(
    Object.values(sources.yatta),
    (item) => item.id,
    "Yatta 成就分类",
  );
  const nanokaAchievements = new Map<number, TGACore.Plugins.Nanoka.Achievement.Detail>();
  const nanokaCategories = new Map<number, number>();
  for (const category of Object.values(sources.nanoka)) {
    for (const item of category.list) {
      if (nanokaAchievements.has(item.id)) throw new Error(`Nanoka 成就 ID ${item.id} 重复`);
      nanokaAchievements.set(item.id, item);
      nanokaCategories.set(item.id, category.id);
    }
  }

  const achievementsByCategory = new Map<
    number,
    Array<TGACore.Components.Achievement.AchievementDefinition>
  >();
  for (const categoryId of series.keys()) achievementsByCategory.set(categoryId, []);

  for (const item of sources.achievements) {
    const amos = amosAchievements.get(item.Id);
    const supplement = nanokaAchievements.get(item.Id);
    const achievements = achievementsByCategory.get(item.Goal);
    if (achievements === undefined) throw new Error(`成就 ${item.Id} 的分类 ${item.Goal} 不存在`);
    let trigger: TGACore.Components.Achievement.AchievementTrigger;
    if (amos !== undefined) trigger = amos.trigger;
    else if (supplement !== undefined) {
      trigger = { type: supplement.trigger_config.trigger_type, tasks: [] };
    } else throw new Error(`成就 ${item.Id} 缺少 amos 或 Nanoka 补充数据`);
    if (amos?.total !== item.Progress && supplement?.param !== item.Progress) {
      throw new Error(`成就 ${item.Id} 的目标与补充来源不一致`);
    }
    if (amos?.categoryId !== item.Goal && nanokaCategories.get(item.Id) !== item.Goal) {
      throw new Error(`成就 ${item.Id} 的分类与补充来源不一致`);
    }
    if (item.Title.trim() === "" || item.Description.trim() === "") {
      throw new Error(`成就 ${item.Id} 的中文名称或描述为空`);
    }
    achievements.push({
      id: item.Id,
      categoryId: item.Goal,
      order: item.Order,
      name: item.Title,
      description: item.Description,
      reward: item.FinishReward.Count,
      version: item.Version,
      hidden: amos?.hidden ?? supplement?.show_type === "HIDDEN",
      target: item.Progress,
      ...((amos?.preStage ?? supplement?.prev) === undefined
        ? {}
        : { preStageId: amos?.preStage ?? supplement?.prev }),
      ...(amos?.postStage === undefined ? {} : { postStageId: amos.postStage }),
      trigger,
      partials: amos?.partials ?? [],
    });
  }

  // Nanoka 仅补充 Snap 中不存在的成就，已有条目的基础字段继续使用 Snap。
  for (const category of Object.values(sources.nanoka)) {
    for (const item of category.list) {
      if (snap.has(item.id)) continue;
      const amos = amosAchievements.get(item.id);
      const achievements = achievementsByCategory.get(category.id);
      if (achievements === undefined) {
        throw new Error(`Nanoka 成就 ${item.id} 的分类 ${category.id} 不存在`);
      }
      if (!item.name.trim() || !item.desc.trim()) {
        throw new Error(`Nanoka 成就 ${item.id} 的名称或描述为空`);
      }
      achievements.push({
        id: item.id,
        categoryId: category.id,
        order: item.priority,
        name: item.name,
        description: item.desc,
        reward: item.reward.item_count,
        version: sources.nanokaVersion,
        hidden: amos?.hidden ?? item.show_type === "HIDDEN",
        target: item.param,
        ...((amos?.preStage ?? item.prev) === undefined
          ? {}
          : { preStageId: amos?.preStage ?? item.prev }),
        ...(amos?.postStage === undefined ? {} : { postStageId: amos.postStage }),
        trigger: amos?.trigger ?? { type: item.trigger_config.trigger_type, tasks: [] },
        partials: amos?.partials ?? [],
      });
    }
  }

  const achievementMap = new Map(
    [...achievementsByCategory.values()].flat().map((achievement) => [achievement.id, achievement]),
  );
  for (const achievement of achievementMap.values()) {
    if (achievement.preStageId === undefined) continue;
    const previous = achievementMap.get(achievement.preStageId);
    if (
      previous === undefined ||
      (previous.postStageId !== undefined && previous.postStageId !== achievement.id)
    ) {
      throw new Error(`成就 ${achievement.id} 的前置阶段 ${achievement.preStageId} 无效`);
    }
    previous.postStageId = achievement.id;
  }

  const categories: Array<TGACore.Components.Achievement.AchievementCategory> = [];
  for (const item of sources.categories) {
    const yatta = yattaCategories.get(item.Id);
    if (yatta === undefined) throw new Error(`成就分类 ${item.Id} 缺少 Yatta 数据`);
    const achievements = achievementsByCategory.get(item.Id) ?? [];
    achievements.sort((left, right) => left.order - right.order || left.id - right.id);
    if (achievements.length === 0) throw new Error(`成就分类 ${item.Id} 没有成就`);

    let namecardId: number | null = null;
    if (yatta.finishReward !== null) {
      const rewardIds = Object.keys(yatta.finishReward);
      if (rewardIds.length !== 1)
        throw new Error(`成就分类 ${item.Id} 的 Yatta 名片奖励数量不是 1`);
      namecardId = Number(rewardIds[0]);
      const namecard = namecards.get(namecardId);
      if (!Number.isInteger(namecardId) || namecard === undefined) {
        throw new Error(`成就分类 ${item.Id} 的名片 ${rewardIds[0]} 不存在于 Snap.Metadata`);
      }
      if (yatta.finishReward[rewardIds[0]].icon !== namecard.Icon) {
        throw new Error(`成就分类 ${item.Id} 的名片图标与 Snap.Metadata 不一致`);
      }
    }
    categories.push({
      id: item.Id,
      key: CATEGORY_KEYS[item.Id] ?? `category_${item.Id}`,
      order: item.Order,
      name: item.Name,
      version: getMaxVersion(achievements.map((achievement) => achievement.version)),
      totalReward: achievements.reduce((total, achievement) => total + achievement.reward, 0),
      namecardId,
      icon: item.Icon,
      achievements,
    });
  }
  categories.sort((left, right) => left.order - right.order || left.id - right.id);
  const catalog: TGACore.Components.Achievement.AchievementCatalog = {
    categories,
    gameVersion: getMaxVersion(categories.map((category) => category.version)),
    schemaVersion: 2,
  };
  validateAchievementCatalog(catalog);
  return catalog;
}

/**
 * 根据 ID 建立唯一索引。
 * @since 2.7.0
 * @typeParam T - 来源条目的类型
 * @param items - 来源列表
 * @param getId - 获取条目 ID
 * @param label - 错误中的来源名称
 * @returns 唯一 ID 索引
 */
function createUniqueMap<T>(
  items: ReadonlyArray<T>,
  getId: (item: T) => number,
  label: string,
): Map<number, T> {
  const result = new Map<number, T>();
  for (const item of items) {
    const id = getId(item);
    if (result.has(id)) throw new Error(`${label} ID ${id} 重复`);
    result.set(id, item);
  }
  return result;
}

/**
 * 获取非空版本列表中的最大版本。
 * @since 2.7.0
 * @param versions - 点分数字版本列表
 * @returns 最新版本
 */
function getMaxVersion(versions: ReadonlyArray<string>): string {
  if (versions.length === 0) throw new Error("无法从空列表计算版本");
  return versions.reduce((max, version) => (compareVersions(version, max) > 0 ? version : max));
}
