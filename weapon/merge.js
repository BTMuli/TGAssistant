/**
 * @file weapon merge.js
 * @description 生成 weapon.json
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.0.0
 */

// Node
import fs from "fs";
import path from "path";
// TGAssitant
import { ORI_DATA_PATH, DATA_PATH } from "../root.js";

const oriDir = path.join(ORI_DATA_PATH, "weapon");
const ambrJson = JSON.parse(fs.readFileSync(path.join(oriDir, "ambr.json")));
const mysJson = JSON.parse(fs.readFileSync(path.join(oriDir, "mys.json")));
const savePath = path.join(DATA_PATH, "weapon.json");

let dataJson = [];

// 转换数据
function convertWeapon(data) {
  const weaponType = {
    WEAPON_SWORD_ONE_HAND: "/icon/weapon/单手剑.webp",
    WEAPON_CLAYMORE: "/icon/weapon/双手剑.webp",
    WEAPON_CATALYST: "/icon/weapon/法器.webp",
    WEAPON_POLE: "/icon/weapon/长柄武器.webp",
    WEAPON_BOW: "/icon/weapon/弓.webp",
  };
  return weaponType[data];
}

function getContentId(name) {
  const item = mysJson.find((item) => item.title === name);
  return item ? item.content_id : null;
}

Object.keys(ambrJson.items).forEach((key) => {
  const item = ambrJson.items[key];
  // if (item.name === "旅行者" || item.name === "绮良良") return;
  dataJson.push({
    id: item.id,
    content_id: getContentId(item.name),
    name: item.name,
    star: item.rank,
    bg: `/icon/bg/${item.rank}-Star.webp`,
    type: convertWeapon(item.type),
    icon: `/WIKI/weapon/icon/${item.id}.webp`,
  });
});

// 排序
dataJson.sort((a, b) => {
  // 先按 star 降序，再按 id 降序
  return b.star - a.star || b.id - a.id;
});

// 保存
fs.writeFileSync(savePath, JSON.stringify(dataJson, null, 2));
