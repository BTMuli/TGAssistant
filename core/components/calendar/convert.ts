/**
 * @file core/components/calendar/convert.ts
 * @description 日历组件数据转换
 * @since 2.4.0
 * @todo 重构处理逻辑
 */
import process from "node:process";

import hutaoTool from "@hutao/hutao.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import yattaTool from "@yatta/yatta.ts";
import fs from "fs-extra";

import { imgDir, jsonDetailDir, jsonDir } from "./constant.ts";

logger.init();
logger.default.info("[components][calendar][convert] 运行 convert.ts");

if (
  !fileCheck(jsonDetailDir.domain, false) ||
  !fileCheck(jsonDetailDir.mys, false) ||
  !hutaoTool.check(hutaoTool.enum.file.Material)
) {
  logger.default.error("[components][calendar][convert] 日历元数据文件不存在");
  logger.console.info("[components][calendar][convert] 请执行 download.ts");
  process.exit(1);
}

// 前置检查
fileCheckObj(jsonDir);
fileCheckObj(imgDir);

const converData: TGACore.Components.Calendar.CalendarItem[] = [];
const convertMaterial: TGACore.Components.Calendar.Material[] = [];
const convertMaterialSet = new Set<number>();
const convertSource: TGACore.Components.Calendar.Source[] = [];
const convertSourceSet = new Set<string>();

// 秘境-掉落对照表
const domainMaterialMap: Record<string, string> = {};
// 秘境-掉落日期对照表，只需要记录最早的日期
const domainDateMap: Record<string, number[]> = {};

Counter.Reset();

// 读取日历元数据
const amberRaw: TGACore.Plugins.Yatta.DailyDungeon.DailyRes = await fs.readJson(
  jsonDetailDir.domain,
);
const mysRaw: Array<TGACore.Plugins.Mys.WikiChildren> = await fs.readJson(jsonDetailDir.mys);
const weaponRaw = hutaoTool.read<TGACore.Plugins.Hutao.Weapon.RawWeapon>(
  hutaoTool.enum.file.Weapon,
);
const materialRaw = hutaoTool.read<TGACore.Plugins.Hutao.Material.RawMaterial>(
  hutaoTool.enum.file.Material,
);

// 读取角色元数据
const avatarRaw: Array<TGACore.Plugins.Hutao.Avatar.RawAvatar> = [];
const localMeta = hutaoTool.read<Record<string, string>>(hutaoTool.enum.file.Meta);
const filterKey = Object.keys(localMeta).filter((key) =>
  key.startsWith(hutaoTool.enum.file.Avatar),
);
for (const key of filterKey) {
  const param = key.replace(hutaoTool.enum.file.Avatar, "");
  const check = hutaoTool.check(hutaoTool.enum.file.Avatar, param);
  if (!check) {
    logger.default.warn(`[components][calendar][convert] 角色元数据 ${param} 不存在，跳过`);
    continue;
  }
  const res = hutaoTool.read<TGACore.Plugins.Hutao.Avatar.RawAvatar>(
    hutaoTool.enum.file.Avatar,
    param,
  );
  avatarRaw.push(res);
}

