/**
 * amos-data 可选成就补充来源。
 * @since 2.7.0
 */
import logger from "@tools/logger.ts";

import {
  flattenAchievements,
  getAchievementCategories,
  parseAchievementPartials,
  parseAchievementTrigger,
} from "./utils.ts";

/**
 * 解析已安装的成就补充数据，未安装时返回空列表。
 * @since 2.7.0
 * @returns 隐藏状态、阶段关系、触发任务及可用分步项
 */
function getAchievementSupplements(): Array<TGACore.Plugins.Amos.AchievementSupplement> {
  return flattenAchievements().map((achievement) => {
    const parsed = parseAchievementPartials(achievement.id);
    for (const error of parsed.errors) logger.default.warn(error.message);
    return {
      id: achievement.id,
      categoryId: achievement.categoryId,
      total: achievement.total,
      hidden: achievement.hidden,
      preStage: achievement.preStage,
      postStage: achievement.postStage,
      trigger: parseAchievementTrigger(achievement),
      partials: parsed.partials,
    };
  });
}

const amosTool = {
  supplement: getAchievementSupplements,
  categories: getAchievementCategories,
  flatten: flattenAchievements,
  parsePartials: parseAchievementPartials,
  parseTrigger: parseAchievementTrigger,
};

export default amosTool;
