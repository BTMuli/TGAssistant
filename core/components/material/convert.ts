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
import fs from "fs-extra";
import sharp from "sharp";

import { imgDir, jsonDir, wikiDir } from "./constant.ts";
import { IGNORE_TYPE_DESCRIPTIONS, KEEP_CONSUMABLE_IDS, KEEP_CONSUMABLE_NAMES } from "./filter.ts";

const CHARACTER_WEAPON_MATERIAL_TYPES: ReadonlySet<string> = new Set([
  "角色天赋素材",
  "角色突破素材",
  "武器突破素材",
  "角色培养素材",
  "角色与武器培养素材",
]);

const SAME_CTYPE_TYPES: ReadonlySet<string> = new Set([
  "消耗品",
  "任务道具",
  "食物",
  "圣物匣",
  "贵重物品",
  "小道具",
  "素材",
  "食材",
  "冒险道具",
]);

/**
 * 获取材料归并分类
 * @since 2.6.0
 * @param {string} type 材料原始分类
 * @return {string} 材料归并分类
 */
function getCType(type: string): string {
  if (type.endsWith("区域特产")) return "区域特产";
  if (CHARACTER_WEAPON_MATERIAL_TYPES.has(type)) return "角色与武器培养素材";
  if (SAME_CTYPE_TYPES.has(type)) return type;
  return "默认";
}

logger.init();
Counter.Init("[components][material][convert]");
logger.default.info("[components][material][convert] 运行 convert.ts");

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

const rawPath = path.join(jsonDir.src, "material.json");
const foodPath = path.join(jsonDir.src, "food.json");
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
const rawFood: Array<TGACore.Plugins.Yatta.Food.FoodItem> = fileCheck(foodPath, false)
  ? await fs.readJson(foodPath)
  : [];
if (rawFood.length === 0) {
  logger.default.warn(
    "[components][material][convert] Yatta 食物索引不存在，继续使用 Metadata 数据转换",
  );
}
const foodMap = new Map(rawFood.map((item) => [item.id, item]));
const rawMetadata = hutaoTool.read<TGACore.Plugins.Hutao.Material.FullInfo>(
  hutaoTool.enum.file.Material,
);
const metadataMap = new Map(rawMetadata.map((item) => [item.Id, item]));
type MaterialEntry = {
  metadata: TGACore.Plugins.Hutao.Material.MaterialItem | undefined;
  yatta: TGACore.Plugins.Yatta.Material.MaterialItem | undefined;
  food: TGACore.Plugins.Yatta.Food.FoodItem | undefined;
};
const rawList: Array<MaterialEntry> = [];
for (const metadata of rawMetadata) {
  const yatta = yattaMap.get(metadata.Id);
  const food = foodMap.get(metadata.Id);
  if (metadata.TypeDescription === "任务道具" && !yatta && !food) {
    logger.console.mark(
      `[components][material][convert][${metadata.Id}] ${metadata.Name} 类型为任务道具且 Yatta 中不存在，跳过转换`,
    );
    continue;
  }
  if (IGNORE_TYPE_DESCRIPTIONS.has(metadata.TypeDescription)) {
    logger.console.mark(
      `[components][material][convert][${metadata.Id}] ${metadata.Name} 类型为 ${metadata.TypeDescription}，跳过转换`,
    );
    continue;
  }
  if (
    metadata.TypeDescription === "消耗品" &&
    !KEEP_CONSUMABLE_NAMES.has(metadata.Name) &&
    !KEEP_CONSUMABLE_IDS.has(metadata.Id)
  ) {
    logger.console.mark(
      `[components][material][convert][${metadata.Id}] ${metadata.Name} 类型为消耗品且不在保留列表，跳过转换`,
    );
    continue;
  }
  rawList.push({ metadata, yatta, food });
}
for (const yatta of rawYatta) {
  const id = Number(yatta.id);
  if (metadataMap.has(id)) continue;
  rawList.push({ metadata: undefined, yatta, food: foodMap.get(id) });
  logger.console.mark(
    `[components][material][convert][${id}] ${yatta.name} Metadata 中不存在，使用 Yatta 数据补充`,
  );
}
for (const food of rawFood) {
  if (metadataMap.has(food.id) || yattaMap.has(food.id)) continue;
  rawList.push({ metadata: undefined, yatta: undefined, food });
  logger.console.mark(
    `[components][material][convert][${food.id}] ${food.name} Metadata 中不存在，使用 Yatta 食物数据补充`,
  );
}
const materialImages = new Map<number, string | Buffer>();
const materialList: typeof rawList = [];
for (const item of rawList) {
  const { metadata, yatta, food } = item;
  const id = metadata?.Id ?? Number(yatta?.id ?? food?.id);
  const name = metadata?.Name ?? yatta?.name ?? food?.name ?? "未知材料";
  const oriPath = path.join(imgDir.src, `${id}.png`);
  const outPath = path.join(imgDir.out, `${id}.webp`);
  if (!Number.isFinite(id)) {
    logger.default.error(`[components][material][convert] ${name} 缺少有效 ID，跳过 JSON 转换`);
    continue;
  }
  if (fileCheck(outPath, false)) {
    materialList.push(item);
    continue;
  }
  if (fileCheck(oriPath, false)) {
    materialImages.set(id, oriPath);
    materialList.push(item);
    continue;
  }
  logger.default.warn(
    `[components][material][convert][${id}] ${name} 本地图标不存在，跳过 JSON 转换，请先运行 download.ts`,
  );
}
const transJson: Array<TGACore.Components.Material.WikiItem> = [];
const foodJson: Array<TGACore.Components.Material.WikiFood> = [];
// 转换json
for (const item of materialList) {
  const { yatta, food, metadata } = item;
  const id = metadata?.Id ?? Number(yatta?.id ?? food?.id);
  const name = metadata?.Name ?? yatta?.name ?? food?.name ?? "未知材料";
  const oriPath = path.join(jsonDir.src, `${id}.json`);
  let oriData:
    | TGACore.Plugins.Yatta.Material.MaterialDetail
    | TGACore.Plugins.Yatta.Food.FoodDetail
    | undefined;
  if (!fileCheck(oriPath, false)) {
    logger.console.warn(
      `[components][material][convert][${id}] Yatta JSON 不存在，使用索引和 Metadata 数据继续转换`,
    );
  } else {
    const localData = await fs.readJson(oriPath);
    if (typeof localData === "object" && localData !== null && !Array.isArray(localData)) {
      oriData = localData;
    } else {
      logger.console.warn(`[components][material][convert][${id}] 本地 Yatta JSON 数据无效`);
    }
  }
  if (!yatta && !food) {
    logger.default.warn(`[components][material][convert][${id}] Yatta 索引中未找到对应材料`);
  }
  const transData = await transMaterial(metadata, yatta, food, oriData);
  transJson.push(transData.material);
  if (transData.food !== undefined) foodJson.push(transData.food);
  logger.console.info(`[components][material][convert][${id}] ${name} JSON 转换完成`);
}
Counter.End();
Counter.Output();
const wikiMaterialDir = path.join(wikiDir.out, "Wiki", "material");
fileCheck(wikiMaterialDir);
await fs.writeJson(path.join(wikiMaterialDir, "material.json"), transJson, { spaces: 2 });
await fs.writeJson(path.join(wikiMaterialDir, "food.json"), foodJson, { spaces: 2 });
logger.default.info(`[components][material][convert] JSON 转换完成，耗时${Counter.getTime()}`);

