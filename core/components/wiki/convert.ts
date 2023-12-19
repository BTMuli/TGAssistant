/**
 * @file core/components/wiki/convert.ts
 * @description wiki组件转换器
 * @since 2.0.0
 */

import { join } from "node:path";
import process from "node:process";

import axios from "axios";
import fs from "fs-extra";

import { jsonDetail, jsonDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";
import { getProjConfigPath } from "../../utils/getBasePaths.ts";
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
const materialSet = new Set<{ id: number; name: string }>();
const localMaterialSet = new Set<number>(
  readConfig(TGACore.Config.ConfigFileEnum.Material).material,
);
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
  if (data.id !== 11513) data.story = await getWeaponStory(weapon.Id.toString());
  data.story = [await getWeaponStory("11513_1"), await getWeaponStory("11513_2")];
  await fs.writeJSON(outPath, data, { spaces: 2 });
  logger.console.info(
    `[components][wiki][convert][w${weapon.Id}] 武器 ${weapon.Name} 数据转换完成`,
  );
  Counter.Success();
}
// 更新材料图像
const configFile = join(getProjConfigPath(), "material.yml");
const materialList = Array.from(materialSet).sort((a, b) => a.id - b.id);
for (const material of materialList) {
  await fs.appendFile(configFile, `  - ${material.id} # ${material.name}\n`);
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
    if (!localMaterialSet.has(material.Id)) {
      logger.console.info(`[components][wiki][convert] 添加ID为 ${r} 的材料图像 ${material.Name}`);
      materialSet.add({ id: material.Id, name: material.Name });
      localMaterialSet.add(material.Id);
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
    story: "",
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
