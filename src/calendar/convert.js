/**
 * @file calendar convert.js
 * @description 转换原始数据为可用数据
 * @author BTMuli <bt-muli@outlook.com>
 * @since 1.3.0
 */

// Node
import path from "node:path";
import fs from "node:fs";
// TGAssistant
import pathList from "../../root.js";
import { consoleLogger, defaultLogger } from "../tools/logger.js";
import { dirCheck, fileExist } from "../tools/utils.js";

defaultLogger.info("[日历][转换] 开始执行 convert.js");

// 检测源数据文件是否存在
const srcJsonDir = path.resolve(pathList.src.json, "calendar");
const srcList = [
  {
    name: "Amber",
    file: path.resolve(srcJsonDir, "amber.json"),
    data: {},
  },
  {
    name: "Hutao-Avatar",
    file: path.resolve(srcJsonDir, "avatar.json"),
    data: [],
  },
  {
    name: "temp-Weapon",
    file: path.resolve(srcJsonDir, "tempWeapon.json"),
    data: [],
  },
  {
    name: "Hutao-Material",
    file: path.resolve(srcJsonDir, "material.json"),
    data: [],
  },
];
const outList = [
  {
    name: "character",
    file: path.resolve(pathList.out.json, "character.json"),
    data: [],
  },
  {
    name: "weapon",
    file: path.resolve(pathList.out.json, "weapon.json"),
    data: [],
  },
];

srcList.forEach((item) => {
  if (!fileExist(item.file)) {
    consoleLogger.error(`[日历][转换][${item.name}] 源数据文件不存在，请执行 download.js`);
    process.exit(1);
  } else {
    item.data = JSON.parse(fs.readFileSync(item.file, "utf-8"));
    consoleLogger.mark(`[日历][转换][${item.name}] 源数据文件已读取`);
  }
});

outList.forEach((item) => {
  if (!fileExist(item.file)) {
    consoleLogger.warn(`[日历][转换][${item.name}] 文件不存在，请执行 ${item.name}/convert.js`);
    process.exit(1);
  } else {
    item.data = JSON.parse(fs.readFileSync(item.file, "utf-8"));
    consoleLogger.mark(`[日历][转换][${item.name}] 源数据文件已读取`);
  }
});

// 检测保存路径是否存在
const outJsonPath = path.resolve(pathList.out.json, "calendar.json");
dirCheck(pathList.out.json);

// 一些数据
const domains = []; // 副本
const characters = []; // 角色
const weapons = []; // 武器

// 处理副本数据
consoleLogger.info("[日历][转换] 开始处理副本数据");
const cityArr = ["unknown", "蒙德", "璃月", "稻妻", "须弥", "枫丹"];
const dayArr = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
Object.keys(srcList[0].data).forEach((day) => {
  const dayIndex = dayArr.indexOf(day) + 1;
  // 周四与周一相同，周五与周二相同，周六与周三相同，周日全部都行，故只处理周一到周三
  if (dayIndex > 3) return;
  const data = srcList[0].data[day];
  Object.keys(data).forEach((domain) => {
    const domainItem = {
      name: data[domain].name.split("：")[1],
      day: dayIndex,
      city: cityArr[data[domain].city],
      cityIndex: data[domain].city,
      reward: data[domain].reward.filter((item) => item > 100000),
    };
    domains.push(domainItem);
  });
});

// 按照 day 和 cityIndex 排序
domains.sort((a, b) => {
  if (a.day !== b.day) {
    return a.day - b.day;
  } else {
    return a.cityIndex - b.cityIndex;
  }
});

consoleLogger.mark("[日历][转换] 副本数据处理完成");

