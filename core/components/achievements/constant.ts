/**
 * 成就组件常量
 * @since 2.7.0
 */

import path from "node:path";

import { getAppDirPath } from "@utils/getBasePaths.ts";

export const jsonDir = getAppDirPath("data", "achievement");

export const jsonDetailDir = {
  catalog: path.join(jsonDir.out, "app", "achievements.json"),
  nanoka: path.join(jsonDir.src, "nanoka.json"),
  yatta: path.join(jsonDir.src, "yatta.json"),
};

export const imgDir = getAppDirPath("assets", "achievement");

/**
 * 保留既有导出目录的分类键；其余分类统一使用 category_编号。
 * @since 2.7.0
 */
export const CATEGORY_KEYS: Readonly<Record<number, string>> = {
  0: "wonders_of_the_world",
  1: "mortal_travails_series_i",
  2: "the_art_of_adventure",
  3: "the_heros_journey",
  4: "mondstadt_the_city_of_wind_and_song",
  5: "liyue_the_harbor_of_stone_and_contracts",
  6: "elemental_specialist",
  7: "marksmanship",
  8: "challenger_series_i",
  9: "domains_and_spiral_abyss_series_i",
  10: "olah_series_i",
  11: "snezhnaya_does_not_believe_in_tears_series_i",
  12: "stone_harbors_nostalgia_series_i",
  13: "meetings_in_outrealm_series_i",
  14: "challenger_series_ii",
  15: "challenger_series_iii",
  16: "visitors_on_the_icy_mountain",
  17: "memories_of_the_heart",
  18: "a_realm_beyond_series_i",
  19: "a_realm_beyond_series_ii",
  20: "challenger_series_iv",
  21: "meetings_in_outrealm_series_ii",
  22: "mortal_travails_series_ii",
  23: "a_realm_beyond_series_iii",
  24: "inazuma_the_islands_of_thunder_and_eternity_series_i",
  25: "teyvat_fishing_guide_series_i",
  26: "inazuma_the_islands_of_thunder_and_eternity_series_ii",
  27: "the_chronicles_of_the_sea_of_fog",
  28: "the_light_of_day",
  29: "challenger_series_v",
  30: "chasmlighter",
};
