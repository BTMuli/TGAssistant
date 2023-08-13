/**
 * @file gcg convert.js
 * @description 处理 gcg 原始图像&JSON 数据，生成可用的图像&JSON 数据，以及对应的图像文件
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.3.0
 */

// Node
import path from "node:path";
import fs from "node:fs";
import sharp from "sharp";
// TGAssistant
import { consoleLogger, defaultLogger } from "../tools/logger.js";
import pathList from "../../root.js";
import { dirCheck } from "../tools/utils.js";

defaultLogger.info("[GCGenerator][转换] 正在运行 convert.js");

const srcJsonDir = path.resolve(pathList.src.json, "gcg");
const srcImgDir = path.resolve(pathList.src.img, "gcg");
const outImgDir = path.resolve(pathList.out.img, "gcg");
const srcJsonMys = path.resolve(srcJsonDir, "mys.json");
const srcJsonAmber = path.resolve(srcJsonDir, "amber.json");
const jsonSavePath = path.resolve(pathList.out.json, "GCG.json");

// 检测资源文件是否存在
if (!fs.existsSync(srcJsonMys)) {
  defaultLogger.error("[GCG][转换] 未找到原始数据文件 mys.json，请执行 download.js");
  process.exit(1);
}
if (!fs.existsSync(srcJsonAmber)) {
  defaultLogger.error("[GCG][转换] 未找到原始数据文件 amber.json，请执行 download.js");
  process.exit(1);
}
// 检查输出目录是否存在
dirCheck(outImgDir);

const gcgData = [];

// 获取 AmberJson 的所有图像数据
defaultLogger.info("[GCG][转换] 正在读取 amber.json");
const amberJson = JSON.parse(fs.readFileSync(srcJsonAmber, "utf-8"));
const mysJson = JSON.parse(fs.readFileSync(srcJsonMys, "utf-8"));
const amberKeys = Object.keys(amberJson);
const gcgTitleSet = new Set();
amberKeys.map((key) => {
  const item = amberJson[key];
  gcgTitleSet.add(item.name);
});
defaultLogger.info(`[GCG][转换] amber.json 读取完成，共 ${gcgTitleSet.size} 个图像数据`);

// 添加卡牌数据-amber.json
for (const key of amberKeys) {
  const item = amberJson[key];
  consoleLogger.info(`[GCG][转换] 正在读取 ${item["name"]} 的数据`);
  const gcgItem = {
    id: item["id"],
    contentId: -1,
    name: item["name"],
    type: getAmberType(item["type"]),
    icon: `/WIKI/GCG/normal/${item["name"]}.webp`,
    tags: item["tags"], // todo: 后续需要处理
  };
  gcgData.push(gcgItem);
  convertImg(gcgItem);
}

// 添加卡牌数据-mys.json
for (const itemList of mysJson) {
  if (itemList.name === "魔物牌") {
    await itemList.list.map((item) => {
      const gcgItem = {
        id: 0,
        contentId: item["content_id"],
        name: item.title,
        type: "魔物牌",
        icon: `/WIKI/GCG/normal/${item.title}.webp`,
        tags: "", // todo: 后续需要处理
      };
      gcgData.push(gcgItem);
      convertImg(gcgItem);
    });
  } else {
    itemList.list.map((item) => {
      const itemFind = gcgData.find((gcgItem) => gcgItem.name === item.title);
      if (itemFind) {
        itemFind.contentId = item["content_id"];
        gcgTitleSet.delete(item.title);
      } else {
        consoleLogger.warn(`[GCG][转换] 未找到 ${item.title}`);
      }
    });
  }
}

gcgData.sort((a, b) => a.type.localeCompare(b.type) || a.id - b.id || b.contentId - a.contentId);
fs.writeFileSync(jsonSavePath, JSON.stringify(gcgData, null, 2), "utf-8");
defaultLogger.info(`[GCG][转换] GCG.json 保存完成，共 ${gcgData.length} 个图像数据`);

if (gcgTitleSet.size > 0) {
  defaultLogger.warn(`[GCG][转换] amber.json 中有 ${gcgTitleSet.size} 个图像未录入 mysJson`);
  for (const title of gcgTitleSet) {
    consoleLogger.warn(`[GCG][转换] 未使用的图像数据：${title}`);
  }
}

defaultLogger.info("[GCG][转换] convert.js 运行结束");

// 用到的函数
/**
 * @description 转换 amber.json 的 type 字段
 * @since 1.3.0
 * @param {string} type 原始 type 字段
 * @returns {string} 转换后的 type 字段
 */
function getAmberType(type) {
  switch (type) {
    case "characterCard":
      return "角色牌";
    case "actionCard":
      return "行动牌";
    default:
      defaultLogger.warn(`[GCG][转换] 未知的 type 字段：${type}`);
      return type;
  }
}

/**
 * @description 转换图像
 * @since 1.1.0
 * @param {object} item GCG JSON 数据
 * @returns {void}
 */
function convertImg(item) {
  const srcImgPath = path.resolve(srcImgDir, `${item.name}.png`);
  const outImgPath = path.resolve(outImgDir, `${item.name}.webp`);
  gcgTitleSet.delete(item.name);
  if (!fs.existsSync(srcImgPath)) {
    defaultLogger.error(`[GCG][转换][${item.type}] 未找到 ${item.name} 的图像文件`);
    return;
  }
  if (fs.existsSync(outImgPath)) {
    consoleLogger.mark(`[GCG][转换][${item.type}] ${item.name} 图像已存在，跳过`);
    return;
  }
  sharp(srcImgPath)
    .png()
    .toFormat("webp")
    .toFile(outImgPath, (err) => {
      if (err) {
        defaultLogger.error(`[GCG][转换][${item.type}] ${item.name} 图像转换失败`);
        return;
      }
      defaultLogger.info(`[GCG][转换][${item.type}] ${item.name} 图像转换成功`);
    });
}
