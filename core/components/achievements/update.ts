/**
 * @file core components achievement update.ts
 * @description 名片组件数据更新
 * @since 2.4.0
 */
import process from "node:process";

import fs from "fs-extra";

import { jsonDetailDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck } from "../../utils/fileCheck.ts";

logger.init();
Counter.Init("[components][achievement][update]");
logger.default.info("[components][achievement][update] 运行 update.ts");

// 检测文件是否存在
if (!fileCheck(jsonDetailDir.series.out, false)) {
  logger.default.error("[components][achievement][update] achievementSeries.json 不存在");
  logger.console.info("[components][achievement][update] 请先运行 convert.ts");
  process.exit(1);
}
if (!fileCheck(jsonDetailDir.namecard, false)) {
  logger.default.error("[components][achievement][update] namecard.json 不存在");
  logger.console.info("[components][achievement][update] 请先运行 namecard/convert.ts");
  process.exit(1);
}

// 读取文件
const namecardData: TGACore.Components.Namecard.ConvertData[] = (
  await fs.readJson(jsonDetailDir.namecard)
).filter((item: TGACore.Components.Namecard.ConvertData) => item.type === "成就");
const seriesData: TGACore.Components.Achievement.ConvertSeries[] = await fs.readJson(
  jsonDetailDir.series.out,
);

// 更新数据
Counter.Reset(seriesData.length);
seriesData.forEach((series) => {
  if (series.name === "天地万象" || series.name === "心跳的记忆") {
    logger.console.mark(
      `[components][achievement][update] 成就系列 ${series.name} 不存在名片，跳过`,
    );
    Counter.Skip();
    return;
  }
  if (series.card !== "") {
    logger.console.mark(
      `[components][achievement][update] 成就系列 ${series.name} 已存在名片，跳过`,
    );
    Counter.Skip();
    return;
  }
  const namecard = namecardData.find((item) => item.source.includes(series.name));
  if (namecard === undefined) {
    logger.console.warn(
      `[components][achievement][update] 成就系列 ${series.name} 不存在名片，跳过`,
    );
    Counter.Skip();
    return;
  }
  if (series.card === namecard.name) {
    logger.console.mark(
      `[components][achievement][update] 成就系列 ${series.name} 名片已存在，跳过`,
    );
    Counter.Skip();
    return;
  }
  logger.console.info(
    `[components][achievement][update] 成就系列 ${series.name} 名片更新：${namecard.name}`,
  );
  series.card = namecard.name;
  Counter.Success();
});
seriesData.sort((a, b) => a.order - b.order);
await fs.writeJson(jsonDetailDir.series.out, seriesData);
Counter.End();

logger.default.info(
  `[components][achievement][update] 成就系列名片更新完成，耗时 ${Counter.getTime()}`,
);
