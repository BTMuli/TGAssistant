/**
 * @file core/components/wiki/convert.ts
 * @description wiki组件转换器
 * @since 2.0.0
 */

import process from "node:process";

import axios from "axios";
import fs from "fs-extra";
import sharp from "sharp";

import { imageDetail, jsonDetail, jsonDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";
import { readConfig } from "../../utils/readConfig.ts";
import { getHutaoWeapon } from "../../utils/typeTrans.ts";

logger.init();
logger.default.info("[components][wiki][convert] 运行 convert.ts");

// 前置检查
fileCheckObj(jsonDir);
fileCheck(jsonDetail.weapon.out);
fileCheck(jsonDetail.character.out);
const checkObj = {
  character: jsonDetail.character.src,
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
const characterRaw: TGACore.Components.Character.RawHutaoItem[] = await fs.readJSON(
  jsonDetail.character.src,
);
const materialRaw: TGACore.Plugins.Hutao.Material[] = await fs.readJSON(jsonDetail.material);
Counter.addTotal(weaponRaw.length + characterRaw.length);
// 处理角色
for (const character of characterRaw) {
  const outPath = `${jsonDetail.character.out}/${character.Id}.json`;
  if (fileCheck(outPath, false)) {
    logger.console.mark(
      `[components][wiki][convert][c${character.Id}] 角色 ${character.Name} 数据已存在，跳过`,
    );
    Counter.Skip();
    continue;
  }
  const data = transCharacter(character);
  await fs.writeJSON(outPath, data, { spaces: 2 });
  logger.console.info(
    `[components][wiki][convert][c${character.Id}] 角色 ${character.Name} 数据转换完成`,
  );
  Counter.Success();
}
// 处理武器
const amberVersion = readConfig(TGACore.Config.ConfigFileEnum.Constant).amber.version;
for (const weapon of weaponRaw) {
  const outPath = `${jsonDetail.weapon.out}/${weapon.Id}.json`;
  if (fileCheck(outPath, false)) {
    logger.console.mark(
      `[components][wiki][convert][w${weapon.Id}] 武器 ${weapon.Name} 数据已存在，跳过`,
    );
    Counter.Skip();
    continue;
  }
  const data = transWeapon(weapon);
  if (data.id !== 11513) {
    data.story.push(await getWeaponStory(weapon.Id.toString()));
  } else {
    data.story.push(await getWeaponStory("11513_1"));
    data.story.push(await getWeaponStory("11513_2"));
  }
  await fs.writeJSON(outPath, data, { spaces: 2 });
  logger.console.info(
    `[components][wiki][convert][w${weapon.Id}] 武器 ${weapon.Name} 数据转换完成`,
  );
  Counter.Success();
}
Counter.End();

// 处理图像
Counter.Reset();
for (const character of characterRaw) {
  await convertMaterials(character.CultivationItems);
  await convertTalents(character.SkillDepot.Talents);
  await convertTalents(character.SkillDepot.Inherents);
  await convertTalent(character.SkillDepot.EnergySkill);
  await convertConstellations(character.SkillDepot.Skills);
}
for (const weapon of weaponRaw) {
  await convertMaterials(weapon.CultivationItems);
}
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
 * @description 转换角色数据
 * @since 2.0.0
 * @param {TGACore.Components.Character.RawHutaoItem} raw 原始数据
 * @returns {TGACore.Components.Character.WikiItem} 转换后的数据
 */
function transCharacter(
  raw: TGACore.Components.Character.RawHutaoItem,
): TGACore.Components.Character.WikiItem {
  const materials = getMaterials(raw.CultivationItems);
  const tempSkills = [
    ...raw.SkillDepot.Skills,
    raw.SkillDepot.EnergySkill,
    ...raw.SkillDepot.Inherents,
  ];
  const skills: Array<Omit<TGACore.Components.Character.RhisdSkill, "Proud">> = [];
  tempSkills.forEach((skill) => {
    const { Proud, ...rest } = skill;
    skills.push(rest);
  });
  return {
    id: raw.Id,
    name: raw.Name,
    title: raw.FetterInfo.Title,
    description: raw.Description,
    brief: {
      camp: raw.FetterInfo.Native,
      constellation: raw.FetterInfo.ConstellationBefore,
      birth: `${raw.FetterInfo.BirthMonth}月${raw.FetterInfo.BirthDay}日`,
      cv: {
        cn: raw.FetterInfo.CvChinese,
        jp: raw.FetterInfo.CvJapanese,
        en: raw.FetterInfo.CvEnglish,
        kr: raw.FetterInfo.CvKorean,
      },
    },
    star: raw.Quality,
    element: raw.FetterInfo.VisionBefore,
    weapon: getHutaoWeapon(raw.Weapon),
    materials,
    skills,
    constellation: raw.SkillDepot.Talents,
    // todo: costume 衣装
    // todo: food 料理
    talks: raw.FetterInfo.Fetters,
    stories: raw.FetterInfo.FetterStories,
  };
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
 * @since 2.0.0
 * @param {string} id 武器ID
 * @returns {Promise<string>} 武器故事
 */
async function getWeaponStory(id: string): Promise<string> {
  const url = `https://api.ambr.top/v2/CHS/readable/Weapon${id}?vh=${amberVersion}`;
  try {
    const res = await axios.get(url);
    return res.data.data;
  } catch (e) {
    logger.default.warn(`[components][wiki][convert] 获取武器 ${id} 故事失败`);
    return "";
  }
}

/**
 * @description 转换材料图像
 * @since 2.0.0
 * @param {number[]} materials 材料id数组
 * @returns {Promise<void>}
 */
async function convertMaterials(materials: number[]): Promise<void> {
  const imgDir = imageDetail.material;
  for (const material of materials) {
    const oriPath = `${imgDir.src}/${material}.png`;
    const savePath = `${imgDir.out}/${material}.webp`;
    await convertImage(oriPath, savePath, `材料 ${material}`);
  }
}

/**
 * @description 转换天赋图像
 * @since 2.0.0
 * @param {TGACore.Components.Character.RhisdSkill[]} talents 天赋数组
 * @returns {Promise<void>}
 */
async function convertTalents(talents: TGACore.Components.Character.RhisdTalent[]): Promise<void> {
  for (const talent of talents) {
    await convertTalent(talent);
  }
}

/**
 * @description 转换天赋图像
 * @since 2.0.0
 * @param {TGACore.Components.Character.RhisdSkill} talent 天赋
 * @returns {Promise<void>}
 */
async function convertTalent(talent: TGACore.Components.Character.RhisdTalent): Promise<void> {
  const imgDir = imageDetail.talents;
  if (talent.Icon === "") {
    Counter.addTotal();
    logger.default.warn(`[components][wiki][convert][icon] 天赋 ${talent.Name} 无图标`);
    Counter.Skip();
    return;
  }
  const oriPath = `${imgDir.src}/${talent.Icon}.png`;
  const savePath = `${imgDir.out}/${talent.Icon}.webp`;
  await convertImage(oriPath, savePath, `天赋 ${talent.Icon}`);
}

/**
 * @description 转换命座图像
 * @since 2.0.0
 * @param {TGACore.Components.Character.RhisdSkill[]} constellations 命座数组
 * @returns {Promise<void>}
 */
async function convertConstellations(
  constellations: TGACore.Components.Character.RhisdSkill[],
): Promise<void> {
  for (const constellation of constellations) {
    const oriPath = `${imageDetail.constellations.src}/${constellation.Icon}.png`;
    const savePath = `${imageDetail.constellations.out}/${constellation.Icon}.webp`;
    await convertImage(oriPath, savePath, `命座 ${constellation.Icon}`);
  }
}

/**
 * @description 转换图像
 * @since 2.0.0
 * @param {string} oriPath 原始路径
 * @param {string} savePath 保存路径
 * @param {string} name 名称
 * @returns {Promise<void>}
 */
async function convertImage(oriPath: string, savePath: string, name: string): Promise<void> {
  Counter.addTotal();
  if (!fileCheck(oriPath, false)) {
    logger.default.warn(`[components][wiki][convert][icon] ${name} 无图标`);
    Counter.Fail();
    return;
  }
  if (fileCheck(savePath, false)) {
    logger.console.mark(`[components][wiki][convert][icon] ${name} 已存在，跳过`);
    Counter.Skip();
    return;
  }
  await sharp(oriPath).webp().toFile(savePath);
  logger.console.info(`[components][wiki][convert][icon] ${name} 转换完成`);
  Counter.Success();
}
