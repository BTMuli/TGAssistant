/**
 * 材料组件转换
 * @since 2.6.0
 */

import path from "node:path";
import process from "node:process";

import hutaoTool from "@hutao/hutao.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import yattaTool from "@yatta/yatta.ts";
import fs from "fs-extra";
import sharp from "sharp";

import { imgDir, jsonDir, wikiDir } from "./constant.ts";
import fetchMaterialIcon from "./utils.ts";

const IGNORE_TYPE_DESCRIPTIONS: ReadonlySet<string> = new Set([
  "命之座激活",
  "奇域经验",
  "功能开启凭证",
  "角色解锁",
  "龙血BUFF",
  "未知武器",
  "任务道具",
  "任务物品",
  "宝箱",
  "食谱",
  "合成产物",
  "纪行经验",
  "礼包",
  "获取燃素",
  "角色装扮",
  "探索资源",
  "鱼",
  "海灯节材料",
  "雪山材料",
  "精炼材料",
  "碎果残块",
  "碎果裂片",
  "碎果细屑",
  "鱼饵",
  "鱼竿",
  "合成图纸",
  "锻造图纸",
  "鱼饵图纸",
  "烟花",
  "臻冰造物外观",
  "头像",
  "摆设套装图纸",
  "摆设图纸",
]);

const KEEP_CONSUMABLE_IDS: ReadonlySet<number> = new Set([
  // 100225 狩猎陷阱
  100225,
  // 101692 光界之印、101693 光界之核
  101692, 101693,
  // 103001-103008 奇卡卡
  103001, 103002, 103003, 103004, 103005, 103006, 103007, 103008,
  // 104201 嬗变之尘
  104201,
  // 105005 祝圣之霜、105006 启圣之尘
  105005, 105006,
  // 107009 脆弱树脂、107012 须臾树脂、107022 净光翎
  107009, 107012, 107022,
  // 113021 异梦溶媒
  113021,
  // 120858/120912/120914/121103/121105/121107 曜石断片
  120858, 120912, 120914, 121103, 121105, 121107,
  // 121279 蛋卷螺栓
  121279,
  // 220001/220002/220032/220057/220086/220103 共鸣石
  220001, 220002, 220032, 220057, 220086, 220103,
  // 220005 口袋锚点、220006 寻仙的美食家、220007 浓缩树脂、220043 四方八方之网
  220005, 220006, 220007, 220043,
]);

const KEEP_CONSUMABLE_NAMES: ReadonlySet<string> = new Set([
  // 当前 Metadata 中暂无对应条目，保留该名称以覆盖后续数据
  "消耗品",
]);

logger.init();
Counter.Init("[components][material][convert]");
logger.default.info("[components][material][convert] 运行 convert.ts");

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

const rawPath = path.join(jsonDir.src, "material.json");
if (!hutaoTool.check(hutaoTool.enum.file.Material)) {
  logger.default.error("[components][material][convert] Metadata 数据文件不存在");
  process.exit(1);
}

const rawYatta: Array<TGACore.Plugins.Yatta.Material.MaterialItem> = fileCheck(rawPath, false)
  ? await fs.readJson(rawPath)
  : [];
if (rawYatta.length === 0) {
  logger.default.warn(
    "[components][material][convert] Yatta 材料索引不存在，继续使用 Metadata 数据转换",
  );
}
const yattaMap = new Map(rawYatta.map((item) => [Number(item.id), item]));
const rawMetadata = hutaoTool.read<TGACore.Plugins.Hutao.Material.FullInfo>(
  hutaoTool.enum.file.Material,
);
const metadataMap = new Map(rawMetadata.map((item) => [item.Id, item]));
const rawList = rawMetadata
  .filter((metadata) => {
    if (IGNORE_TYPE_DESCRIPTIONS.has(metadata.TypeDescription)) {
      logger.console.mark(
        `[components][material][convert][${metadata.Id}] ${metadata.Name} 类型为 ${metadata.TypeDescription}，跳过转换`,
      );
      return false;
    }
    if (
      metadata.TypeDescription === "消耗品" &&
      !KEEP_CONSUMABLE_NAMES.has(metadata.Name) &&
      !KEEP_CONSUMABLE_IDS.has(metadata.Id)
    ) {
      logger.console.mark(
        `[components][material][convert][${metadata.Id}] ${metadata.Name} 类型为消耗品且不在保留列表，跳过转换`,
      );
      return false;
    }
    return true;
  })
  .map((metadata) => ({
    metadata,
    yatta: yattaMap.get(metadata.Id),
  }));
