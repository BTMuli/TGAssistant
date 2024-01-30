/**
 * @file core components gcg convert.ts
 * @description GCG 组件数据转换
 * @since 2.0.0
 */

import process from "node:process";

import fs from "fs-extra";
import sharp from "sharp";

import { jsonDetailDir, jsonDir, imgDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";
import { getGCGType } from "../../utils/typeTrans.ts";

logger.init();
Counter.Init("[components][gcg][convert]");

// 前置检查
if (!fileCheck(jsonDetailDir.mys, false) || !fileCheck(jsonDetailDir.amber)) {
  logger.default.error("[components][gcg][convert] 卡牌元数据文件不存在");
  logger.console.info("[components][gcg][convert] 请执行 download.ts");
  process.exit(1);
}

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

const converData: TGACore.Components.GCG.ConvertData[] = [];

// 处理 amber.json
logger.console.info("[components][gcg][convert] 第一次处理：通过 amber.json");
Counter.Reset();
const amberRaw: TGACore.Plugins.Amber.GCG[] = await fs.readJson(jsonDetailDir.amber);
for (const item of amberRaw) {
  const gcg: TGACore.Components.GCG.ConvertData = {
    id: item.id,
    contentId: 0,
    name: item.name,
    type: getGCGType(item.type),
    icon: `/WIKI/GCG/normal/${item.name}.webp`,
    tags: item.tags,
  };
  converData.push(gcg);
  logger.console.mark(`[components][gcg][convert] 卡牌 ${item.name} 转换完成`);
  Counter.Success();
}
Counter.End();
logger.default.info(`[components][gcg][convert] 第一次处理完成，耗时 ${Counter.getTime()}`);
Counter.Output();

// 处理 mys.json，添加 contentId 跟魔物牌
logger.console.info("[components][gcg][convert] 第二次处理：通过 mys.json");
Counter.Reset();
const mysRaw: TGACore.Plugins.Observe.WikiChildren[] = await fs.readJson(jsonDetailDir.mys);
const mysData: Record<string, TGACore.Plugins.Observe.WikiItem[]> = {
  character: mysRaw.find((item) => item.name === "角色牌")?.list ?? [],
  action: mysRaw.find((item) => item.name === "行动牌")?.list ?? [],
  monster: mysRaw.find((item) => item.name === "魔物牌")?.list ?? [],
};
if (!Object.values(mysData).every((item) => item.length > 0)) {
  logger.default.error("[components][gcg][convert] mys 数据中没有角色牌、行动牌或魔物牌");
  process.exit(1);
}
// 首先处理角色牌跟行动牌，添加 contentId
Counter.addTotal(converData.length);
for (const item of converData) {
  let findIndex = -1;
  let findData: TGACore.Plugins.Observe.WikiItem[] = [];
  if (item.type === TGACore.Components.GCG.CardType.character) {
    findIndex = mysData.character.findIndex((value) => {
      if (value.title === item.name) return true;
      return value.title.includes("·") && value.title.split("·")[1] === item.name;
    });
    findData = mysData.character;
  } else if (item.type === TGACore.Components.GCG.CardType.action) {
    findIndex = mysData.action.findIndex((value) => value.title === item.name);
    findData = mysData.action;
  }
  if (findIndex === -1) {
    logger.default.warn(`[components][gcg][convert] ${item.name} 没有找到对应的 contentId`);
    Counter.Fail();
    continue;
  }
  item.contentId = findData[findIndex].content_id;
  logger.console.mark(`[components][gcg][convert] ${item.name} contentId 添加完成`);
  Counter.Success();
}
// 然后处理魔物牌
Counter.addTotal(mysData.monster.length);
for (const item of mysData.monster) {
  const data: TGACore.Components.GCG.ConvertData = {
    id: 0,
    contentId: item.content_id,
    name: item.title,
    type: TGACore.Components.GCG.CardType.monster,
    icon: `/WIKI/GCG/normal/${item.title}.webp`,
    tags: {},
  };
  converData.push(data);
  logger.console.mark(`[components][gcg][convert] 添加魔物牌 ${item.title} 数据`);
  Counter.Success();
}
converData.sort((a, b) => {
  if (a.type !== b.type) return a.type.localeCompare(b.type);
  if (a.id !== b.id) return a.id - b.id;
  return b.contentId - a.contentId;
});
await fs.writeJSON(jsonDetailDir.out, converData, { spaces: 2 });
Counter.End();
logger.default.info(`[components][gcg][convert] 第二次处理完成，耗时 ${Counter.getTime()}`);
Counter.Output();

// 处理图片数据
logger.console.info("[components][gcg][convert] 第三次处理：处理图片数据");
Counter.Reset(converData.length);
for (const item of converData) {
  const srcPath = `${imgDir.src}/${item.name}.png`;
  const savePath = `${imgDir.out}/${item.name}.webp`;
  if (!fileCheck(srcPath, false)) {
    logger.default.warn(`[components][gcg][convert] ${item.name} 没有图片数据`);
    Counter.Fail();
    continue;
  }
  if (fileCheck(savePath, false)) {
    logger.console.mark(`[components][gcg][convert] ${item.name} 图片已存在`);
    Counter.Skip();
    continue;
  }
  await sharp(srcPath).webp().toFile(savePath);
  logger.default.info(`[components][gcg][convert] ${item.name} 图片转换完成`);
  Counter.Success();
}
Counter.End();
logger.default.info(`[components][gcg][convert] 第三次处理完成，耗时 ${Counter.getTime()}`);
Counter.Output();

logger.default.info("[components][gcg][convert] convert.ts 执行完成");
Counter.EndAll();
