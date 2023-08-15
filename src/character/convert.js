/**
 * @file character convert.js
 * @description 转换原始数据为可用数据
 * @author BTMuli <bt-muli@outlook.com>
 * @since 1.3.0
 */

// Node
import path from "node:path";
import fs from "node:fs";
import sharp from "sharp";
// TGAssistant
import pathList from "../../root.js";
import { consoleLogger, defaultLogger } from "../tools/logger.js";
import { dirCheck, fileExist } from "../tools/utils.js";

defaultLogger.info("[角色][转换] 开始执行 convert.js");

// 检测原始数据是否存在
const srcJsonMys = path.join(pathList.src.json, "character", "mys.json");
const srcNameCard = path.join(pathList.src.json, "namecard", "namecard.json");
const srcJsonHutao = path.join(pathList.src.json, "character", "hutao.json");

if (!fileExist(srcJsonMys)) {
  consoleLogger.error("[角色][转换] mys.json 不存在，请执行 download.js");
  process.exit(1);
}
if (!fileExist(srcNameCard)) {
  consoleLogger.error("[角色][转换] namecard.json 不存在，请执行 namecard/download.js");
  process.exit(1);
}
if (!fileExist(srcJsonHutao)) {
  consoleLogger.error("[角色][转换] hutao.json 不存在，请执行 download.js");
  process.exit(1);
}

// 检测保存路径是否存在
const outJsonDir = pathList.out.json;
const outJsonPath = path.join(pathList.out.json, "character.json");
const outImgDir = path.join(pathList.out.img, "character");
dirCheck(outJsonDir);
dirCheck(outImgDir);

// 读取原始数据
const mysJson = JSON.parse(fs.readFileSync(srcJsonMys, "utf-8"));
const nameCardJson = JSON.parse(fs.readFileSync(srcNameCard, "utf-8"));
const hutaoJson = JSON.parse(fs.readFileSync(srcJsonHutao, "utf-8"));

const characterData = [];
const characterIdSet = new Set();

const count = {
  total: 0,
  success: 0,
  fail: 0,
  skip: 0,
};

// 处理 hutao.json
consoleLogger.info("[角色][转换] 开始处理 hutao.json");
hutaoJson.forEach((item) => {
  const character = {
    id: item["Id"],
    contentId: 0,
    name: item["Name"],
    title: item["FetterInfo"]["Title"],
    birthday: [item["FetterInfo"]["BirthMonth"], item["FetterInfo"]["BirthDay"]],
    star: item["Quality"] === 105 ? 5 : item["Quality"],
    element: item["FetterInfo"]["VisionBefore"],
    weapon: getHutaoWeapon(item["Weapon"]),
    nameCard: "",
  };
  characterIdSet.add(character["id"]);
  characterData.push(character);
});

// 处理 mys.json
count.success = 0;
count.skip = 0;
consoleLogger.info("[角色][转换] 开始添加 contentId");
const cnSet = new Set();
characterData.forEach((character) => {
  cnSet.add(character["name"]);
});
mysJson.forEach((item) => {
  const character = characterData.find((character) => character["name"] === item["title"]);
  if (!character) {
    if (item["content_id"] === 4073) {
      const character = {
        id: 10000007,
        contentId: 4073,
        name: "旅行者-荧",
        title: "",
        birthday: [0, 0],
        star: 5,
        element: "",
        weapon: "单手剑",
        nameCard: "",
      };
      characterIdSet.add(character["id"]);
      characterData.push(character);
      consoleLogger.warn(`[角色][转换][${character["id"]}] 添加遗漏数据 ${character["name"]}`);
    } else if (item["content_id"] === 4074) {
      const character = {
        id: 10000005,
        contentId: 4074,
        name: "旅行者-空",
        title: "",
        birthday: [0, 0],
        star: 5,
        element: "",
        weapon: "单手剑",
        nameCard: "",
      };
      characterIdSet.add(character["id"]);
      characterData.push(character);
      consoleLogger.warn(`[角色][转换][${character["id"]}] 添加遗漏数据 ${character["name"]}`);
    } else {
      consoleLogger.error(`[角色][转换] 未找到 ${item["title"]} 的数据`);
      count.fail++;
    }
  } else {
    character.contentId = item["content_id"];
    cnSet.delete(character["name"]);
    count.success++;
  }
});
cnSet.forEach((name) => {
  consoleLogger.warn(`[角色][转换] 未找到 ${name} 的 contentId`);
  count.fail++;
});
defaultLogger.info(
  `[角色][转换] contentId 添加完成，共添加 ${count.success} 个，失败 ${count.fail} 个`,
);
// 处理 namecard.json
count.success = 0;
count.fail = 0;
consoleLogger.info("[角色][转换] 开始添加 namecard");
characterData.forEach((character) => {
  // 是否包含角色名或者角色名后两个字
  const nameCardFind = nameCardJson.find(
    (item) =>
      item.source.includes(character["name"]) || item.source.includes(character["name"].slice(-2)),
  );
  if (!nameCardFind) {
    count.fail++;
    defaultLogger.warn(`[角色][转换][${character["id"]}] ${character["name"]} 未找到 namecard`);
    return;
  }
  character.nameCard = nameCardFind["name"];
  count.success++;
});
defaultLogger.info(
  `[角色][转换] namecard 添加完成，共添加 ${count.success} 个，失败 ${count.fail} 个`,
);

// 按照 id 排序
const outData = characterData
  // .filter((item) => item.contentId !== 0)
  .sort((a, b) => b["star"] - a["star"] || b["id"] - a["id"]);
// 写入文件
fs.writeFileSync(outJsonPath, JSON.stringify(outData, null, 2));
defaultLogger.info(
  `[角色][转换] 写入文件 character.json 完成, 处理${characterData.length}个，写入${outData.length}个`,
);
count.success = 0;
count.fail = 0;
consoleLogger.info("[角色][转换] 开始转换图片");
await Promise.allSettled(
  characterData.map(async (character) => {
    const src = path.join(pathList.src.img, "character", `${character["id"]}.png`);
    const out = path.join(outImgDir, `${character["id"]}.webp`);
    if (!fileExist(src)) {
      count.fail++;
      consoleLogger.error(`[角色][转换][${character["id"]}] ${character["name"]} 源图片不存在`);
      return;
    }
    if (character.contentId === 0) {
      defaultLogger.warn(`[角色][转换][${character["id"]}] ${character["name"]} contentId 不存在`);
    }
    if (fileExist(out)) {
      count.skip++;
      consoleLogger.mark(`[角色][转换][${character["id"]}] ${character["name"]} 目标图片已存在`);
      return;
    }
    await sharp(src).png().toFormat("webp").toFile(out);
    consoleLogger.info(`[角色][转换][${character["id"]}] ${character["name"]} 转换完成`);
    count.success++;
  }),
);
defaultLogger.info(
  `[角色][转换] 转换图片完成，共转换 ${count.success} 个，失败 ${count.fail} 个，跳过 ${count.skip} 个`,
);
defaultLogger.info("[角色][转换] convert.js 执行完成");

// 用到的函数
/**
 * @description 获取角色武器
 * @since 1.3.0
 * @param {number} weapon 原始数据中的武器
 * @returns {string} 角色武器
 */
function getHutaoWeapon(weapon) {
  switch (weapon) {
    case 1:
      return "单手剑";
    case 10:
      return "法器";
    case 11:
      return "双手剑";
    case 12:
      return "弓";
    case 13:
      return "长柄武器";
    default:
      defaultLogger.error(`[角色][转换][${weapon}] 未知武器`);
      return "未知武器";
  }
}
