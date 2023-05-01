/**
 * @file achievement merge.js
 * @description 合并成就数据，用于新建成就时的数据合并
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.0.0
 */

// Node
import fs from "fs";
import path from "path";
// TGAssitant
import { ORI_DATA_PATH, DATA_PATH } from "../root.js";

// 导出目录
const achievementSavePath = path.resolve(DATA_PATH, "achievements.json");
const achievementSeriesSavePath = path.resolve(DATA_PATH, "achievementSeries.json");
// 导出数据
const achievementData = {};
const seriesData = {};

// 元数据
const oriAchievementPath = path.resolve(ORI_DATA_PATH, "achievement");
// 来自 Snap.Hutao
const HutaoItemJson = JSON.parse(
  fs.readFileSync(path.resolve(oriAchievementPath, "HutaoItem.json"), "utf8")
);
// 来自 Paimon.moe
const PaimonJson = JSON.parse(
  fs.readFileSync(path.resolve(oriAchievementPath, "Paimon.json"), "utf8")
);
// 来自应用
const TGSeriesJson = JSON.parse(
  fs.readFileSync(path.resolve(oriAchievementPath, "TGSeries.json"), "utf8")
);
console.log(TGSeriesJson[1].card);

// func 数组扁平化
function flatArray(data) {
  return data.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flatArray(cur) : cur);
  }, []);
}

// func 获取最大的版本号
function getMaxVersion(data) {
  let maxVer = Math.max.apply(
    Math,
    data.map((o) => o.ver)
  );
  if (!maxVer.toString().includes(".")) {
    maxVer = maxVer + ".0";
  }
  return maxVer;
}

// 处理 Paimon.moe 的数据
Object.entries(PaimonJson).forEach(([key, series]) => {
  const achievementArray = flatArray(series.achievements);
  const seriesVersion = getMaxVersion(achievementArray);
  // 处理成就系列
  seriesData[key] = {
    id: Number(key),
    order: series.order,
    name: series.name,
    version: seriesVersion,
    // achievements: achievementArray.map((o) => o.id),
    // total_count: achievementArray.length,
    // completed_count: 0,
    card: "",
    icon: `/source/achievementSeries/${key}.webp`,
  }
  // 处理成就
  achievementArray.forEach((o) => {
    achievementData[o.id] = {
      id: o.id,
      series: Number(key),
      order: 0, // 处理胡桃的数据的时候添加
      name: o.name,
      description: o.desc,
      reward: o.reward,
      // completed: false,
      // completed_time: null,
      // progress: 0,
      version: o.ver,
    };
  });
});

// 处理 Snap.Hutao 的数据
HutaoItemJson.map((o) => {
  achievementData[o.Id].order = o.Order;
});

// 排序
const achievementArray = Object.values(achievementData).sort((a, b) => a.id - b.id);
const seriesArray = Object.values(seriesData).sort((a, b) => a.id - b.id);

// 重新赋值
const achievementJson = [];
const seriesJson = [];

achievementArray.forEach((o) => {
  achievementJson.push(o);
});

seriesArray.forEach((o) => {
  seriesJson.push(o);
});

// 保存数据
fs.writeFileSync(achievementSavePath, JSON.stringify(achievementJson, null, 2));
fs.writeFileSync(achievementSeriesSavePath, JSON.stringify(seriesJson, null, 2));

// 输出
console.log("Achievement data merged.");
