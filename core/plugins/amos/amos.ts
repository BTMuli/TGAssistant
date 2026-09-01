/**
 * @file core/plugins/amos/amos.ts
 * @description amos-data 插件
 * @since 2.4.0
 */
import {
  flattenAchievements,
  getAchievementCategories,
  parseAchievementPartials,
  parseAchievementTrigger,
} from "./utils.ts";

const amosTool = {
  categories: getAchievementCategories,
  flatten: flattenAchievements,
  parsePartials: parseAchievementPartials,
  parseTrigger: parseAchievementTrigger,
};

export default amosTool;
