/**
 * @file achievements update.js
 * @description 更新成就数据，用于版本更新
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.0.0
 */

// Node
import fs from "fs";
import path from "path";
// TSAssistant
import { ORI_DATA_PATH, DATA_PATH } from "../root.js";

// path
const oriDataPath = path.resolve(ORI_DATA_PATH, "achievement");
const saveAPath = path.resolve(DATA_PATH, "achievements.json");
const saveSPath = path.resolve(DATA_PATH, "achievementSeries.json");

// data
const nowVersion = "3.6";
const HIJson = JSON.parse(fs.readFileSync(path.resolve(oriDataPath, "HutaoItem.json"), "utf-8"));
const HGJson = JSON.parse(fs.readFileSync(path.resolve(oriDataPath, "HutaoGoal.json"), "utf-8"));
const TGAJson = JSON.parse(
  fs.readFileSync(path.resolve(oriDataPath, "TGAchievement.json"), "utf-8")
);
const TGSJson = JSON.parse(fs.readFileSync(path.resolve(oriDataPath, "TGSeries.json"), "utf-8"));

// 处理胡桃的数据
const achievementData = JSON.parse(JSON.stringify(TGAJson));
const seriesData = JSON.parse(JSON.stringify(TGSJson));
// 添加新系列
await HGJson.forEach((o) => {
  if (seriesData[o.Id]) {
    return;
  }
  console.log(`添加成就系列 ${o.Name}`);
  seriesData[o.Id] = {
    id: o.Id,
    order: o.Order,
    name: o.Name,
    version: nowVersion,
    // achievements: [],
    // total_count: 0,
    // completed_count: 0,
    card: "",
    icon: `/source/achievementSeries/${o.Id}.webp`,
  };
});
// 添加新成就
HIJson.forEach((o) => {
  if (achievementData[o.Id]) {
    return;
  }
  console.log(`添加成就 ${o.Title}`);
  achievementData[o.Id] = {
    id: o.Id,
    series: o.Goal,
    order: o.Order,
    name: o.Title,
    description: o.Description,
    reward: Number(o.FinishReward.Count),
    // completed: false,
    // completed_time: null,
    // progress: 0,
    version: nowVersion,
  };
  seriesData[o.Goal].achievements.push(o.Id);
  seriesData[o.Goal].total_count++;
});

// 保存
fs.writeFileSync(saveAPath, JSON.stringify(achievementData, null, 2));
fs.writeFileSync(saveSPath, JSON.stringify(seriesData, null, 2));
