/**
 * 材料组件转换
 * @since 2.6.0
 */

import path from "node:path";

import hutaoTool from "@hutao/hutao.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import yattaTool from "@yatta/yatta.ts";
import fs from "fs-extra";
import sharp from "sharp";

import { imgDir, jsonDir } from "./constant.ts";
import {
  IGNORE_MATERIAL_NAMES,
  normalizeBookVolumeName,
  shouldConvertMaterial,
  shouldKeepBookVolume,
} from "./filter.ts";
import fetchMaterialIcon from "./utils.ts";

logger.init();
Counter.Init("[components][material][download]");
logger.default.info("[components][material][download] 运行 download.ts");

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

let rawMaterial: Array<TGACore.Plugins.Yatta.Material.MaterialItem> = [];
let rawFood: Array<TGACore.Plugins.Yatta.Food.FoodItem> = [];
let rawBooks: Array<TGACore.Plugins.Yatta.Book.LocalBook> = [];

logger.default.info("[components][material][download] 开始下载 JSON 数据");
try {
  const res =
    await yattaTool.fetchJson<TGACore.Plugins.Yatta.Material.MaterialResponse>("CHS/material");
  if (res.response !== 200) throw new Error(`Yatta 材料索引响应异常：${res.response}`);
  logger.default.info("[components][material][download] JSON 数据下载完成");
  const savePath = path.join(jsonDir.src, "material.json");
  rawMaterial = Object.values(res.data.items);
  await fs.writeJson(savePath, rawMaterial, { spaces: 2 });
} catch (error) {
  logger.default.error("[components][material][download] 下载 JSON 数据失败");
  logger.console.error(error);
  Counter.Fail();
}

logger.default.info("[components][material][download] 开始下载食物索引数据");
try {
  const res = await yattaTool.fetchJson<TGACore.Plugins.Yatta.Food.FoodResponse>("CHS/food");
  if (res.response !== 200) throw new Error(`Yatta 食物索引响应异常：${res.response}`);
  rawFood = Object.values(res.data.items);
  const savePath = path.join(jsonDir.src, "food.json");
  await fs.writeJson(savePath, rawFood, { spaces: 2 });
  logger.default.info("[components][material][download] 食物索引数据下载完成");
} catch (error) {
  logger.default.error("[components][material][download] 下载食物索引数据失败");
  logger.console.error(error);
  Counter.Fail();
}

logger.default.info("[components][material][download] 开始记录 Metadata 类型描述");
const hasMetadata = hutaoTool.check(hutaoTool.enum.file.Material);
const rawMetadata = hasMetadata
  ? hutaoTool.read<TGACore.Plugins.Hutao.Material.FullInfo>(hutaoTool.enum.file.Material)
  : [];
if (!hasMetadata) {
  logger.default.warn(
    "[components][material][download] Metadata Material.json 不存在，跳过记录 TypeDescription",
  );
} else {
  try {
    const typeDescriptions = [...new Set(rawMetadata.map((item) => item.TypeDescription))];
    await fs.writeJson(path.join(jsonDir.src, "typedesc.json"), typeDescriptions, { spaces: 2 });
    logger.default.info(
      `[components][material][download] Metadata 类型描述记录完成，共 ${typeDescriptions.length} 项`,
    );
  } catch (e) {
    logger.default.error("[components][material][download] Metadata 类型描述记录失败");
    logger.default.error(e);
    Counter.Fail();
  }
}

