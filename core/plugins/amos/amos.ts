/**
 * @file core/plugins/amos/amos.ts
 * @description amos-data 插件
 * @since 2.4.0
 */
import { flattenAchievements, parseTrigger } from "./utils.ts";

const amosTool = {
  flattern: flattenAchievements,
  parse: parseTrigger,
};

export default amosTool;
