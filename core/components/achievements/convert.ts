/**
 * 成就组件数据转换
 * @since 2.6.0
 */

import path from "node:path";
import process from "node:process";

import amosTool from "@amos/amos.ts";
import hutaoTool from "@hutao/hutao.ts";
import { NANOKA_VER } from "@nanoka/nanoka.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import fs from "fs-extra";
import sharp from "sharp";

import { imgDir, jsonDetailDir, jsonDir } from "./constant.ts";
import { compareVersions, validateAchievementCatalog } from "./validate.ts";

logger.init();
logger.default.info("[components][achievement][convert] 运行 convert.ts");

fileCheckObj(jsonDir);
if (
  !hutaoTool.check(hutaoTool.enum.file.Achievement) ||
  !hutaoTool.check(hutaoTool.enum.file.AchievementGoal) ||
  !hutaoTool.check(hutaoTool.enum.file.NameCard) ||
  !fileCheck(jsonDetailDir.yatta, false) ||
  !fileCheck(jsonDetailDir.nanoka, false)
) {
  logger.default.error("[components][achievement][convert] 成就源数据文件不存在");
  logger.console.info("[components][achievement][convert] 请执行 download.ts");
  process.exit(1);
}

/** 根据 ID 建立唯一索引。 */
function createUniqueMap<T>(
  items: Array<T>,
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

/** 校验 amos-data 的 ID 均存在于 Snap，且 Snap 新成就有 Nanoka 数据。 */
function assertAchievementSources(
  snap: Map<number, unknown>,
  amos: Map<number, unknown>,
  nanoka: Map<number, unknown>,
): void {
  const amosOnly = Array.from(amos.keys()).filter((id) => !snap.has(id));
  const missingSupplement = Array.from(snap.keys()).filter(
    (id) => !amos.has(id) && !nanoka.has(id),
  );
  if (amosOnly.length === 0 && missingSupplement.length === 0) return;
  throw new Error(
    `成就来源 ID 不一致；仅 amos：${amosOnly.join(",")}；缺少 Nanoka 补充：${missingSupplement.join(",")}`,
  );
}

/** 获取非空版本列表中的最大版本。 */
function getMaxVersion(versions: Array<string>): string {
  if (versions.length === 0) throw new Error("无法从空列表计算版本");
  return versions.reduce((max, version) => {
    return compareVersions(version, max) > 0 ? version : max;
  });
}

Counter.Reset();
const achievementRaw = hutaoTool.read<TGACore.Plugins.Hutao.Achievement.RawAchievement>(
  hutaoTool.enum.file.Achievement,
);
const seriesRaw = hutaoTool.read<TGACore.Plugins.Hutao.Achievement.RawAchievementGoal>(
  hutaoTool.enum.file.AchievementGoal,
);
const yattaRaw: TGACore.Plugins.Yatta.Achievement.AchiRes = await fs.readJSON(jsonDetailDir.yatta);
const nanokaRaw: TGACore.Plugins.Nanoka.Achievement.All = await fs.readJSON(jsonDetailDir.nanoka);
const namecardRaw = hutaoTool.read<TGACore.Plugins.Hutao.NameCard.RawNameCard>(
  hutaoTool.enum.file.NameCard,
);
const amosCategoryRaw = amosTool.categories();
const amosAchievementRaw = amosTool.flatten();

const achievementRawMap = createUniqueMap(achievementRaw, (item) => item.Id, "Snap 成就");
const seriesRawMap = createUniqueMap(seriesRaw, (item) => item.Id, "Snap 成就分类");
const namecardRawMap = createUniqueMap(namecardRaw, (item) => item.Id, "Snap 名片");
const amosCategoryMap = createUniqueMap(amosCategoryRaw, (item) => item.id, "amos 成就分类");
const amosAchievementMap = createUniqueMap(amosAchievementRaw, (item) => item.id, "amos 成就");
const yattaCategoryMap = createUniqueMap(
  Object.values(yattaRaw),
  (item) => item.id,
  "Yatta 成就分类",
);
const nanokaAchievementMap = new Map<number, TGACore.Plugins.Nanoka.Achievement.Detail>();
const nanokaCategoryMap = new Map<number, number>();
for (const category of Object.values(nanokaRaw)) {
  for (const item of category.list) {
    if (nanokaAchievementMap.has(item.id)) throw new Error(`Nanoka 成就 ID ${item.id} 重复`);
    nanokaAchievementMap.set(item.id, item);
    nanokaCategoryMap.set(item.id, category.id);
  }
}
const partialMap = new Map<number, Array<TGACore.Components.Achievement.AchievementPartial>>();
const partialErrors: Array<Error> = [];
for (const achievement of amosAchievementRaw) {
  const result = amosTool.parsePartials(achievement.id);
  partialMap.set(achievement.id, result.partials);
  partialErrors.push(...result.errors);
}
if (partialErrors.length > 0) {
  logger.default.warn(
    `[components][achievement][convert] amos-data 中有 ${partialErrors.length} 个分步项无法解析，已跳过`,
  );
  for (const error of partialErrors) logger.default.warn(error.message);
}
assertAchievementSources(achievementRawMap, amosAchievementMap, nanokaAchievementMap);

const achievementsByCategory = new Map<
  number,
  Array<TGACore.Components.Achievement.AchievementDefinition>
>();
for (const categoryId of seriesRawMap.keys()) achievementsByCategory.set(categoryId, []);
const supplementedAchievements = new Map<
  number,
  TGACore.Components.Achievement.AchievementDefinition
>();

for (const item of achievementRaw) {
  const amosAchievement = amosAchievementMap.get(item.Id);
  const nanokaAchievement = nanokaAchievementMap.get(item.Id);
  if (!seriesRawMap.has(item.Goal)) throw new Error(`成就 ${item.Id} 的分类 ${item.Goal} 不存在`);
  if (
    amosAchievement !== undefined &&
    amosAchievement.categoryId !== item.Goal &&
    nanokaCategoryMap.get(item.Id) !== item.Goal
  ) {
    throw new Error(
      `成就 ${item.Id} 的分类不一致：Snap ${item.Goal} / amos ${amosAchievement.categoryId}`,
    );
  }
  if (
    item.Progress < 1 ||
    (amosAchievement !== undefined &&
      amosAchievement.total !== item.Progress &&
      nanokaAchievement?.param !== item.Progress)
  ) {
    throw new Error(
      `成就 ${item.Id} 的目标不一致：Snap ${item.Progress} / amos ${amosAchievement?.total}`,
    );
  }
  if (amosAchievement === undefined && nanokaAchievement?.param !== item.Progress) {
    throw new Error(`成就 ${item.Id} 的目标与 Nanoka 不一致`);
  }
  if (amosAchievement === undefined && nanokaCategoryMap.get(item.Id) !== item.Goal) {
    throw new Error(`成就 ${item.Id} 的分类与 Nanoka 不一致`);
  }
  if (item.Title.trim() === "" || item.Description.trim() === "") {
    throw new Error(`成就 ${item.Id} 的中文名称或描述为空`);
  }

  const achievement: TGACore.Components.Achievement.AchievementDefinition = {
    id: item.Id,
    categoryId: item.Goal,
    order: item.Order,
    name: item.Title,
    description: item.Description,
    reward: item.FinishReward.Count,
    version: item.Version,
    hidden: amosAchievement?.hidden ?? nanokaAchievement?.show_type === "HIDDEN",
    target: item.Progress,
    ...((amosAchievement?.preStage ?? nanokaAchievement?.prev) === undefined
      ? {}
      : { preStageId: amosAchievement?.preStage ?? nanokaAchievement?.prev }),
    ...(amosAchievement?.postStage === undefined ? {} : { postStageId: amosAchievement.postStage }),
    trigger:
      amosAchievement === undefined
        ? { type: nanokaAchievement!.trigger_config.trigger_type, tasks: [] }
        : amosTool.parseTrigger(amosAchievement),
    partials: partialMap.get(item.Id) ?? [],
  };
  const categoryAchievements = achievementsByCategory.get(item.Goal);
  if (categoryAchievements === undefined) {
    throw new Error(`成就 ${item.Id} 的分类 ${item.Goal} 没有初始化`);
  }
  categoryAchievements.push(achievement);
  if (amosAchievement === undefined) supplementedAchievements.set(item.Id, achievement);
  logger.console.mark(`[components][achievement][convert][${item.Id}] 成就 ${item.Title} 转换完成`);
}

// Nanoka 只补充 Snap 缺少的成就，不覆盖已有成就的字段。
for (const category of Object.values(nanokaRaw)) {
  for (const item of category.list) {
    if (achievementRawMap.has(item.id)) continue;
    const categoryAchievements = achievementsByCategory.get(category.id);
    if (categoryAchievements === undefined) {
      throw new Error(`Nanoka 成就 ${item.id} 的分类 ${category.id} 不存在`);
    }
    if (!item.name.trim() || !item.desc.trim() || item.param < 1) {
      throw new Error(`Nanoka 成就 ${item.id} 的名称、描述或目标无效`);
    }
    const achievement: TGACore.Components.Achievement.AchievementDefinition = {
      id: item.id,
      categoryId: category.id,
      order: item.priority,
      name: item.name,
      description: item.desc,
      reward: item.reward.item_count,
      version: NANOKA_VER,
      hidden: item.show_type === "HIDDEN",
      target: item.param,
      ...(item.prev === undefined ? {} : { preStageId: item.prev }),
      trigger: { type: item.trigger_config.trigger_type, tasks: [] },
      partials: [],
    };
    categoryAchievements.push(achievement);
    supplementedAchievements.set(item.id, achievement);
    logger.console.mark(`[components][achievement][convert][${item.id}] Nanoka 成就补充完成`);
  }
}
for (const achievement of supplementedAchievements.values()) {
  if (achievement.preStageId === undefined) continue;
  const categoryAchievements = achievementsByCategory.get(achievement.categoryId) ?? [];
  const previous = categoryAchievements.find((item) => item.id === achievement.preStageId);
  if (
    previous === undefined ||
    (previous.postStageId !== undefined && previous.postStageId !== achievement.id)
  ) {
    throw new Error(`Nanoka 成就 ${achievement.id} 的前置阶段 ${achievement.preStageId} 无效`);
  }
  previous.postStageId = achievement.id;
}
logger.console.info(
  `[components][achievement][convert] Nanoka 补充 ${supplementedAchievements.size} 条成就`,
);

const categories: Array<TGACore.Components.Achievement.AchievementCategory> = [];
for (const item of seriesRaw) {
  const amosCategory = amosCategoryMap.get(item.Id);
  if (amosCategory === undefined) throw new Error(`成就分类 ${item.Id} 缺少 amos-data 数据`);
  const yattaCategory = yattaCategoryMap.get(item.Id);
  if (yattaCategory === undefined) throw new Error(`成就分类 ${item.Id} 缺少 Yatta 数据`);
  const achievements = achievementsByCategory.get(item.Id) ?? [];
  achievements.sort((left, right) => left.order - right.order || left.id - right.id);
  if (achievements.length === 0) throw new Error(`成就分类 ${item.Id} 没有成就`);

  let namecardId: number | null = null;
  if (yattaCategory.finishReward !== null) {
    const rewardIds = Object.keys(yattaCategory.finishReward);
    if (rewardIds.length !== 1) {
      throw new Error(`成就分类 ${item.Id} 的 Yatta 名片奖励数量不是 1`);
    }
    namecardId = Number(rewardIds[0]);
    const namecard = namecardRawMap.get(namecardId);
    if (!Number.isInteger(namecardId) || namecard === undefined) {
      throw new Error(`成就分类 ${item.Id} 的名片 ${rewardIds[0]} 不存在于 Snap.Metadata`);
    }
    const yattaReward = yattaCategory.finishReward[rewardIds[0]];
    if (yattaReward.icon !== namecard.Icon) {
      throw new Error(
        `成就分类 ${item.Id} 的名片图标不一致：${yattaReward.icon} / ${namecard.Icon}`,
      );
    }
  }

  categories.push({
    id: item.Id,
    key: amosCategory.key.trim() || `category_${item.Id}`,
    order: item.Order,
    name: item.Name,
    version: getMaxVersion(achievements.map((achievement) => achievement.version)),
    totalReward: achievements.reduce((total, achievement) => total + achievement.reward, 0),
    namecardId,
    icon: item.Icon,
    achievements,
  });
  logger.console.mark(`[components][achievement][convert] 成就分类 ${item.Name} 转换完成`);
}
categories.sort((left, right) => left.order - right.order || left.id - right.id);

if (amosCategoryMap.size !== seriesRawMap.size) {
  throw new Error(
    `Snap.Metadata 与 amos-data 成就分类数量不一致：${seriesRawMap.size} / ${amosCategoryMap.size}`,
  );
}
const catalog: TGACore.Components.Achievement.AchievementCatalog = {
  categories,
  gameVersion: getMaxVersion(categories.map((category) => category.version)),
  schemaVersion: 2,
};
validateAchievementCatalog(catalog);

fs.writeJSONSync(jsonDetailDir.catalog, catalog, { spaces: 2 });

const allAchievements = categories.flatMap((category) => category.achievements);
const audit = {
  schemaVersion: catalog.schemaVersion,
  gameVersion: catalog.gameVersion,
  categories: categories.length,
  achievements: allAchievements.length,
  hidden: allAchievements.filter((item) => item.hidden).length,
  progress: allAchievements.filter((item) => item.target > 1).length,
  preStages: allAchievements.filter((item) => item.preStageId !== undefined).length,
  postStages: allAchievements.filter((item) => item.postStageId !== undefined).length,
  triggers: allAchievements.filter((item) => item.trigger.tasks.length > 0).length,
  partials: allAchievements.filter((item) => item.partials.length > 0).length,
};
logger.console.info(`[components][achievement][convert][audit] ${JSON.stringify(audit)}`);
Counter.End();

Counter.Reset(seriesRaw.length);
for (const item of seriesRaw) {
  const srcPath = path.join(imgDir.src, `${item.Icon}.png`);
  const outPath = path.join(imgDir.out, `${item.Icon}.webp`);
  if (!fileCheck(srcPath, false)) {
    logger.default.warn(`[components][achievement][convert] 成就系列 ${item.Name} 没有图片数据`);
    Counter.Fail();
    continue;
  }
  if (fileCheck(outPath, false)) {
    logger.console.mark(`[components][achievement][convert] 成就系列 ${item.Name} 已有图片数据`);
    Counter.Skip();
    continue;
  }
  await sharp(srcPath).webp().toFile(outPath);
  logger.console.info(`[components][achievement][convert] 成就系列 ${item.Name} 图片转换完成`);
  Counter.Success();
}
Counter.End();
logger.default.info(`[components][achievement][convert] 图片处理完成，耗时 ${Counter.getTime()}ms`);
Counter.Output();

logger.default.info(`[components][achievement][convert] 成就转换完成，耗时 ${Counter.getTime()}ms`);
Counter.EndAll();
logger.console.info("[components][achievement][convert] 请执行 update.ts 更新名片数据");
