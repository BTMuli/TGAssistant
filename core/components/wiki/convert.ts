/**
 * @file core/components/wiki/convert.ts
 * @description wiki组件转换器
 * @since 2.2.0
 */

import process from "node:process";

import axios from "axios";
import fs from "fs-extra";

import { jsonDetail, jsonDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";
import { readConfig } from "../../utils/readConfig.ts";
import { getHutaoWeapon } from "../../utils/typeTrans.ts";

logger.init();
logger.default.info("[components][wiki][convert] 运行 convert.ts");

// 前置检查
fileCheckObj(jsonDir);
fileCheck(jsonDetail.dir);
const checkObj = {
  weapon: jsonDetail.weapon.src,
  material: jsonDetail.material,
};
if (!fileCheckObj(checkObj, false)) {
  logger.default.error("[components][wiki][convert] wiki元数据文件不存在");
  logger.console.info("[components][wiki][convert] 请执行 download.ts");
  process.exit(1);
}

Counter.Reset();
const weaponRaw: TGACore.Components.Weapon.RawHutaoItem[] = await fs.readJSON(
  jsonDetail.weapon.src,
);
const materialRaw: TGACore.Plugins.Hutao.Material[] = await fs.readJSON(jsonDetail.material);
Counter.addTotal(weaponRaw.length);

// 处理武器
const wikiWeapon: TGACore.Components.Weapon.WikiItem[] = [];
const amberConfig = readConfig("constant").amber;
for (const weapon of weaponRaw) {
  const data = transWeapon(weapon);
  if (data.id !== 11513) {
    data.story.push(await getWeaponStory(weapon.Id.toString()));
  } else {
    data.story.push(await getWeaponStory("11513_1"));
    data.story.push(await getWeaponStory("11513_2"));
  }
  wikiWeapon.push(data);
  logger.console.info(
    `[components][wiki][convert][w${weapon.Id}] 武器 ${weapon.Name} 数据转换完成`,
  );
  Counter.Success();
}
await fs.writeJSON(jsonDetail.weapon.out, wikiWeapon, { spaces: 2 });
Counter.End();

logger.default.info(`[components][wiki][convert] wiki组件转换完成，耗时${Counter.getTime()}`);
Counter.Output();

// 用到的函数
/**
 * @description 获取材料
 * @since 2.0.0
 * @param {number[]} raw 原始数据
 * @returns {TGACore.Components.Calendar.ConvertMaterial[]} 转换后的数据
 */
function getMaterials(raw: number[]): TGACore.Components.Calendar.ConvertMaterial[] {
  const res = [];
  for (const r of raw) {
    const material = materialRaw.find((item) => item.Id === r);
    if (material === undefined) {
      logger.default.warn(`[components][wiki][convert] 缺失ID为 ${r} 的材料数据`);
      continue;
    }
    res.push({
      id: material.Id,
      name: material.Name,
      star: material.RankLevel,
      starIcon: `/icon/star/${material.RankLevel}.webp`,
      bg: `/icon/bg/${material.RankLevel}-Star.webp`,
      icon: `/icon/material/${material.Id}.webp`,
    });
  }
  return res;
}

/**
 * @description 转换武器数据
 * @since 2.0.0
 * @param {TGACore.Components.Weapon.RawHutaoItem} raw 原始数据
 * @returns {TGACore.Components.Weapon.WikiItem} 转换后的数据
 */
function transWeapon(
  raw: TGACore.Components.Weapon.RawHutaoItem,
): TGACore.Components.Weapon.WikiItem {
  const materials = getMaterials(raw.CultivationItems);
  return {
    id: raw.Id,
    name: raw.Name,
    description: raw.Description,
    star: raw.RankLevel,
    weapon: getHutaoWeapon(raw.WeaponType),
    materials,
    affix: raw.Affix,
    story: [],
  };
}

/**
 * @description 获取武器故事
 * @since 2.2.0
 * @param {string} id 武器ID
 * @returns {Promise<string>} 武器故事
 */
async function getWeaponStory(id: string): Promise<string> {
  const url = `${amberConfig.api}CHS/readable/Weapon${id}?vh=${amberConfig.version}`;
  try {
    const res = await axios.get(url);
    return res.data.data;
  } catch (e) {
    logger.default.warn(`[components][wiki][convert] 获取武器 ${id} 故事失败`);
    logger.default.error(e);
    return "";
  }
}
