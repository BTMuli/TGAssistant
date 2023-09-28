/**
 * @file core components character convert.ts
 * @description 角色组件数据转换
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
Counter.Init("[components][character][convert]");
logger.default.info("[components][character][convert] 运行 convert.ts");

// 前置检查
if (!fileCheck(jsonDetailDir.mys, false) || !fileCheck(jsonDetailDir.hutao, false)) {
  logger.default.error("[components][character][convert] 角色元数据文件不存在");
  logger.console.info("[components][character][convert] 请执行 download.ts");
  process.exit(1);
}

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

const converData: TGACore.Components.Character.ConvertData[] = [];

// 处理 hutao.json
logger.console.info("[components][character][convert] 第一次处理：通过 hutao.json");
Counter.Reset();
const hutaoRaw: TGACore.Components.Character.RawHutaoItem[] = await fs.readJson(
  jsonDetailDir.hutao,
);
for (const item of hutaoRaw) {
  const avatar: TGACore.Components.Character.ConvertData = {
    id: item.Id,
    contentId: 0,
    name: item.Name,
    title: item.FetterInfo.Title,
    birthday: [item.FetterInfo.BirthMonth, item.FetterInfo.BirthDay],
    star: item.Quality === 105 ? 5 : item.Quality,
    element: item.FetterInfo.VisionBefore,
    weapon: getHutaoWeapon(item.Weapon),
    nameCard: "",
  };
  converData.push(avatar);
  logger.console.mark(`[components][character][convert] 角色 ${item.Id} 转换完成`);
}
Counter.End();
logger.default.info(`[components][character][convert] 第一次处理完成，耗时 ${Counter.getTime()}`);

// 处理 mys.json，添加 contentId
logger.console.info("[components][character][convert] 第二次处理：通过 mys.json 添加 contentId");
Counter.Reset();
const mysRaw: TGACore.Plugins.Observe.WikiItem[] = await fs.readJson(jsonDetailDir.mys);
for (const item of mysRaw) {
  const index = converData.findIndex((value) => value.name === item.title);
  if (index === -1) {
    const character: TGACore.Components.Character.ConvertData = {
      id: item.content_id === 4073 ? 10000007 : 10000005,
      contentId: item.content_id,
      name: item.title,
      title: "",
      birthday: [0, 0],
      star: 5,
      element: "",
      weapon: "单手剑",
      nameCard: "",
    };
    if (item.content_id === 4073 || item.content_id === 4074) {
      converData.push(character);
      logger.default.info(`[components][character][convert] 添加遗漏角色 ${item.title} 数据`);
    }
    continue;
  }
  converData[index].contentId = item.content_id;
  logger.console.mark(`[components][character][convert] 角色 ${item.title} 添加 contentId 完成`);
}
// 获取没有 contentId 的角色
const noContentId = converData.filter((item) => item.contentId === 0);
if (noContentId.length > 0) {
  logger.default.warn("[components][character][convert] 以下角色没有 contentId");
  noContentId.forEach((item) => {
    logger.default.warn(`[components][character][convert] ${item.id}·${item.name}`);
  });
}
// 排序，写入
converData.sort((a, b) => {
  if (a.star === b.star) {
    return b.id - a.id;
  }
  return b.star - a.star;
});
fs.writeJSONSync(jsonDetailDir.out, converData, { spaces: 2 });
Counter.End();
logger.default.info(`[components][character][convert] 第二次处理完成，耗时 ${Counter.getTime()}`);

// 处理图片数据
logger.console.info("[components][character][convert] 第三次处理：处理图片数据");
Counter.Reset(converData.length);
for (const item of converData) {
  const srcPath = `${imgDir.src}/${item.id}.png`;
  const outPath = `${imgDir.out}/${item.id}.webp`;
  if (!fileCheck(srcPath, false)) {
    logger.default.warn(`[components][character][convert] 角色 ${item.id} 没有图片数据`);
    Counter.Fail();
    continue;
  }
  if (fileCheck(outPath, false)) {
    logger.console.mark(`[components][character][convert] 角色 ${item.id} 已有图片数据`);
    Counter.Skip();
    continue;
  }
  await sharp(srcPath).webp().toFile(outPath);
  logger.console.info(`[components][character][convert] 角色 ${item.id} 图片转换完成`);
  Counter.Success();
}
Counter.End();
logger.default.info(`[components][character][convert] 第三次处理完成，耗时 ${Counter.getTime()}`);
Counter.Output();

logger.default.info("[components][character][convert] convert.ts 运行完成");
Counter.EndAll();
logger.console.info("[components][character][convert] 请执行 update.ts 更新名片数据");