// 处理 amber.json 添加 convertSource、convertMaterial、
logger.console.info("[components][calendar][convert] 处理 amber.json");
logger.console.info("[components][calendar][convert] 处理周一的数据");
Object.values(amberRaw.monday).forEach((value) => measureAmber(value, "monday"));
logger.console.info("[components][calendar][convert] 处理周二的数据");
Object.values(amberRaw.tuesday).forEach((value) => measureAmber(value, "tuesday"));
logger.console.info("[components][calendar][convert] 处理周三的数据");
Object.values(amberRaw.wednesday).forEach((value) => measureAmber(value, "wednesday"));
logger.console.info("[components][calendar][convert] 处理周四的数据");
Object.values(amberRaw.thursday).forEach((value) => measureAmber(value, "thursday"));
logger.console.info("[components][calendar][convert] 处理周五的数据");
Object.values(amberRaw.friday).forEach((value) => measureAmber(value, "friday"));
logger.console.info("[components][calendar][convert] 处理周六的数据");
Object.values(amberRaw.saturday).forEach((value) => measureAmber(value, "saturday"));
logger.console.info("[components][calendar][convert] 处理周日的数据");
Object.values(amberRaw.sunday).forEach((value) => measureAmber(value, "sunday"));

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
  const materials: TGACore.Components.Calendar.Material[] = [];
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
  const avatarWeapon = hutaoTool.enum.transW(avatar.Weapon);
  const convertData: TGACore.Components.Calendar.CalendarItem = {
    id: avatar.Id,
    contentId: 0,
    dropDays,
    name: avatar.Name,
    itemType: "character",
    star: avatarStar,
    weapon: avatarWeapon,
    element: avatar.FetterInfo.VisionBefore,
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
  const materials: TGACore.Components.Calendar.Material[] = [];
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
  const convertData: TGACore.Components.Calendar.CalendarItem = {
    id: weapon.Id,
    contentId: 0,
    dropDays,
    name: weapon.Name,
    itemType: "weapon",
    star: weapon.RankLevel,
    weapon: hutaoTool.enum.transW(weapon.WeaponType),
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
  if (item.itemType === "character") {
    const findIndex = mysAvatar.list.findIndex((value) => value.title === item.name);
    if (findIndex === -1) {
      logger.default.warn(`[components][calendar][convert] 未找到角色 ${item.name} 的观测枢数据`);
      Counter.Fail();
      continue;
    }
    item.contentId = mysAvatar.list[findIndex].content_id;
    logger.console.info(`[components][calendar][convert] 添加角色 ${item.name} 的观测枢数据`);
    Counter.Success();
  } else if (item.itemType === "weapon") {
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
  if (a.itemType === "character" && b.itemType === "character" && a.element !== b.element) {
    return a.element > b.element ? 1 : -1;
  }
  if (a.itemType === "weapon" && b.itemType === "weapon" && a.weapon !== b.weapon) {
    return a.weapon > b.weapon ? 1 : -1;
  }
  return a.source.index - b.source.index;
});
await fs.writeJson(jsonDetailDir.out, converData);
Counter.End();
logger.default.info("[components][calendar][convert] 观测枢数据处理完成");
Counter.Output();

logger.default.info("[components][calendar][convert] convert.ts 运行完成");
Counter.EndAll();

/**
 * @description 处理 amber.json
 * @since 2.4.0
 * @param {TGACore.Plugins.Yatta.DailyDungeon.DomainItem} value 元数据
 * @param {TGACore.Plugins.Yatta.DailyDungeon.WeekKey} week 星期
 * @return {void}
 */
function measureAmber(
  value: TGACore.Plugins.Yatta.DailyDungeon.DomainItem,
  week: TGACore.Plugins.Yatta.DailyDungeon.WeekKey,
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
    convertSource.push(getAmberSource(value));
    convertSourceSet.add(value.name);
    logger.console.info(`[components][calendar][convert] 添加秘境来源 ${value.name}`);
  }
  value.reward.forEach((item) => {
    if (!convertMaterialSet.has(item) && item > 100000) {
      const material = materialRaw.find((value) => value.Id === item);
      if (material === undefined) {
        throw new Error(`[components][calendar][convert] 未找到掉落 ${item}`);
      }
      convertMaterial.push({ id: material.Id, name: material.Name, star: material.RankLevel });
      convertMaterialSet.add(item);
      logger.console.info(`[components][calendar][convert] 添加秘境掉落 ${item}`);
    }
  });
  if (domainDateMap[domain] === undefined) {
    domainDateMap[domain] = [];
    domainDateMap[domain].push(yattaTool.enum.week[week]);
    logger.console.info(`[components][calendar][convert] 添加秘境 ${domain} 的掉落日期 ${week}`);
  } else {
    domainDateMap[domain].push(yattaTool.enum.week[week]);
    logger.console.info(`[components][calendar][convert] 更新秘境 ${domain} 的掉落日期 ${week}`);
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
  for (const item of array) if (item > 100000) res.push(item);
  res.sort((a, b) => a - b);
  return res.join("-");
}

/**
 * @description 获取秘境
 * @since 2.4.0
 * @param {TGACore.Plugins.Yatta.DailyDungeon.DomainItem} value 元数据
 * @return {TGACore.Components.Calendar.Source} 秘境
 */
function getAmberSource(
  value: TGACore.Plugins.Yatta.DailyDungeon.DomainItem,
): TGACore.Components.Calendar.Source {
  const indexMap: Record<number, Array<string>> = {
    1: ["霜凝祭坛", "冰封废渊", "沉睡之国", "水光之城", "深没之谷", "渴水的废都"],
    2: ["炽炎祭场", "深炎之底", "焚尽之环", "雷云祭坛", "鸣雷城墟", "古雷试炼场"],
    3: ["初雷幽谷", "真葛废都", "菫染之国", "沉沙之渊", "砂之祭场", "流沙之葬"],
    4: ["律藏", "圆镜", "妙语", "云垢", "引业", "思惑"],
    5: ["琅诵", "旋韵", "箴铭", "匠理", "机思", "奇械"],
    6: ["空华", "转竟", "旋复", "测度", "究观", "冥见"],
    7: ["墟都", "遗荫", "覆巢", "明辉", "祷颂", "祭月"],
  };
  for (const key of Object.keys(indexMap)) {
    const nameMin = value.name.split("：")[1];
    if (indexMap[Number(key)].includes(nameMin)) {
      const index = Number(key);
      const area = yattaTool.nation(index);
      return { index, area, name: nameMin };
    }
  }
  throw new Error(`[components][calendar][convert] 秘境 ${value.name} 的索引不正确`);
}
