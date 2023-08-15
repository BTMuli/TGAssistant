/**
 * @file weapon convert.js
 * @description 转换武器原始数据为可用数据
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

defaultLogger.info("[武器][转换] 开始执行 convert.js");

// 检测原始数据是否存在
const srcJsonAmber = path.join(pathList.src.json, "weapon", "amber.json");
const srcJsonMys = path.join(pathList.src.json, "weapon", "mys.json");

if (!fileExist(srcJsonAmber)) {
  consoleLogger.error("[武器][转换] amber.json 不存在，请执行 download.js");
  process.exit(1);
}
if (!fileExist(srcJsonMys)) {
  consoleLogger.error("[武器][转换] mys.json 不存在，请执行 download.js");
  process.exit(1);
}

// 检测保存路径是否存在
const outJsonDir = pathList.out.json;
const outJsonPath = path.join(pathList.out.json, "weapon.json");
const outImgDir = path.join(pathList.out.img, "weapon");
dirCheck(outJsonDir);
dirCheck(outImgDir);

// 读取原始数据
const amberJson = JSON.parse(fs.readFileSync(srcJsonAmber, "utf-8"));
const mysJson = JSON.parse(fs.readFileSync(srcJsonMys, "utf-8"));
const weaponData = [];
const count = {
  total: 0,
  success: 0,
  fail: 0,
  skip: 0,
};
// 处理 amber.json
consoleLogger.info("[武器][转换] 开始处理 amber.json");
const amberKey = Object.keys(amberJson["items"]);
amberKey.forEach((key) => {
  count.total++;
  const item = amberJson["items"][key];
  // 如果 key 不是数字，跳过
  if (isNaN(Number(key))) {
    count.skip++;
    consoleLogger.warn(`[武器][转换][${key}] ${item["name"]} key 不是数字，跳过`);
    return;
  }
  const weapon = {
    id: Number(key),
    contentId: 0,
    name: item["name"],
    star: item["rank"],
    bg: `/icon/bg/${item["rank"]}-Star.webp`,
    weaponIcon: getAmberWeaponType(item["type"]),
    icon: `/WIKI/weapon/icon/${key}.webp`,
  };
  count.success++;
  consoleLogger.info(`[武器][转换][${key}] ${item["name"]} 数据已添加`);
  weaponData.push(weapon);
});
defaultLogger.info(
  `[武器][转换] amber.json 处理完成，共 ${count.total} 个，成功 ${count.success} 个，失败 ${count.fail} 个，跳过 ${count.skip} 个`,
);
count.success = 0;
count.fail = 0;
count.skip = 0;
// 处理 mys.json
consoleLogger.info("[武器][转换] 开始处理 mys.json，添加 content_id");
weaponData.forEach((weapon) => {
  const mysFind = mysJson.find((item) => item.title === weapon.name);
  if (!mysFind) {
    count.fail++;
    defaultLogger.warn(`[武器][转换][${weapon.id}] ${weapon.name} 未找到 content_id`);
    return;
  }
  weapon.contentId = mysFind.content_id;
  count.success++;
});
defaultLogger.info(
  `[武器][转换] mys.json 处理完成，共添加 ${count.success} 个，失败 ${count.fail} 个`,
);

// 排序
const outData = weaponData.sort((a, b) => b.star - a.star || b.id - a.id);
// 写入文件
fs.writeFileSync(outJsonPath, JSON.stringify(outData, null, 2));
defaultLogger.info(
  `[武器][转换] 写入文件 weapon.json 完成，处理 ${count.total} 个，写入 ${outData.length} 个`,
);
count.success = 0;
count.fail = 0;
count.skip = 0;
// 处理图片
consoleLogger.info("[武器][转换] 开始处理图片");
await Promise.allSettled(
  weaponData.map(async (weapon) => {
    const src = path.join(pathList.src.img, "weapon", `${weapon.id}.png`);
    const out = path.join(pathList.out.img, "weapon", `${weapon.id}.webp`);
    if (!fileExist(src)) {
      count.fail++;
      defaultLogger.error(`[武器][转换][${weapon.id}] ${weapon.name} 源图片不存在`);
      return;
    }
    if (weapon.content_id === 0) {
      defaultLogger.warn(`[武器][转换][${weapon.id}] ${weapon.name} content_id 为空`);
    }
    if (fileExist(out)) {
      count.skip++;
      consoleLogger.mark(`[武器][转换][${weapon.id}] ${weapon.name} 目标图片已存在，跳过`);
      return;
    }
    await sharp(src).png().toFormat("webp").toFile(out);
    consoleLogger.info(`[武器][转换][${weapon.id}] ${weapon.name} 处理完成`);
  }),
);
defaultLogger.info(
  `[武器][转换] 图片处理完成，共处理 ${count.total} 个，成功 ${count.success} 个，失败 ${count.fail} 个，跳过 ${count.skip} 个`,
);
defaultLogger.info("[武器][转换] convert.js 执行完毕");

// 用到的函数

/**
 * @description 获取角色武器
 * @since 1.1.0
 * @param {string} weapon 原始数据中的武器
 * @returns {string} 角色武器
 */
function getAmberWeaponType(weapon) {
  const weaponMap = {
    WEAPON_SWORD_ONE_HAND: "单手剑",
    WEAPON_CLAYMORE: "双手剑",
    WEAPON_POLE: "长柄武器",
    WEAPON_BOW: "弓",
    WEAPON_CATALYST: "法器",
  };
  const weaponGet = weaponMap[weapon];
  return `/icon/weapon/${weaponGet}.webp`;
}