// 转换图片
Counter.Reset(rawList.length);
Counter.Fail(rawList.length - materialList.length);
for (const item of materialList) {
  const { metadata, yatta, food } = item;
  const id = metadata?.Id ?? Number(yatta?.id ?? food?.id);
  const outPath = path.join(imgDir.out, `${id}.webp`);
  const name = metadata?.Name ?? yatta?.name ?? food?.name ?? "未知材料";
  if (fileCheck(outPath, false)) {
    logger.console.mark(`[components][material][convert][${id}] ${name} WEBP 已存在`);
    Counter.Skip();
    continue;
  }
  const image = materialImages.get(id);
  if (!image) {
    logger.default.warn(
      `[components][material][convert][${id}] ${name} 缺少可用图片，跳过图片转换`,
    );
    Counter.Skip();
    continue;
  }
  await sharp(image).png().resize(256, 256).webp().toFile(outPath);
  logger.console.info(`[components][material][convert][${id}] ${name} WEBP 转换完成`);
}

Counter.End();
Counter.Output();
logger.default.info(`[components][material][convert] 图片转换完成，耗时${Counter.getTime()}`);

logger.default.info(`[components][material][convert] 转换完成，耗时${Counter.getTime()}`);
Counter.EndAll();

type TransMaterial = {
  material: TGACore.Components.Material.WikiItem;
  food?: TGACore.Components.Material.WikiFood;
};

/**
 * @description 转换材料数据
 * @since 2.4.0
 * @param {TGACore.Plugins.Hutao.Material.MaterialItem | undefined} metadata Metadata 材料数据
 * @param {TGACore.Plugins.Yatta.Material.MaterialItem | undefined} yatta Yatta 索引数据
 * @param {TGACore.Plugins.Yatta.Food.FoodItem | undefined} food Yatta 食物索引数据
 * @param {TGACore.Plugins.Yatta.Material.MaterialDetail | TGACore.Plugins.Yatta.Food.FoodDetail | undefined} data Yatta 详情
 * @return {TransMaterial} 转换后的材料数据
 */
