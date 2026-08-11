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
import {
  IGNORE_TYPE_DESCRIPTIONS,
  IGNORE_MATERIAL_NAMES,
  KEEP_CONSUMABLE_IDS,
  KEEP_CONSUMABLE_NAMES,
  normalizeBookVolumeName,
  shouldKeepBookVolume,
} from "./filter.ts";

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
const booksPath = path.join(jsonDir.src, "books.json");
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
const rawBooks: Array<TGACore.Plugins.Yatta.Book.LocalBook> = fileCheck(booksPath, false)
  ? await fs.readJson(booksPath)
  : [];
if (rawBooks.length === 0) {
  logger.default.warn("[components][material][convert] Yatta 书籍数据不存在，继续使用其他数据转换");
}
const bookMap = new Map<number, TGACore.Plugins.Yatta.Book.LocalVolume>();
const bookIdsByIcon = new Map<string, Set<number>>();
for (const book of rawBooks) {
  for (const rawVolume of book.volume) {
    const volumeName = rawVolume.vol?.trim() || book.name.trim();
    const volume =
      volumeName.length > 0
        ? { ...rawVolume, vol: normalizeBookVolumeName(volumeName) }
        : rawVolume;
    if (!shouldKeepBookVolume(volume)) continue;
    bookMap.set(volume.id, volume);
    const ids = bookIdsByIcon.get(volume.icon) ?? new Set<number>();
    ids.add(volume.id);
    bookIdsByIcon.set(volume.icon, ids);
  }
}
function getBookForMetadata(
  metadata: TGACore.Plugins.Hutao.Material.MaterialItem,
): TGACore.Plugins.Yatta.Book.LocalVolume | undefined {
  const book = bookMap.get(metadata.Id);
  return book !== undefined && bookIdsByIcon.get(metadata.Icon)?.has(metadata.Id) === true
    ? book
    : undefined;
}
const rawMetadata = hutaoTool.read<TGACore.Plugins.Hutao.Material.FullInfo>(
  hutaoTool.enum.file.Material,
);
const metadataMap = new Map(rawMetadata.map((item) => [item.Id, item]));
type MaterialEntry = {
  metadata: TGACore.Plugins.Hutao.Material.MaterialItem | undefined;
  yatta: TGACore.Plugins.Yatta.Material.MaterialItem | undefined;
  food: TGACore.Plugins.Yatta.Food.FoodItem | undefined;
  book: TGACore.Plugins.Yatta.Book.LocalVolume | undefined;
};
const rawList: Array<MaterialEntry> = [];
for (const metadata of rawMetadata) {
  const yatta = yattaMap.get(metadata.Id);
  const food = foodMap.get(metadata.Id);
  if (IGNORE_MATERIAL_NAMES.has(metadata.Name)) {
    logger.console.mark(
      `[components][material][convert][${metadata.Id}] ${metadata.Name} 名称为占位名称，跳过转换`,
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
  rawList.push({ metadata, yatta, food, book: getBookForMetadata(metadata) });
}
for (const yatta of rawYatta) {
  const id = Number(yatta.id);
  if (metadataMap.has(id)) continue;
  if (IGNORE_MATERIAL_NAMES.has(yatta.name)) continue;
  rawList.push({ metadata: undefined, yatta, food: foodMap.get(id), book: bookMap.get(id) });
  logger.console.mark(
    `[components][material][convert][${id}] ${yatta.name} Metadata 中不存在，使用 Yatta 数据补充`,
  );
}
for (const food of rawFood) {
  if (metadataMap.has(food.id) || yattaMap.has(food.id)) continue;
  if (IGNORE_MATERIAL_NAMES.has(food.name)) continue;
  rawList.push({ metadata: undefined, yatta: undefined, food, book: bookMap.get(food.id) });
  logger.console.mark(
    `[components][material][convert][${food.id}] ${food.name} Metadata 中不存在，使用 Yatta 食物数据补充`,
  );
}
for (const book of bookMap.values()) {
  if (metadataMap.has(book.id) || yattaMap.has(book.id) || foodMap.has(book.id)) continue;
  rawList.push({ metadata: undefined, yatta: undefined, food: undefined, book });
  logger.console.mark(
    `[components][material][convert][${book.id}] ${book.name} Metadata 中不存在，使用 Yatta 书籍数据补充`,
  );
}
const materialImages = new Map<number, string | Buffer>();
const materialList: typeof rawList = [];
for (const item of rawList) {
  const { metadata, yatta, food, book } = item;
  const id = metadata?.Id ?? Number(yatta?.id ?? food?.id ?? book?.id);
  const name = metadata?.Name ?? yatta?.name ?? food?.name ?? book?.name ?? "未知材料";
  if (IGNORE_MATERIAL_NAMES.has(name)) {
    logger.console.mark(`[components][material][convert][${id}] ${name} 名称为占位名称，跳过转换`);
    continue;
  }
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
const foodInputMap = new Map<number, Array<TGACore.Components.Material.WikiFoodInput>>();
// 转换json
for (const item of materialList) {
  const { yatta, food, metadata, book } = item;
  const id = metadata?.Id ?? Number(yatta?.id ?? food?.id ?? book?.id);
  const name = metadata?.Name ?? yatta?.name ?? food?.name ?? book?.name ?? "未知材料";
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
  if (!yatta && !food && !book) {
    logger.default.warn(`[components][material][convert][${id}] Yatta 索引中未找到对应材料`);
  }
  const transData = await transMaterial(metadata, yatta, food, book, oriData);
  transJson.push(transData.material);
  if (transData.food !== undefined) {
    foodJson.push(transData.food);
    if (transData.foodInput !== undefined) {
      foodInputMap.set(transData.food.id, transData.foodInput);
    }
  }
  logger.console.info(`[components][material][convert][${id}] ${name} JSON 转换完成`);
}
const foodRecipes = buildFoodRecipes(foodJson, foodInputMap, rawMetadata);
const foodRecipeByFoodId = new Map<number, TGACore.Components.Material.WikiFoodRecipe>();
for (const recipe of foodRecipes) {
  const { strange, normal, delicious } = recipe.variants;
  for (const foodId of [strange, normal, delicious]) {
    if (foodId !== undefined) foodRecipeByFoodId.set(foodId, recipe);
  }
  for (const special of recipe.variants.special) {
    foodRecipeByFoodId.set(special.foodId, recipe);
  }
}
for (const food of foodJson) {
  const recipe = foodRecipeByFoodId.get(food.id);
  if (recipe === undefined) continue;
  food.recipeId = recipe.id;
  food.kind = getFoodKind(recipe, food.id);
}
Counter.End();
Counter.Output();
const wikiMaterialDir = path.join(wikiDir.out, "Wiki", "material");
fileCheck(wikiMaterialDir);
await fs.writeJson(path.join(wikiMaterialDir, "material.json"), transJson, { spaces: 2 });
await fs.writeJson(path.join(wikiMaterialDir, "food.json"), foodJson, { spaces: 2 });
await fs.writeJson(path.join(wikiMaterialDir, "foodRecipe.json"), foodRecipes, { spaces: 2 });
const bookJson: Array<TGACore.Components.Material.WikiBook> = materialList
  .flatMap(({ book }) =>
    book === undefined
      ? []
      : [
          {
            id: book.id,
            name: book.name,
            vol: book.vol === undefined ? undefined : normalizeBookVolumeName(book.vol),
            description: book.description,
            storyId: book.storyId,
            story: book.story,
          },
        ],
  )
  .sort((a, b) => a.id - b.id);
await fs.writeJson(path.join(wikiMaterialDir, "books.json"), bookJson, { spaces: 2 });
logger.default.info(`[components][material][convert] JSON 转换完成，耗时${Counter.getTime()}`);

// 转换图片
Counter.Reset(rawList.length);
Counter.Fail(rawList.length - materialList.length);
for (const item of materialList) {
  const { metadata, yatta, food, book } = item;
  const id = metadata?.Id ?? Number(yatta?.id ?? food?.id ?? book?.id);
  const outPath = path.join(imgDir.out, `${id}.webp`);
  const name = metadata?.Name ?? yatta?.name ?? food?.name ?? book?.name ?? "未知材料";
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
  foodInput?: Array<TGACore.Components.Material.WikiFoodInput>;
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
  book: TGACore.Plugins.Yatta.Book.LocalVolume | undefined,
  data:
    | TGACore.Plugins.Yatta.Material.MaterialDetail
    | TGACore.Plugins.Yatta.Food.FoodDetail
    | undefined,
): Promise<TransMaterial> {
  const materialId = metadata?.Id ?? Number(yatta?.id ?? food?.id ?? book?.id);
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
  const foodInput = isFood ? transFoodInput(foodData) : undefined;
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
  const type =
    metadata?.TypeDescription ??
    data?.type ??
    yatta?.type ??
    food?.type ??
    (book === undefined ? "未知类型" : "任务道具");
  return {
    material: {
      id: materialId,
      name: metadata?.Name ?? data?.name ?? yatta?.name ?? food?.name ?? book?.name ?? "未知材料",
      description: metadata?.Description ?? data?.description ?? book?.description ?? "",
      type,
      cType: book === undefined ? getCType(type) : "书籍",
      star: metadata?.RankLevel ?? data?.rank ?? yatta?.rank ?? food?.rank ?? book?.rank ?? 0,
      source,
      convert: converts,
    },
    food: foodInfo,
    foodInput,
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
  const effectIcon = data?.recipe?.effectIcon ?? food?.effectIcon;
  return {
    id: materialId,
    effect,
    ...(effectIcon === undefined ? {} : { effectIcon }),
  };
}

/**
 * 转换食物配方原料。
 *
 * @since 2.6.0
 * @param data Yatta 食物详情
 * @returns 食物配方原料
 */
function transFoodInput(
  data: TGACore.Plugins.Yatta.Food.FoodDetail | undefined,
): Array<TGACore.Components.Material.WikiFoodInput> | undefined {
  if (data?.recipe?.input === undefined) return undefined;
  return Object.entries(data.recipe.input).map(([id, item]) => ({ id: Number(id), ...item }));
}

type FoodSpecialLink = {
  characterId: number;
  originId: number;
  specialId: number;
};

type FoodGroup = {
  id: number;
  input?: Array<TGACore.Components.Material.WikiFoodInput>;
  inputSignature?: string;
  variants: TGACore.Components.Material.WikiFoodVariants;
};

/**
 * 生成食物配方组索引。
 *
 * 普通料理通过去除“奇怪的/美味的”前缀归组，角色特殊料理通过 Metadata
 * 的 CookBonus.OriginItemId 归组。Yatta 的 recipe.input 只作为原料数据来源，
 * 不作为料理组 ID 的来源，因为它可能挂在同组的其他料理 ID 上。
 *
 * @since 2.6.0
 */
function buildFoodRecipes(
  foods: Array<TGACore.Components.Material.WikiFood>,
  foodInputMap: Map<number, Array<TGACore.Components.Material.WikiFoodInput>>,
  metadata: Array<TGACore.Plugins.Hutao.Material.MaterialItem>,
): Array<TGACore.Components.Material.WikiFoodRecipe> {
  const metadataMap = new Map(metadata.map((item) => [item.Id, item]));
  const specialLinks = readFoodSpecialLinks();
  const specialIds = new Set(specialLinks.map((item) => item.specialId));
  const originIds = new Set(specialLinks.map((item) => item.originId));
  const groups = new Map<string, FoodGroup>();
  const groupByOriginId = new Map<number, FoodGroup>();

  for (const food of foods) {
    const item = metadataMap.get(food.id);
    if (item === undefined || specialIds.has(food.id)) continue;
    const baseName = getFoodBaseName(item.Name);
    const groupKey = `${baseName}|${item.RankLevel}`;
    let group = groups.get(groupKey);
    if (group === undefined) {
      group = {
        id: food.id,
        variants: { special: [] },
      };
      groups.set(groupKey, group);
    }
    const kind = getFoodKindByName(item.Name);
    if (kind === "normal") {
      group.id = food.id;
      if (originIds.has(food.id)) groupByOriginId.set(food.id, group);
    }
    if (kind === "strange") group.variants.strange = food.id;
    if (kind === "normal" && group.variants.normal === undefined) group.variants.normal = food.id;
    if (kind === "delicious") group.variants.delicious = food.id;
    const input = foodInputMap.get(food.id);
    if (input !== undefined) {
      const signature = getFoodInputSignature(input);
      if (group.inputSignature !== undefined && group.inputSignature !== signature) {
        logger.default.warn(
          `[components][material][convert][food] ${food.id} 与配方组 ${group.id} 的原料不一致`,
        );
      } else if (group.input === undefined) {
        group.input = input;
        group.inputSignature = signature;
      }
    }
  }

  for (const link of specialLinks) {
    const group = groupByOriginId.get(link.originId);
    if (group === undefined) {
      logger.default.warn(
        `[components][material][convert][food] 角色 ${link.characterId} 的特殊料理 ${link.specialId} 未找到本体料理 ${link.originId}`,
      );
      continue;
    }
    group.variants.special.push({ characterId: link.characterId, foodId: link.specialId });
    const input = foodInputMap.get(link.specialId);
    if (input !== undefined && group.input === undefined) {
      group.input = input;
      group.inputSignature = getFoodInputSignature(input);
    }
  }

  const recipes: Array<TGACore.Components.Material.WikiFoodRecipe> = [];
  for (const group of groups.values()) {
    if (group.input === undefined) continue;
    recipes.push({ id: group.id, input: group.input, variants: group.variants });
  }
  return recipes.sort((a, b) => a.id - b.id);
}

/** 读取所有角色的特殊料理关系。 */
function readFoodSpecialLinks(): Array<FoodSpecialLink> {
  const localMeta = hutaoTool.read<Record<string, string>>(hutaoTool.enum.file.Meta);
  const links: Array<FoodSpecialLink> = [];
  for (const id of hutaoTool.readIds(localMeta)) {
    if (!hutaoTool.check(hutaoTool.enum.file.Avatar, id)) continue;
    const avatar = hutaoTool.read<TGACore.Plugins.Hutao.Avatar.FullInfo>(
      hutaoTool.enum.file.Avatar,
      id,
    );
    const food = avatar.FetterInfo.CookBonus;
    if (food === undefined) continue;
    links.push({ characterId: avatar.Id, originId: food.OriginItemId, specialId: food.ItemId });
  }
  return links;
}

/** 获取料理基础名称。 */
function getFoodBaseName(name: string): string {
  return name.replace(/^(奇怪的|美味的)/, "");
}

/** 根据料理名称判断普通料理变体。 */
function getFoodKindByName(name: string): TGACore.Components.Material.WikiFoodKind {
  if (name.startsWith("奇怪的")) return "strange";
  if (name.startsWith("美味的")) return "delicious";
  return "normal";
}

/** 根据配方组中的料理 ID 获取料理变体类型。 */
function getFoodKind(
  recipe: TGACore.Components.Material.WikiFoodRecipe,
  foodId: number,
): TGACore.Components.Material.WikiFoodKind {
  if (recipe.variants.strange === foodId) return "strange";
  if (recipe.variants.normal === foodId) return "normal";
  if (recipe.variants.delicious === foodId) return "delicious";
  return "special";
}

/** 生成稳定的食物原料签名。 */
function getFoodInputSignature(input: Array<TGACore.Components.Material.WikiFoodInput>): string {
  return input
    .map((item) => `${item.id}:${item.count}`)
    .sort()
    .join("|");
}