const materialImages = new Map<number, string | Buffer>();
const materialList: typeof rawList = [];
for (const item of rawList) {
  const { metadata } = item;
  const oriPath = path.join(imgDir.src, `${metadata.Id}.png`);
  const outPath = path.join(imgDir.out, `${metadata.Id}.webp`);
  if (fileCheck(outPath, false)) {
    materialList.push(item);
    continue;
  }
  if (fileCheck(oriPath, false)) {
    materialImages.set(metadata.Id, oriPath);
    materialList.push(item);
    continue;
  }
  try {
    materialImages.set(metadata.Id, await fetchMaterialIcon(`${metadata.Icon}.png`));
    materialList.push(item);
    logger.console.info(
      `[components][material][convert][${metadata.Id}] ${metadata.Name} PNG 不存在，已从 Static 获取`,
    );
  } catch (e) {
    logger.default.warn(
      `[components][material][convert][${metadata.Id}] ${metadata.Name} PNG 不存在，跳过 JSON 转换`,
    );
    logger.default.error(
      `[components][material][convert][${metadata.Id}] ${metadata.Name} 图片获取失败，ItemIcon-Minimum 和 ItemIcon 中均不存在`,
    );
    logger.default.error(e);
  }
}
const transJson: Array<TGACore.Components.Material.WikiItem> = [];
// 转换json
for (const item of materialList) {
  const { yatta, metadata } = item;
  const oriPath = path.join(jsonDir.src, `${metadata.Id}.json`);
  let oriData: TGACore.Plugins.Yatta.Material.MaterialDetail | undefined;
  if (!fileCheck(oriPath, false)) {
    logger.default.warn(
      `[components][material][convert][${metadata.Id}] Yatta JSON 不存在，使用 Metadata 数据继续转换`,
    );
  } else {
    oriData = await fs.readJson(oriPath);
  }
  if (!yatta) {
    logger.default.warn(
      `[components][material][convert][${metadata.Id}] Yatta 索引中未找到对应材料`,
    );
  }
  const transData = await transMaterial(metadata, oriData);
  transJson.push(transData);
  logger.console.info(
    `[components][material][convert][${metadata.Id}] ${metadata.Name} JSON 转换完成`,
  );
}
Counter.End();
Counter.Output();
const savePath = path.join(wikiDir.out, "Wiki", "material.json");
await fs.writeJson(savePath, transJson);
logger.default.info(`[components][material][convert] JSON 转换完成，耗时${Counter.getTime()}`);

// 转换图片
Counter.Reset(rawList.length);
Counter.Fail(rawList.length - materialList.length);
for (const item of materialList) {
  const { metadata } = item;
  const outPath = path.join(imgDir.out, `${metadata.Id}.webp`);
  const name = metadata.Name;
  if (fileCheck(outPath, false)) {
    logger.console.mark(`[components][material][convert][${metadata.Id}] ${name} WEBP 已存在`);
    Counter.Skip();
    continue;
  }
  const image = materialImages.get(metadata.Id);
  if (!image) {
    logger.default.warn(
      `[components][material][convert][${metadata.Id}] ${name} 缺少可用图片，跳过图片转换`,
    );
    Counter.Skip();
    continue;
  }
  await sharp(image).png().resize(256, 256).webp().toFile(outPath);
  logger.console.info(`[components][material][convert][${metadata.Id}] ${name} WEBP 转换完成`);
}

Counter.End();
Counter.Output();
logger.default.info(`[components][material][convert] 图片转换完成，耗时${Counter.getTime()}`);

logger.default.info(`[components][material][convert] 转换完成，耗时${Counter.getTime()}`);
Counter.EndAll();

