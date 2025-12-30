/**
 * 角色组件数据转换
 * @since 2.5.0
 */
import path from "node:path";
import process from "node:process";

import hutaoTool from "@hutao/hutao.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import fs from "fs-extra";
import sharp from "sharp";

import { imgDir, jsonDetailDir, jsonDir } from "./constant.ts";
import { str2utc8 } from "./utils.ts";

logger.init();
Counter.Init("[components][character][convert]");
logger.default.info("[components][character][convert] 运行 convert.ts");

// 前置检查
if (!fileCheck(jsonDetailDir.mys, false) || !fileCheck(jsonDetailDir.yatta, false)) {
  logger.default.error("[components][character][convert] 角色元数据文件不存在");
  logger.console.info("[components][character][convert] 请执行 download.ts");
  process.exit(1);
}

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

const converData: Array<TGACore.Components.Character.Character> = [];
const meta = hutaoTool.read<Record<string, string>>(hutaoTool.enum.file.Meta);
const paramList = hutaoTool.readIds(meta);
// 处理 hutao.json
logger.console.info("[components][character][convert] 第一次处理：通过 hutao.json");
Counter.Reset(paramList.length);
for (const param of paramList) {
  const check = hutaoTool.check(hutaoTool.enum.file.Avatar, param);
  if (!check) {
    logger.default.error(`[components][character][conver] 角色${param}元数据文件不存在`);
    Counter.Fail();
    continue;
  }
  const rawAvatar = hutaoTool.read<TGACore.Plugins.Hutao.Avatar.FullInfo>(
    hutaoTool.enum.file.Avatar,
    param,
  );
  const avatar: TGACore.Components.Character.Character = {
    id: rawAvatar.Id,
    contentId: 0,
    name: rawAvatar.Name,
    title: rawAvatar.FetterInfo.Title,
    area: hutaoTool.enum.area(rawAvatar.FetterInfo.Association),
    birthday: [rawAvatar.FetterInfo.BirthMonth, rawAvatar.FetterInfo.BirthDay],
    star: rawAvatar.Quality === 105 ? 5 : rawAvatar.Quality,
    element: rawAvatar.FetterInfo.VisionBefore,
    release: str2utc8(rawAvatar.BeginTime),
    weapon: hutaoTool.enum.transW(rawAvatar.Weapon),
    nameCard: rawAvatar.NameCard.Name,
  };
  converData.push(avatar);
  logger.console.mark(`[components][character][convert] 角色 ${rawAvatar.Id} 转换完成`);
}
Counter.End();
logger.default.info(`[components][character][convert] 第一次处理完成，耗时 ${Counter.getTime()}`);

// 处理 mys.json，添加 contentId
logger.console.info("[components][character][convert] 第二次处理：通过 mys.json 添加 contentId");

Counter.Reset();
const mysRaw: Array<TGACore.Plugins.Mys.WikiItem> = await fs.readJson(jsonDetailDir.mys);

for (const item of mysRaw) {
  const index = converData.findIndex(
    (value) => value.name === item.title || `${value.name}【预告】` === item.title,
  );
  if (index === -1) {
    if (item.title.trim().startsWith("旅行者")) {
      const lumineList = [4073, 505505, 505498, 505496, 505497, 505504];
      const element = item.title.trim().split("·").pop() ?? "";
      const isLumine = lumineList.includes(item.content_id);
      const character: TGACore.Components.Character.Character = {
        id: isLumine ? 10000007 : 10000005,
        contentId: item.content_id,
        name: isLumine ? `荧·${element}` : `空·${element}`,
        title: "",
        area: "主角",
        birthday: [0, 0],
        star: 5,
        element: element,
        release: "",
        weapon: "单手剑",
        nameCard: "",
      };
      converData.push(character);
      logger.default.info(`[components][character][convert] 添加遗漏角色 ${item.title} 数据`);
    }
    continue;
  }
  converData[index].contentId = item.content_id;
  logger.console.mark(`[components][character][convert] 角色 ${item.title} 添加 contentId 完成`);
}

// 添加奇偶数据
converData.push({
  id: 10000117,
  contentId: 506960,
  name: "奇偶·男性",
  title: "",
  area: "主角",
  birthday: [0, 0],
  star: 5,
  element: "火",
  release: "",
  weapon: "单手剑",
  nameCard: "",
});
converData.push({
  id: 10000118,
  contentId: 506961,
  name: "奇偶·女性",
  title: "",
  area: "主角",
  birthday: [0, 0],
  star: 5,
  element: "火",
  release: "",
  weapon: "单手剑",
  nameCard: "",
});

// 获取没有 contentId 的角色
const noContentId = converData.filter((item) => item.contentId === 0);
if (noContentId.length > 0) {
  logger.default.warn("[components][character][convert] 以下角色没有 contentId");
  for (const item of noContentId) {
    logger.default.warn(`[components][character][convert] ${item.id}·${item.name}`);
  }
}
// 排序，写入
converData.sort((a, b) => (a.star === b.star ? b.id - a.id : b.star - a.star));
fs.writeJSONSync(jsonDetailDir.out, converData);
Counter.End();
logger.default.info(`[components][character][convert] 第二次处理完成，耗时 ${Counter.getTime()}`);

// 处理图片数据
logger.console.info("[components][character][convert] 第三次处理：处理图片数据");
Counter.Reset(converData.length);
for (const item of converData) {
  const srcPath = path.join(imgDir.src, `${item.id}.png`);
  const outPath = path.join(imgDir.out, `${item.id}.webp`);
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