logger.default.info("[components][material][download] 开始下载书籍数据");
try {
  const res = await yattaTool.fetchJson<TGACore.Plugins.Yatta.Book.BookResponse>("CHS/book");
  if (res.response !== 200) throw new Error(`Yatta 书籍索引响应异常：${res.response}`);
  const bookItems = Object.values(res.data.items);
  const bookList: Array<TGACore.Plugins.Yatta.Book.LocalBook> = [];
  for (const book of bookItems) {
    try {
      const savePath = path.join(jsonDir.src, `book_${book.id}.json`);
      let detail: TGACore.Plugins.Yatta.Book.BookDetail;
      let cached: TGACore.Plugins.Yatta.Book.LocalBook | undefined;
      const cachedData = validJsonFile(savePath) ? await fs.readJson(savePath) : undefined;
      if (
        typeof cachedData === "object" &&
        cachedData !== null &&
        Array.isArray((<Partial<TGACore.Plugins.Yatta.Book.LocalBook>>cachedData).volume)
      ) {
        console.info(`[components][material][download][${book.id}] 读取书籍缓存：${book.name}`);
        cached = <TGACore.Plugins.Yatta.Book.LocalBook>cachedData;
        detail = cached;
      } else {
        console.info(`[components][material][download][${book.id}] 下载书籍详情：${book.name}`);
        const detailRes = await yattaTool.fetchJson<TGACore.Plugins.Yatta.Book.DetailResponse>(
          `CHS/book/${book.id}`,
        );
        if (detailRes.response !== 200) {
          throw new Error(`Yatta 书籍详情响应异常：${detailRes.response}`);
        }
        detail = detailRes.data;
      }
      const volume: Array<TGACore.Plugins.Yatta.Book.LocalVolume> = [];
      for (const item of detail.volume) {
        const cachedVolume = cached?.volume.find((i) => i.id === item.id);
        let story = cachedVolume?.story ?? "";
        if (story.length === 0 && item.storyId.length > 0) {
          try {
            console.info(`[components][material][download][${item.id}] 下载书籍正文：${item.name}`);
            const storyRes = await yattaTool.fetchJson<TGACore.Plugins.Yatta.Book.ReadableResponse>(
              `CHS/readable/Book${item.storyId}`,
            );
            if (storyRes.response !== 200) {
              throw new Error(`Yatta 书籍正文响应异常：${storyRes.response}`);
            }
            story = storyRes.data;
          } catch (e) {
            logger.default.warn(
              `[components][material][download][${item.id}] ${item.name} 书籍正文下载失败`,
            );
            logger.default.error(e);
          }
        } else if (story.length > 0) {
          console.info(`[components][material][download][${item.id}] 读取正文缓存：${item.name}`);
        }
        const localVolume = {
          ...item,
          vol: normalizeBookVolumeName(book.name),
          icon: book.icon,
          rank: book.rank,
          story,
        };
        if (!shouldKeepBookVolume(localVolume)) {
          logger.console.mark(
            `[components][material][download][${item.id}] ${item.name || "未命名"} 书籍卷数据无效，跳过`,
          );
          continue;
        }
        volume.push(localVolume);
      }
      const localBook: TGACore.Plugins.Yatta.Book.LocalBook = { ...detail, ...book, volume };
      await fs.writeJson(savePath, localBook, { spaces: 2 });
      bookList.push(localBook);
      console.info(
        `[components][material][download][${book.id}] 书籍处理完成：${book.name}，共 ${volume.length} 卷`,
      );
    } catch (e) {
      logger.default.warn(
        `[components][material][download][${book.id}] ${book.name} 书籍数据下载失败`,
      );
      logger.default.error(e);
    }
  }
  rawBooks = bookList;
  await fs.writeJson(path.join(jsonDir.src, "books.json"), rawBooks, { spaces: 2 });
  logger.default.info(
    `[components][material][download] 书籍数据下载完成，共 ${rawBooks.length} 项书籍`,
  );
} catch (e) {
  logger.default.error("[components][material][download] 下载书籍数据失败");
  logger.default.error(e);
  const cachedBooksPath = path.join(jsonDir.src, "books.json");
  if (fileCheck(cachedBooksPath, false)) {
    try {
      rawBooks = await fs.readJson(cachedBooksPath);
      logger.default.warn(
        `[components][material][download] 使用本地缓存书籍数据，共 ${rawBooks.length} 项书籍`,
      );
    } catch (cacheError) {
      logger.default.error("[components][material][download] 读取本地书籍缓存失败");
      logger.default.error(cacheError);
    }
  }
}

