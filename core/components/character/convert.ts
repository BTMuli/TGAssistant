/**
 * @file core components character convert.ts
 * @description 角色组件数据转换
 * @since 2.3.0
 */

import process from "node:process";

import fs from "fs-extra";
import sharp from "sharp";

import { imgDir, jsonDetailDir, jsonDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";
import { getHutaoWeapon } from "../../utils/typeTrans.ts";
import path from "node:path";

logger.init();
Counter.Init("[components][character][convert]");
logger.default.info("[components][character][convert] 运行 convert.ts");

// 前置检查
if (!fileCheck(jsonDetailDir.mys, false)) {
  logger.default.error("[components][character][convert] 角色元数据文件不存在");
  logger.console.info("[components][character][convert] 请执行 download.ts");
  process.exit(1);
}

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

const converData: TGACore.Components.Character.ConvertData[] = [];
const amberJson: TGACore.Plugins.Amber.Character[] = await fs.readJson(jsonDetailDir.amber);
const idList: number[] = [];
amberJson.forEach((i) => {
  if (!isNaN(Number(i.id))) idList.push(Number(i.id));
});

// 处理 hutao.json
logger.console.info("[components][character][convert] 第一次处理：通过 hutao.json");
Counter.Reset(idList.length);
for (const id of idList) {
  const filePath = path.join(jsonDir.src, `${id}.json`);
  if (!fs.existsSync(filePath)) {
    logger.default.error(`[components][character][conver] 角色${id}元数据不存在`);
    Counter.Fail();
    continue;
  }
  const item: TGACore.Components.Character.RawHutaoItem = await fs.readJson(filePath);
  const avatar: TGACore.Components.Character.ConvertData = {
    id: item.Id,
    contentId: 0,
    name: item.Name,
    title: item.FetterInfo.Title,
    area: transArea(item.FetterInfo.Association),
    birthday: [item.FetterInfo.BirthMonth, item.FetterInfo.BirthDay],
    star: item.Quality === 105 ? 5 : item.Quality,
    element: item.FetterInfo.VisionBefore,
    weapon: getHutaoWeapon(item.Weapon),
    nameCard: item.NameCard.Name,
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
  const index = converData.findIndex(
    (value) => value.name === item.title || `${value.name}【预告】` === item.title,
  );
  if (index === -1) {
    const character: TGACore.Components.Character.ConvertData = {
      id: item.content_id === 4073 ? 10000007 : 10000005,
      contentId: item.content_id,
      name: item.title.trim(),
      title: "",
      area: "其他",
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
  if (a.star === b.star) return b.id - a.id;
  return b.star - a.star;
});
fs.writeJSONSync(jsonDetailDir.out, converData);
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

/**
 * @description 转换地区
 * @since 2.0.2
 * @param {number} raw 原始数据
 * @returns {string} 转换后的数据
 */
function transArea(raw: number): string {
  const AssocList = [
    "未知",
    "蒙德",
    "璃月",
    "主角",
    "愚人众",
    "稻妻",
    "其他",
    "须弥",
    "枫丹",
    "纳塔",
    "至冬",
  ];
  if (raw >= AssocList.length || raw < 0) {
    return "未知";
  }
  return AssocList[raw];
}
