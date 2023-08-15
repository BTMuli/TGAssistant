/**
 * @file achievements convert.js
 * @description 转换成就数据，生成目标数据文件
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.3.0
 */

// Node
import path from "node:path";
import fs from "node:fs";
// TGAssistant
import { consoleLogger, defaultLogger } from "../tools/logger.js";
import pathList, { GENSHIN_VER } from "../../root.js";
import { dirCheck, fileExist } from "../tools/utils.js";

defaultLogger.info("[成就][转换] 正在运行 convert.js");

// 检测目录是否存在
const srcDir = path.join(pathList.src.json, "achievements");
const dataDir = path.join(pathList.out.json);
dirCheck(srcDir);
dirCheck(dataDir);

const srcList = [
  {
    name: "胡桃-成就",
    file: path.resolve(srcDir, "achievement.json"),
    data: {},
  },
  {
    name: "胡桃-成就系列",
    file: path.resolve(srcDir, "achievementGoal.json"),
    data: [],
  },
  {
    name: "Paimon.moe-成就",
    file: path.resolve(srcDir, "Paimon.json"),
    data: {},
  },
];

// 检测数据文件是否存在
srcList.forEach((src) => {
  if (!fileExist(src.file)) {
    defaultLogger.error(`[成就][转换] ${src.name} 文件不存在，请先执行 download.js`);
    process.exit(1);
  }
});

const saveData = {
  achievements: {
    name: "成就",
    file: "achievements.json",
    savePath: path.resolve(dataDir, "achievements.json"),
    data: [],
  },
  series: {
    name: "成就系列",
    file: "achievementSeries.json",
    savePath: path.resolve(dataDir, "achievementSeries.json"),
    data: [],
  },
};

const tempData = {
  achievements: [],
  series: [],
};

// 读取数据
srcList.forEach((src) => {
  src.data = JSON.parse(fs.readFileSync(src.file, "utf-8"));
});

// 添加成就
consoleLogger.info("[成就][转换] 处理成就数据");

// 处理胡桃的成就数据
consoleLogger.info("[成就][转换] 处理胡桃的成就数据");
srcList[0].data.forEach((item) => {
  tempData.achievements.push({
    id: item["Id"],
    series: item["Goal"],
    order: item["Order"],
    name: item["Title"],
    description: item["Description"],
    reward: item["FinishReward"]["Count"],
    version: "",
  });
  consoleLogger.mark(`[成就][转换][胡桃][${item["Id"]}] 添加成就 ${item["Title"]}`);
});

// 处理 Paimon.moe 的数据
consoleLogger.info("[成就][转换] 添加成就 version");
tempData.achievements.forEach((item) => {
  const seriesId = item.series;
  if (srcList[2].data[seriesId] === undefined) {
    item.version = GENSHIN_VER;
    consoleLogger.warn(
      `[成就][转换][Paimon.moe][${item["id"]}] ${item["name"]} 成就版本为 ${item.version}`,
    );
  } else {
    const achievements = flatArray(srcList[2].data[seriesId]["achievements"]);
    const itemFind = achievements.find((o) => o["id"] === item.id);
    if (itemFind === undefined) {
      item.version = GENSHIN_VER;
      consoleLogger.warn(
        `[成就][转换][Paimon.moe][${item["id"]}] ${item["name"]} 成就版本为 ${item.version}`,
      );
    } else {
      item.version = itemFind["ver"];
      consoleLogger.mark(
        `[成就][转换][Paimon.moe][${item["id"]}] ${item["name"]} 成就版本为 ${item.version}`,
      );
    }
  }
});

// 添加成就系列
consoleLogger.info("[成就][转换] 处理成就系列数据");

// 处理胡桃的成就系列数据
consoleLogger.info("[成就][转换] 处理胡桃的成就系列数据");
Array.from(srcList[1].data).forEach((item) => {
  tempData.series.push({
    id: item["Id"],
    order: item["Order"],
    name: item["Name"],
    version: "",
    card: "",
    icon: `/icon/achievement/${item["Icon"]}.webp`,
  });
  consoleLogger.mark(`[成就][转换][胡桃][${item["Id"]}] 添加成就系列 ${item["Name"]}`);
});

// 处理 Paimon.moe 的数据
consoleLogger.info("[成就][转换] 添加成就系列 version");
tempData.series.forEach((item) => {
  if (srcList[2].data[item.id] === undefined) {
    item.version = GENSHIN_VER;
    consoleLogger.warn(
      `[成就][转换][Paimon.moe][${item["id"]}] ${item["name"]} 成就系列版本为 ${item.version}`,
    );
  } else {
    const achievements = flatArray(srcList[2].data[item.id]["achievements"]);
    // 获取 achievements.ver 的最大值
    item.version = Math.max(...achievements.map((o) => o["ver"])).toFixed(1);
    consoleLogger.mark(
      `[成就][转换][Paimon.moe][${item["id"]}] ${item["name"]} 成就系列版本为 ${item.version}`,
    );
  }
});

// 排序
Object.values(tempData.achievements)
  .sort((a, b) => a.id - b.id)
  .forEach((o) => {
    saveData.achievements.data.push(o);
  });
Object.values(tempData.series)
  .sort((a, b) => a.id - b.id)
  .forEach((o) => {
    saveData.series.data.push(o);
  });

// 保存数据
fs.writeFileSync(
  saveData.achievements.savePath,
  JSON.stringify(saveData.achievements.data, null, 2),
);
fs.writeFileSync(saveData.series.savePath, JSON.stringify(saveData.series.data, null, 2));

defaultLogger.info("[成就][转换] merge.js 运行完成，请执行 namecard/update.js 更新成就系列数据");

// 用到的函数

/**
 * @description 递归将多维数组转换为一维数组
 * @since 1.1.0
 * @param {Array} data
 * @returns {Array} 一维数组
 */
function flatArray(data) {
  return data.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flatArray(cur) : cur);
  }, []);
}
