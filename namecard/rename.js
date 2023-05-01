/**
 * @file namecard rename.js
 * @description 重命名图片
 * @author BTMuli<bt-muli@outlook.com>
 * @version 1.0.0
 */

// Node
import path from "path";
import fs from "fs";
import sharp from "sharp";

// TGAssistant
import { ORI_DATA_PATH, DATA_PATH, ORI_SRC_PATH, SRC_PATH } from "../root.js";

const namecardDir = path.resolve(ORI_SRC_PATH, "namecard");
const profileDir = path.resolve(namecardDir, "profile");
const iconDir = path.resolve(namecardDir, "icon");
const bgDir = path.resolve(namecardDir, "bg");
const savePPath = path.resolve(SRC_PATH, "namecard", "profile");
const saveIPath = path.resolve(SRC_PATH, "namecard", "icon");
const saveBPath = path.resolve(SRC_PATH, "namecard", "bg");
const savePath = path.resolve(DATA_PATH, "namecards.json");

function sharpImg(i, name, type) {
  let transImg, readDir, saveDir;
  switch (type) {
    case "profile":
      readDir = profileDir;
      saveDir = savePPath;
      sharp(`${readDir}/${i}.webp`)
        .webp()
        .resize(840, 400, {
          // 放在左侧
          fit: sharp.fit.inside,
          // 居中
          position: sharp.strategy.entropy,
        })
        .toFile(`${saveDir}/${name}.webp`, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`profile ${name} 复制成功`);
          }
        });
      break;
    case "icon":
      readDir = iconDir;
      saveDir = saveIPath;
      sharp(`${readDir}/${i}.webp`)
        .webp()
        .resize(250, 165, {
          fit: sharp.fit.inside,
          position: sharp.strategy.entropy,
        })
        .toFile(`${saveDir}/${name}.webp`, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`icon ${name} 复制成功`);
          }
        });
      break;
    case "bg":
      readDir = bgDir;
      saveDir = saveBPath;
      sharp(`${readDir}/${i}.webp`)
        .webp()
        .resize(880, 140, {
          fit: sharp.fit.inside,
          position: sharp.strategy.entropy,
        })
        .toFile(`${saveDir}/${name}.webp`, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`bg ${name} 复制成功`);
          }
        });
      break;
    default:
      console.log("type error");
      return;
  }
}

const nameCardOriJson = JSON.parse(
  fs.readFileSync(path.resolve(ORI_DATA_PATH, "namecard", "namecard.json"))
);
const nameCardsData = {
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
};

nameCardOriJson.forEach((item) => {
  nameCardsData[item.type].push({
    name: item.name,
    description: item.description,
    icon: item.icon,
    bg: item.bg,
    profile: item.profile,
    type: item.type,
    source: item.source,
  });
  sharpImg(item.id, item.name, "profile");
  sharpImg(item.id, item.name, "icon");
  sharpImg(item.id, item.name, "bg");
});

// 排序
Object.keys(nameCardsData).forEach((key) => {
  nameCardsData[key].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
});

// 保存
fs.writeFileSync(savePath, JSON.stringify(nameCardsData, null, 2));
