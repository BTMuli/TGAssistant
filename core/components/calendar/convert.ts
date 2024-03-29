/**
 * @file core components calendar convert.ts
 * @description 日历组件数据转换
 * @since 2.0.1
 */

import process from "node:process";

import fs from "fs-extra";

import { imgDir, jsonDetailDir, jsonDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";
import { getHutaoWeapon } from "../../utils/typeTrans.ts";

logger.init();
logger.default.info("[components][calendar][convert] 运行 convert.ts");

if (
  !fileCheck(jsonDetailDir.amber, false) ||
  !fileCheck(jsonDetailDir.mys, false) ||
  !fileCheck(jsonDetailDir.material, false)
) {
  logger.default.error("[components][calendar][convert] 日历元数据文件不存在");
  logger.console.info("[components][calendar][convert] 请执行 download.ts");
  process.exit(1);
}

// 前置检查
fileCheckObj(jsonDir);
fileCheckObj(imgDir);

const converData: TGACore.Components.Calendar.ConvertData[] = [];
const convertMaterial: TGACore.Components.Calendar.ConvertMaterial[] = [];
const convertMaterialSet = new Set<number>();
const convertSource: TGACore.Components.Calendar.ConvertSource[] = [];
const convertSourceSet = new Set<string>();

// 秘境-掉落对照表
const domainMaterialMap: Record<string, string> = {};
// 秘境-掉落日期对照表，只需要记录最早的日期
const domainDateMap: Record<string, number[]> = {};

Counter.Reset();
// 读取日历元数据
const amberRaw: TGACore.Components.Calendar.RawAmber = await fs.readJson(jsonDetailDir.amber);
const mysRaw: TGACore.Plugins.Observe.WikiChildren[] = await fs.readJson(jsonDetailDir.mys);
const avatarRaw: TGACore.Components.Character.RawHutaoItem[] = await fs.readJson(
  jsonDetailDir.character,
);
const weaponRaw: TGACore.Components.Weapon.RawHutaoItem[] = await fs.readJson(jsonDetailDir.weapon);
const materialRaw: TGACore.Components.Calendar.RawHutaoMaterial[] = await fs.readJson(
  jsonDetailDir.material,
);

// 处理 amber.json 添加 convertSource、convertMaterial、
logger.console.info("[components][calendar][convert] 处理 amber.json");
logger.console.info("[components][calendar][convert] 处理周一的数据");
Object.values(amberRaw.data.monday).forEach((value) => {
  measureAmber(value, TGACore.Constant.Week.monday);
});
logger.console.info("[components][calendar][convert] 处理周二的数据");
Object.values(amberRaw.data.tuesday).forEach((value) => {
  measureAmber(value, TGACore.Constant.Week.tuesday);
});
logger.console.info("[components][calendar][convert] 处理周三的数据");
Object.values(amberRaw.data.wednesday).forEach((value) => {
  measureAmber(value, TGACore.Constant.Week.wednesday);
});
logger.console.info("[components][calendar][convert] 处理周四的数据");
Object.values(amberRaw.data.thursday).forEach((value) => {
  measureAmber(value, TGACore.Constant.Week.thursday);
});
logger.console.info("[components][calendar][convert] 处理周五的数据");
Object.values(amberRaw.data.friday).forEach((value) => {
  measureAmber(value, TGACore.Constant.Week.friday);
});
logger.console.info("[components][calendar][convert] 处理周六的数据");
Object.values(amberRaw.data.saturday).forEach((value) => {
  measureAmber(value, TGACore.Constant.Week.saturday);
});
logger.console.info("[components][calendar][convert] 处理周日的数据");
Object.values(amberRaw.data.sunday).forEach((value) => {
  measureAmber(value, TGACore.Constant.Week.sunday);
});

// 处理 character.json 添加 convertData
logger.console.info("[components][calendar][convert] 处理 character.json");
for (const avatar of avatarRaw) {
  // 获取所需材料
  const total = avatar.CultivationItems.find((item) => convertMaterialSet.has(item));
  if (total === undefined) {
    throw new Error(`[components][calendar][convert] 未找到角色 ${avatar.Name} 的培养材料`);
  }
  // 根据 total 找到对应秘境
  let domain: string | undefined;
  Object.keys(domainMaterialMap).forEach((value) => {
    if (domainMaterialMap[value].includes(total.toString())) {
      domain = value;
    }
  });
  if (domain === undefined) {
    throw new Error(`[components][calendar][convert] 未找到角色 ${avatar.Name} 的培养材料所需秘境`);
  }
  // 获取秘境的掉落日期
  const dropDays = domainDateMap[domain];
  // 获取秘境对应 source
  const source = convertSource.find((value) => value.name === domain);
  if (source === undefined) {
    throw new Error(
      `[components][calendar][convert] 未找到角色 ${avatar.Name} 的培养材料所需秘境的来源`,
    );
  }
  // 获取材料数据
  const materials: TGACore.Components.Calendar.ConvertMaterial[] = [];
  avatar.CultivationItems.forEach((item) => {
    if (convertMaterialSet.has(item)) {
      convertMaterial.forEach((value) => {
        const len = item - value.id;
        if (len === 0 || len === 1 || len === 2) {
          materials.push(value);
        }
      });
    }
  });
  const avatarStar = avatar.Quality === 105 ? 5 : avatar.Quality;
  const avatarWeapon = getHutaoWeapon(avatar.Weapon);
  const convertData: TGACore.Components.Calendar.ConvertData = {
    id: avatar.Id,
    contentId: 0,
    dropDays,
    name: avatar.Name,
    itemType: TGACore.Components.Calendar.ItemType.character,
    star: avatarStar,
    bg: `/icon/bg/${avatarStar}-Star.webp`,
    weaponIcon: `/icon/weapon/${avatarWeapon}.webp`,
    elementIcon: `/icon/element/${avatar.FetterInfo.VisionBefore}元素.webp`,
    icon: `/WIKI/character/${avatar.Id}.webp`,
    materials,
    source,
  };
  converData.push(convertData);
  logger.console.info(`[components][calendar][convert] 添加角色 ${avatar.Name} 的日历数据`);
}

// 处理 weapon.json 添加 convertData
logger.console.info("[components][calendar][convert] 处理 weapon.json");
for (const weapon of weaponRaw) {
  // 获取所需材料
  const total = weapon.CultivationItems.find((item) => convertMaterialSet.has(item));
  if (total === undefined) {
    throw new Error(`[components][calendar][convert] 未找到武器 ${weapon.Name} 的培养材料`);
  }
  // 根据 total 找到对应秘境
  let domain: string | undefined;
  Object.keys(domainMaterialMap).forEach((value) => {
    if (domainMaterialMap[value].includes(total.toString())) {
      domain = value;
    }
  });
  if (domain === undefined) {
    throw new Error(`[components][calendar][convert] 未找到武器 ${weapon.Name} 的培养材料所需秘境`);
  }
  // 获取秘境的掉落日期
  const dropDays = domainDateMap[domain];
  // 获取秘境对应 source
  const source = convertSource.find((value) => value.name === domain);
  if (source === undefined) {
    throw new Error(
      `[components][calendar][convert] 未找到武器 ${weapon.Name} 的培养材料所需秘境的来源`,
    );
  }
  // 获取材料数据
  const materials: TGACore.Components.Calendar.ConvertMaterial[] = [];
  weapon.CultivationItems.forEach((item) => {
    if (convertMaterialSet.has(item)) {
      convertMaterial.forEach((value) => {
        const len = item - value.id;
        if (len === 0 || len === 1 || len === 2 || len === 3) {
          materials.push(value);
        }
      });
    }
  });
  const convertData: TGACore.Components.Calendar.ConvertData = {
    id: weapon.Id,
    contentId: 0,
    dropDays,
    name: weapon.Name,
    itemType: TGACore.Components.Calendar.ItemType.weapon,
    star: weapon.RankLevel,
    bg: `/icon/bg/${weapon.RankLevel}-Star.webp`,
    weaponIcon: `/icon/weapon/${getHutaoWeapon(weapon.WeaponType)}.webp`,
    icon: `/WIKI/weapon/${weapon.Id}.webp`,
    materials,
    source,
  };
  converData.push(convertData);
  logger.console.info(`[components][calendar][convert] 添加武器 ${weapon.Name} 的日历数据`);
}

// 处理 mys.json 添加 contentId
Counter.addTotal(converData.length);
const mysAvatar = mysRaw.find((item) => item.name === "角色");
const mysWeapon = mysRaw.find((item) => item.name === "武器");
if (mysAvatar === undefined || mysWeapon === undefined) {
  throw new Error("[components][calendar][convert] 未找到 角色 或 武器 的观测枢数据");
}
logger.console.info("[components][calendar][convert] 处理 mys.json");
for (const item of converData) {
  if (item.itemType === TGACore.Components.Calendar.ItemType.character) {
    const findIndex = mysAvatar.list.findIndex((value) => value.title === item.name);
    if (findIndex === -1) {
      logger.default.warn(`[components][calendar][convert] 未找到角色 ${item.name} 的观测枢数据`);
      Counter.Fail();
      continue;
    }
    item.contentId = mysAvatar.list[findIndex].content_id;
    logger.console.info(`[components][calendar][convert] 添加角色 ${item.name} 的观测枢数据`);
    Counter.Success();
  } else if (item.itemType === TGACore.Components.Calendar.ItemType.weapon) {
    const findIndex = mysWeapon.list.findIndex((value) => value.title === item.name);
    if (findIndex === -1) {
      logger.default.warn(`[components][calendar][convert] 未找到武器 ${item.name} 的观测枢数据`);
      Counter.Fail();
      continue;
    }
    item.contentId = mysWeapon.list[findIndex].content_id;
    logger.console.info(`[components][calendar][convert] 添加武器 ${item.name} 的观测枢数据`);
    Counter.Success();
  }
}
converData.map((item) => item.materials.sort((a, b) => a.star - b.star));
converData.sort((a, b) => {
  // 先角色后武器
  if (a.itemType !== b.itemType) {
    return a.itemType.localeCompare(b.itemType);
  }
  // 星级降序
  if (a.star !== b.star) {
    return b.star - a.star;
  }
  // 角色按元素、地区、武器排序
  if (
    a.itemType === TGACore.Components.Calendar.ItemType.character &&
    b.itemType === TGACore.Components.Calendar.ItemType.character &&
    a.elementIcon !== b.elementIcon
  ) {
    return a.elementIcon > b.elementIcon ? 1 : -1;
  }
  if (
    a.itemType === TGACore.Components.Calendar.ItemType.weapon &&
    b.itemType === TGACore.Components.Calendar.ItemType.weapon &&
    a.weaponIcon !== b.weaponIcon
  ) {
    return a.weaponIcon > b.weaponIcon ? 1 : -1;
  }
  return a.source.index - b.source.index;
});
await fs.writeJson(jsonDetailDir.out, converData, { spaces: 2 });
Counter.End();
logger.default.info("[components][calendar][convert] 观测枢数据处理完成");
Counter.Output();

logger.default.info("[components][calendar][convert] convert.ts 运行完成");
Counter.EndAll();

/**
 * @description 处理 amber.json
 * @since 2.0.0
 * @param {TGACore.Components.Calendar.RawAmberItem} value 元数据
 * @param {TGACore.Constant.Week} week 星期
 * @return {void}
 */
function measureAmber(
  value: TGACore.Components.Calendar.RawAmberItem,
  week: TGACore.Constant.Week,
): void {
  const domain = value.name.split("：")[1];
  // 分析 source 是否记录
  if (!convertSourceSet.has(value.name)) {
    const total = getArrayTotal(value.reward);
    if (domainMaterialMap[domain] === undefined) {
      domainMaterialMap[domain] = total;
      logger.console.info(`[components][calendar][convert] 添加秘境 ${domain} 的掉落材料`);
    } else {
      if (domainMaterialMap[domain] !== total) {
        throw new Error(`[components][calendar][convert] 秘境 ${domain} 的掉落材料不一致`);
      }
    }
    const nation = getAmbetNation(value.city);
    convertSource.push({
      index: value.city,
      area: nation,
      name: domain,
      icon: `/icon/nation/${nation}.webp`,
    });
    convertSourceSet.add(value.name);
    logger.console.info(`[components][calendar][convert] 添加秘境来源 ${value.name}`);
  }
  value.reward.forEach((item) => {
    if (!convertMaterialSet.has(item) && item > 100000) {
      const material = materialRaw.find((value) => value.Id === item);
      if (material === undefined) {
        throw new Error(`[components][calendar][convert] 未找到掉落 ${item}`);
      }
      convertMaterial.push({
        id: material.Id,
        name: material.Name,
        star: material.RankLevel,
        starIcon: `/icon/star/${material.RankLevel}.webp`,
        bg: `/icon/bg/${material.RankLevel}-Star.webp`,
        icon: `/icon/material/${material.Id}.webp`,
      });
      convertMaterialSet.add(item);
      logger.console.info(`[components][calendar][convert] 添加秘境掉落 ${item}`);
    }
  });
  if (domainDateMap[domain] === undefined) {
    domainDateMap[domain] = [];
    domainDateMap[domain].push(getAmberWeek(week));
    logger.console.info(`[components][calendar][convert] 添加秘境 ${domain} 的掉落日期 ${week}`);
  } else {
    domainDateMap[domain].push(getAmberWeek(week));
    logger.console.info(`[components][calendar][convert] 更新秘境 ${domain} 的掉落日期 ${week}`);
  }
}

/**
 * @description 获取秘境所在的国家
 * @since 2.0.0
 * @param {TGACore.Constant.NationIndex} index 国家索引
 * @return {TGACore.Constant.NationType} 国家
 */
function getAmbetNation(index: TGACore.Constant.NationIndex): TGACore.Constant.NationType {
  switch (index) {
    case TGACore.Constant.NationIndex.Mondstadt:
      return TGACore.Constant.NationType.Mondstadt;
    case TGACore.Constant.NationIndex.Liyue:
      return TGACore.Constant.NationType.Liyue;
    case TGACore.Constant.NationIndex.Inazuma:
      return TGACore.Constant.NationType.Inazuma;
    case TGACore.Constant.NationIndex.Sumeru:
      return TGACore.Constant.NationType.Sumeru;
    case TGACore.Constant.NationIndex.Fontaine:
      return TGACore.Constant.NationType.Fontaine;
  }
}

/**
 * @description 获取秘境所在的星期
 * @since 2.0.0
 * @param {TGACore.Constant.Week} week 星期
 * @return {TGACore.Constant.WeekIndex} 星期索引
 */
function getAmberWeek(week: TGACore.Constant.Week): TGACore.Constant.WeekIndex {
  switch (week) {
    case TGACore.Constant.Week.monday:
      return TGACore.Constant.WeekIndex.monday;
    case TGACore.Constant.Week.tuesday:
      return TGACore.Constant.WeekIndex.tuesday;
    case TGACore.Constant.Week.wednesday:
      return TGACore.Constant.WeekIndex.wednesday;
    case TGACore.Constant.Week.thursday:
      return TGACore.Constant.WeekIndex.thursday;
    case TGACore.Constant.Week.friday:
      return TGACore.Constant.WeekIndex.friday;
    case TGACore.Constant.Week.saturday:
      return TGACore.Constant.WeekIndex.saturday;
    case TGACore.Constant.Week.sunday:
      return TGACore.Constant.WeekIndex.sunday;
  }
}

/**
 * @description 获取数组中所有大于 1000000 的值的和
 * @since 2.0.0
 * @param {number[]} array 数组
 * @return {number} 和
 */
function getArrayTotal(array: number[]): string {
  const res = [];
  for (const item of array) {
    if (item > 100000) {
      res.push(item);
    }
  }
  res.sort((a, b) => a - b);
  return res.join("-");
}