logger.default.info("[components][material][download] 开始下载材料数据");
type DownloadItem = { id: number; name: string; icon: string; detailPath?: string };
const downloadMap = new Map<number, DownloadItem>();
const bookIdSet = new Set(rawBooks.flatMap((book) => book.volume.map((volume) => volume.id)));
for (const item of rawMaterial) {
  if (IGNORE_MATERIAL_NAMES.has(item.name)) continue;
  downloadMap.set(Number(item.id), {
    id: Number(item.id),
    name: item.name,
    icon: item.icon,
    detailPath: `CHS/material/${item.id}`,
  });
}
for (const item of rawFood) {
  if (IGNORE_MATERIAL_NAMES.has(item.name)) continue;
  downloadMap.set(item.id, {
    id: item.id,
    name: item.name,
    icon: item.icon,
    detailPath: `CHS/food/${item.id}`,
  });
}
for (const item of rawMetadata) {
  if (!shouldConvertMaterial(item)) continue;
  downloadMap.set(item.Id, {
    id: item.Id,
    name: item.Name,
    icon: item.Icon,
    detailPath:
      item.TypeDescription === "食物"
        ? `CHS/food/${item.Id}`
        : bookIdSet.has(item.Id)
          ? undefined
          : `CHS/material/${item.Id}`,
  });
}
const metadataIdSet = new Set(rawMetadata.map((item) => item.Id));
const yattaIdSet = new Set(rawMaterial.map((item) => Number(item.id)));
const foodIdSet = new Set(rawFood.map((item) => item.id));
for (const book of rawBooks) {
  for (const volume of book.volume) {
    if (metadataIdSet.has(volume.id) || yattaIdSet.has(volume.id) || foodIdSet.has(volume.id)) {
      continue;
    }
    downloadMap.set(volume.id, {
      id: volume.id,
      name: volume.name,
      icon: volume.icon,
    });
  }
}
const downloadList = [...downloadMap.values()];
Counter.addTotal(downloadList.length * 2);

function validJsonFile(filePath: string): boolean {
  if (!fileCheck(filePath, false)) return false;
  try {
    const data = fs.readJsonSync(filePath);
    return typeof data === "object" && data !== null && !Array.isArray(data);
  } catch {
    return false;
  }
}

for (const item of downloadList) {
  const savePathJ = path.join(jsonDir.src, `${item.id}.json`);
  const savePathI = path.join(imgDir.src, `${item.id}.png`);
  const checkJ = validJsonFile(savePathJ);
  const checkI = fileCheck(savePathI, false);
  if (checkJ && checkI) {
    logger.console.mark(`[components][material][download][${item.id}] JSON 已存在，跳过下载`);
    logger.console.mark(`[components][material][download][${item.id}] 图片已存在，跳过下载`);
    Counter.Skip(2);
    continue;
  }
  if (checkJ) {
    logger.console.mark(`[components][material][download][${item.id}] JSON 已存在，跳过下载`);
    Counter.Skip();
  }
  if (checkI) {
    logger.console.mark(`[components][material][download][${item.id}] 图片已存在，跳过下载`);
    Counter.Skip();
  }
  if (!checkJ && item.detailPath !== undefined) {
    try {
      const res = await yattaTool.fetchJson<
        TGACore.Plugins.Yatta.Material.DetailResponse | TGACore.Plugins.Yatta.Food.DetailResponse
      >(item.detailPath);
      if (res.response !== 200) throw new Error(`Yatta 详情响应异常：${res.response}`);
      await fs.writeJson(savePathJ, res.data, { spaces: 2 });
      logger.default.info(
        `[components][material][download][${item.id}] ${item.name} JSON 下载完成`,
      );
      Counter.Success();
    } catch (e) {
      logger.default.warn(
        `[components][material][download][${item.id}] ${item.name} JSON 下载失败`,
      );
      logger.default.error(e);
      Counter.Fail();
    }
  } else if (!checkJ) {
    logger.console.mark(
      `[components][material][download][${item.id}] ${item.name} 无 Yatta 材料详情，使用书籍数据`,
    );
    Counter.Skip();
  }
  if (!checkI) {
    let buffer: Buffer;
    try {
      buffer = await fetchMaterialIcon(`${item.icon}.png`);
    } catch (e) {
      logger.default.warn(
        `[components][material][download][${item.id}] ${item.name} 图片下载失败，ItemIcon-Minimum 和 ItemIcon 中均不存在`,
      );
      logger.default.error(e);
      Counter.Fail();
      continue;
    }
    try {
      await sharp(buffer).toFile(savePathI);
      logger.default.info(`[components][material][download][${item.id}] ${item.name} 图片下载完成`);
      Counter.Success();
    } catch (e) {
      logger.default.warn(`[components][material][download][${item.id}] ${item.name} 图片保存失败`);
      logger.default.error(e);
      Counter.Fail();
    }
  }
}
Counter.End();

logger.default.info(`[components][material][download] 数据更新完成，耗时 ${Counter.getTime()}`);
Counter.EndAll();
Counter.Output();