// 处理角色数据
consoleLogger.info("[日历][转换] 开始处理角色数据");
srcList[1].data.forEach((item) => {
  const cId = item["Id"];
  const cFind = outList[0].data.find((item) => item["id"] === cId);
  if (!cFind) {
    defaultLogger.warn(`[日历][转换] 角色 ${item["Name"]} 不存在`);
    process.exit(1);
  }
  const character = {
    id: cId,
    contentId: cFind["contentId"],
    dropDays: [],
    name: cFind["name"],
    itemType: "character",
    star: cFind["star"],
    bg: `/icon/bg/${cFind["star"]}-Star.webp`,
    weaponIcon: `/icon/weapon/${cFind["weapon"]}.webp`,
    elementIcon: `/icon/element/${cFind["element"]}元素.webp`,
    icon: `/WIKI/character/icon/${cId}.webp`,
    materials: [],
    source: {},
  };
  const materialGet = item["CultivationItems"];
  const sameMaterial = materialGet
    .map((material) => {
      const dFind = domains.find((item) => item["reward"].includes(material));
      if (dFind) return material;
    })
    .filter((item) => item !== undefined);
  const dFind = domains.find((item) => item["reward"].includes(sameMaterial[0]));
  character.dropDays.push(dFind["day"], dFind["day"] + 3, 7);
  character.source = {
    index: dFind["cityIndex"],
    area: dFind["city"],
    name: dFind["name"],
    icon: `/icon/nation/${dFind["city"]}.webp`,
  };
  dFind["reward"].forEach((material) => {
    const mFind = srcList[3].data.find((item) => item["Id"] === material);
    if (!mFind) {
      defaultLogger.warn(`[日历][转换] 材料 ${material} 不存在`);
      return;
    }
    character.materials.push({
      id: material,
      name: mFind["Name"],
      star: mFind["RankLevel"],
      starIcon: `/icon/star/${mFind["RankLevel"]}.webp`,
      bg: `/icon/bg/${mFind["RankLevel"]}-Star.webp`,
      icon: `/icon/material/${material}.webp`,
    });
  });
  // 按照 star 排序
  character.materials.sort((a, b) => {
    return a.star - b.star; // 升序
  });
  characters.push(character);
});

// 处理武器数据
consoleLogger.info("[日历][转换] 开始处理武器数据");
for (const item of srcList[2].data) {
  const wId = item["id"];
  const wFind = outList[1].data.find((item) => item["id"] === wId);
  if (!wFind) {
    defaultLogger.warn(`[日历][转换] 武器 ${item["name"]} 不存在`);
    continue;
  }
  consoleLogger.mark(`[日历][转换] 武器 ${wFind["name"]} 处理中`);
  const weapon = {
    id: wId,
    contentId: wFind["contentId"],
    dropDays: [],
    name: wFind["name"],
    itemType: "weapon",
    star: wFind["star"],
    bg: wFind["bg"],
    weaponIcon: wFind["weaponIcon"],
    elementIcon: undefined,
    icon: wFind["icon"],
    materials: [],
    source: {},
  };
  const materialGet = item["materials"];
  const sameMaterial = materialGet
    .map((material) => {
      const dFind = domains.find((item) => item["reward"].includes(material));
      if (dFind) return material;
    })
    .filter((item) => item !== undefined);
  const dFind = domains.find((item) => item["reward"].includes(sameMaterial[0]));
  weapon.dropDays.push(dFind["day"], dFind["day"] + 3, 7);
  weapon.source = {
    index: dFind["cityIndex"],
    area: dFind["city"],
    name: dFind["name"],
    icon: `/icon/nation/${dFind["city"]}.webp`,
  };
  dFind["reward"].forEach((material) => {
    const mFind = srcList[3].data.find((item) => item["Id"] === material);
    if (!mFind) {
      defaultLogger.warn(`[日历][转换] 材料 ${material} 不存在`);
      return;
    }
    weapon.materials.push({
      id: material,
      name: mFind["Name"],
      star: mFind["RankLevel"],
      starIcon: `/icon/star/${mFind["RankLevel"]}.webp`,
      bg: `/icon/bg/${mFind["RankLevel"]}-Star.webp`,
      icon: `/icon/material/${material}.webp`,
    });
  });
  // 按照 star 排序
  weapon.materials.sort((a, b) => {
    return a.star - b.star; // 升序
  });
  weapons.push(weapon);
}

const calendar = [...characters, ...weapons];

// 按照 itemType、star、element/weapon、source.index 排序
calendar.sort((a, b) => {
  if (a.itemType !== b.itemType) {
    return a.itemType === "character" ? -1 : 1;
  } else if (a.star !== b.star) {
    return b.star - a.star;
  } else if (a.itemType === "character" && a.elementIcon !== b.elementIcon) {
    return a.elementIcon > b.elementIcon ? 1 : -1;
  } else if (a.itemType === "weapon" && a.weaponIcon !== b.weaponIcon) {
    return a.weaponIcon > b.weaponIcon ? 1 : -1;
  } else {
    return a.source.index - b.source.index;
  }
});

fs.writeFileSync(outJsonPath, JSON.stringify(calendar, null, 2));
