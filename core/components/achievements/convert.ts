/**
 * 成就组件数据转换
 * @since 2.7.0
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
import { buildAchievementCatalog } from "./utils.ts";

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

Counter.Reset();
const seriesRaw = hutaoTool.read<TGACore.Plugins.Hutao.Achievement.RawAchievementGoal>(
  hutaoTool.enum.file.AchievementGoal,
);
const catalog = buildAchievementCatalog({
  achievements: hutaoTool.read<TGACore.Plugins.Hutao.Achievement.RawAchievement>(
    hutaoTool.enum.file.Achievement,
  ),
  categories: seriesRaw,
  namecards: hutaoTool.read<TGACore.Plugins.Hutao.NameCard.RawNameCard>(
    hutaoTool.enum.file.NameCard,
  ),
  yatta: await fs.readJSON(jsonDetailDir.yatta),
  nanoka: await fs.readJSON(jsonDetailDir.nanoka),
  nanokaVersion: NANOKA_VER,
  amos: amosTool.supplement(),
});
const categories = catalog.categories;

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
