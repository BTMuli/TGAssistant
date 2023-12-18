/**
 * @file core components weapon convert.ts
 * @description 武器组件数据转换
 * @since 2.0.0
 */

import process from "node:process";

import fs from "fs-extra";
import sharp from "sharp";

import { jsonDetailDir, jsonDir, imgDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";
import { getHutaoWeapon } from "../../utils/typeTrans.ts";

logger.init();
Counter.Init("[components][weapon][convert]");
logger.default.info("[components][weapon][convert] 运行 convert.ts");

// 前置检查
if (!fileCheck(jsonDetailDir.mys, false) || !fileCheck(jsonDetailDir.hutao, false)) {
  logger.default.error("[components][weapon][convert] 武器元数据文件不存在");
  logger.console.info("[components][weapon][convert] 请执行 download.ts");
  process.exit(1);
}

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

const converData: TGACore.Components.Weapon.ConvertData[] = [];

// 处理 hutao.json
logger.console.info("[components][weapon][convert] 第一次处理：通过 hutao.json");
Counter.Reset();
const hutaoRaw: TGACore.Components.Weapon.RawHutaoItem[] = await fs.readJson(jsonDetailDir.hutao);
for (const item of hutaoRaw) {
  const weaponType = getHutaoWeapon(item.WeaponType);
  const weapon: TGACore.Components.Weapon.ConvertData = {
    id: item.Id,
    contentId: 0,
    name: item.Name,
    star: item.RankLevel,
    bg: `/icon/bg/${item.RankLevel}-Star.webp`,
    weaponIcon: `/icon/weapon/${weaponType}.webp`,
    icon: `/WIKI/weapon/${item.Id}.webp`,
  };
  converData.push(weapon);
  logger.console.mark(`[components][weapon][convert] 武器 ${item.Id} 转换完成`);
}
Counter.End();
logger.default.info(`[components][weapon][convert] 第一次处理完成，耗时 ${Counter.getTime()}`);

// 处理 mys.json，添加 contentId
logger.console.info("[components][weapon][convert] 第二次处理：通过 mys.json 添加 contentId");
Counter.Reset();
const mysRaw: TGACore.Plugins.Observe.WikiItem[] = await fs.readJson(jsonDetailDir.mys);
for (const item of mysRaw) {
  const index = converData.findIndex((value) => value.name === item.title);
  if (index === -1) {
    continue;
  }
  converData[index].contentId = item.content_id;
  logger.console.mark(`[components][weapon][convert] 武器 ${item.content_id} 添加 contentId`);
}
// 获取没有 contentId 的武器
const noContentId = converData.filter((value) => value.contentId === 0);
if (noContentId.length > 0) {
  logger.default.warn("[components][weapon][convert] 以下武器没有 contentId：");
  noContentId.forEach((item) => {
    logger.default.warn(`[components][weapon][convert] ${item.id}·${item.name}`);
  });
}
converData.sort((a, b) => {
  if (a.star === b.star) {
    return b.id - a.id;
  }
  return b.star - a.star;
});
await fs.writeJson(jsonDetailDir.out, converData, { spaces: 2 });
Counter.End();
logger.default.info(`[components][weapon][convert] 第二次处理完成，耗时 ${Counter.getTime()}`);

// 处理武器图标
logger.console.info("[components][weapon][convert] 第三次处理：处理图片数据");
Counter.Reset(converData.length);
for (const item of converData) {
  const srcPath = `${imgDir.src}/${item.id}.png`;
  const outPath = `${imgDir.out}/${item.id}.webp`;
  if (!fileCheck(srcPath, false)) {
    logger.default.warn(`[components][weapon][convert] 武器 ${item.id} 没有图片数据`);
    Counter.Fail();
    continue;
  }
  if (fileCheck(outPath, false)) {
    logger.console.mark(`[components][weapon][convert] 武器 ${item.id} 已存在`);
    Counter.Skip();
    continue;
  }
  await sharp(srcPath).webp().toFile(outPath);
  logger.console.mark(`[components][weapon][convert] 武器 ${item.id} 转换完成`);
  Counter.Success();
}
Counter.End();
logger.default.info(`[components][weapon][convert] 第三次处理完成，耗时 ${Counter.getTime()}`);
Counter.Output();

logger.default.info("[components][weapon][convert] convert.ts 运行完成");
Counter.EndAll();
