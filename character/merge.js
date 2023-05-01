/**
 * @file character merge.js
 * @description 生成 character.json
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.0.0
 */

// Node
import fs from "fs";
import path from "path";
// TGAssitant
import { ORI_DATA_PATH, DATA_PATH } from "../root.js";

const oriDir = path.join(ORI_DATA_PATH, "character");
const ambrJson = JSON.parse(fs.readFileSync(path.join(oriDir, "ambr.json")));
const mysJson = JSON.parse(fs.readFileSync(path.join(oriDir, "mys.json")));
const savePath = path.join(DATA_PATH, "character.json");

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

function convertElement(data) {
  const elementType = {
    Ice: "/icon/element/冰元素.webp",
    Wind: "/icon/element/风元素.webp",
    Fire: "/icon/element/火元素.webp",
    Water: "/icon/element/水元素.webp",
    Rock: "/icon/element/岩元素.webp",
    Electric: "/icon/element/雷元素.webp",
    Grass: "/icon/element/草元素.webp",
  };
  return elementType[data];
}

function getContentId(name) {
  const item = mysJson.find((item) => item.title === name);
  return item ? item.content_id : null;
}

Object.keys(ambrJson.items).forEach((key) => {
  const item = ambrJson.items[key];
  if (item.name === "旅行者" || item.name === "绮良良") return;
  dataJson.push({
    id: item.id,
    content_id: getContentId(item.name),
    name: item.name,
    star: item.rank,
    bg: `/icon/bg/${item.rank}-Star.webp`,
    element: convertElement(item.element),
    weapon: convertWeapon(item.weaponType),
    icon: `/WIKI/character/icon/${item.id}.webp`,
  });
});

// 排序
dataJson.sort((a, b) => {
  // 先按 star 降序，再按 id 升序
  return b.star - a.star || b.id - a.id;
});

// 保存
fs.writeFileSync(savePath, JSON.stringify(dataJson, null, 2));