async function transMaterial(
  metadata: TGACore.Plugins.Hutao.Material.MaterialItem | undefined,
  yatta: TGACore.Plugins.Yatta.Material.MaterialItem | undefined,
  food: TGACore.Plugins.Yatta.Food.FoodItem | undefined,
  data:
    | TGACore.Plugins.Yatta.Material.MaterialDetail
    | TGACore.Plugins.Yatta.Food.FoodDetail
    | undefined,
): Promise<TransMaterial> {
  const materialId = metadata?.Id ?? Number(yatta?.id ?? food?.id);
  const isFood = metadata?.TypeDescription === "食物" || food !== undefined;
  const materialData = isFood
    ? undefined
    : <TGACore.Plugins.Yatta.Material.MaterialDetail | undefined>data;
  const foodData = isFood ? <TGACore.Plugins.Yatta.Food.FoodDetail | undefined>data : undefined;
  // 处理合成
  const converts: Array<TGACore.Components.Material.Convert> = [];
  if (materialData?.recipe) {
    const recipeAllKeys = Object.keys(materialData.recipe);
    for (const item of recipeAllKeys) {
      const convert: TGACore.Components.Material.Convert = { id: item, source: [] };
      const recipeItem = materialData.recipe[item];
      const recipeMaterials = Object.keys(recipeItem);
      for (const key of recipeMaterials) {
        const materialJson = path.join(jsonDir.src, `${key}.json`);
        const metadataData = metadataMap.get(Number(key));
        const yattaData = yattaMap.get(Number(key));
        const foodItem = foodMap.get(Number(key));
        let detailData:
          | TGACore.Plugins.Yatta.Material.MaterialDetail
          | TGACore.Plugins.Yatta.Food.FoodDetail
          | undefined;
        if (fileCheck(materialJson, false)) {
          const localData = await fs.readJson(materialJson);
          if (typeof localData === "object" && localData !== null && !Array.isArray(localData)) {
            detailData = localData;
          }
        }
        if (!metadataData && !detailData && !yattaData && !foodItem) {
          logger.default.warn(
            `[components][material][convert][${materialId}] ${key} 缺少 Metadata 和 Yatta 数据，跳过`,
          );
          continue;
        }
        convert.source.push({
          id: key,
          name:
            metadataData?.Name ??
            detailData?.name ??
            yattaData?.name ??
            foodItem?.name ??
            "未知材料",
          type:
            metadataData?.TypeDescription ??
            detailData?.type ??
            yattaData?.type ??
            foodItem?.type ??
            "未知类型",
          star:
            metadataData?.RankLevel ?? detailData?.rank ?? yattaData?.rank ?? foodItem?.rank ?? 0,
          count: recipeItem[key].count,
        });
      }
      converts.push(convert);
    }
  }
  const foodInfo = isFood ? transFoodInfo(materialId, metadata, food, foodData) : undefined;
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
  if (["105", "102", "202"].includes(materialId.toString())) {
    source = source.filter((i) => i.type !== "domain");
    source.push({ name: "秘境获取", type: "single" });
  }
  const type = metadata?.TypeDescription ?? data?.type ?? yatta?.type ?? food?.type ?? "未知类型";
  return {
    material: {
      id: materialId,
      name: metadata?.Name ?? data?.name ?? yatta?.name ?? food?.name ?? "未知材料",
      description: metadata?.Description ?? data?.description ?? "",
      type,
      cType: getCType(type),
      star: metadata?.RankLevel ?? data?.rank ?? yatta?.rank ?? food?.rank ?? 0,
      source,
      convert: converts,
    },
    food: foodInfo,
  };
}

/**
 * 转换食物效果与食材数据。
 *
 * @since 2.6.0
 * @param metadata Metadata 材料数据
 * @param food Yatta 食物索引数据
 * @param data Yatta 食物详情
 * @returns 转换后的食物数据
 */
function transFoodInfo(
  materialId: number,
  metadata: TGACore.Plugins.Hutao.Material.MaterialItem | undefined,
  food: TGACore.Plugins.Yatta.Food.FoodItem | undefined,
  data: TGACore.Plugins.Yatta.Food.FoodDetail | undefined,
): TGACore.Components.Material.WikiFood {
  const effect = data?.recipe?.effect
    ? Object.values(data.recipe.effect)
    : metadata?.EffectDescription
      ? [metadata.EffectDescription]
      : [];
  const input = data?.recipe?.input
    ? Object.entries(data.recipe.input).map(([id, item]) => ({ id: Number(id), ...item }))
    : [];
  const effectIcon = data?.recipe?.effectIcon ?? food?.effectIcon;
  return {
    id: materialId,
    effect,
    ...(effectIcon === undefined ? {} : { effectIcon }),
    input,
  };
}