/**
 * @description 转换材料数据
 * @since 2.4.0
 * @param {TGACore.Plugins.Hutao.Material.MaterialItem} metadata Metadata 材料数据
 * @param {TGACore.Plugins.Yatta.Material.MaterialDetail | undefined} data Yatta 材料详情
 * @return {TGACore.Components.Material.WikiItem} 转换后的材料数据
 */
async function transMaterial(
  metadata: TGACore.Plugins.Hutao.Material.MaterialItem,
  data: TGACore.Plugins.Yatta.Material.MaterialDetail | undefined,
): Promise<TGACore.Components.Material.WikiItem> {
  // 处理合成
  const converts: Array<TGACore.Components.Material.Convert> = [];
  if (data?.recipe) {
    const recipeAllKeys = Object.keys(data.recipe);
    for (const item of recipeAllKeys) {
      const convert: TGACore.Components.Material.Convert = { id: item, source: [] };
      const recipeItem = data.recipe[item];
      const recipeMaterials = Object.keys(recipeItem);
      for (const key of recipeMaterials) {
        const materialJson = path.join(jsonDir.src, `${key}.json`);
        const metadataData = metadataMap.get(Number(key));
        let materialData: TGACore.Plugins.Yatta.Material.MaterialDetail | undefined;
        if (!fileCheck(materialJson, false)) {
          logger.default.warn(
            `[components][material][convert][${metadata.Id}] ${key} JSON 文件不存在，尝试下载`,
          );
          try {
            const json = await yattaTool.fetchJson<TGACore.Plugins.Yatta.Material.DetailResponse>(
              `CHS/material/${key}`,
            );
            fs.writeJSONSync(materialJson, json.data, { spaces: 2 });
            materialData = json.data;
            const savePath = path.join(imgDir.out, `${key}.webp`);
            if (!fileCheck(savePath, false)) {
              const iconBuffer = await fetchMaterialIcon(`${json.data.icon}.png`);
              await sharp(iconBuffer).png().resize(256, 256).webp().toFile(savePath);
            }
            logger.default.info(
              `[components][material][convert][${metadata.Id}] ${key} 数据补充完成`,
            );
          } catch (e) {
            logger.default.error(
              `[components][material][convert][${metadata.Id}] ${key} JSON 下载失败`,
            );
            logger.default.error(e);
            if (!metadataData) {
              Counter.Fail();
              continue;
            }
          }
        } else {
          materialData = await fs.readJson(materialJson);
        }
        if (!metadataData && !materialData) {
          logger.default.warn(
            `[components][material][convert][${metadata.Id}] ${key} 缺少 Metadata 和 Yatta 数据，跳过`,
          );
          continue;
        }
        convert.source.push({
          id: key,
          name: metadataData?.Name ?? materialData?.name ?? "未知材料",
          type: metadataData?.TypeDescription ?? materialData?.type ?? "未知类型",
          star: metadataData?.RankLevel ?? materialData?.rank ?? 0,
          count: recipeItem[key].count,
        });
      }
      converts.push(convert);
    }
  }
  // 处理来源
  let source: Array<TGACore.Components.Material.Source> = [];
  const dayList = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  if (data?.source) {
    for (const item of data.source) {
      let days: Array<number> = [];
      if (item.days === undefined) {
        if (item.name === "前往采集") continue;
        if (item.name === "占位-可合成数量:{0}") continue;
        source.push({ name: item.name, type: item.type });
        continue;
      }
      item.days.forEach((day: string) => days.push(dayList.indexOf(day)));
      days = days.sort((a, b) => a - b);
      source.push({ name: item.name, type: item.type, days });
    }
  }
  // 精简部分材料获取方式
  if (["105", "102", "202"].includes(metadata.Id.toString())) {
    source = source.filter((i) => i.type !== "domain");
    source.push({ name: "秘境获取", type: "single" });
  }
  return {
    id: metadata.Id,
    name: metadata.Name,
    description: metadata.Description,
    type: metadata.TypeDescription,
    star: metadata.RankLevel,
    source,
    convert: converts,
  };
}
