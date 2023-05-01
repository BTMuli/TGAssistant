/**
 * @file calendar addInfo.js
 * @description 添加星级信息
 * @author BTMuli<bt-muli@outlook.com>
 */

import fs from "fs";
import path from "path";

const dataPath = "./calendar/data/transData.json";
const dataCPath = "./calendar/data/charactorData.json";
const dataWPath = "./calendar/data/weaponData.json";
const dataMPath = "./calendar/data/materialData.json";
const dataCA = "./compare/transData/avatar.json";
const dataCW = "./compare/transData/weapon.json";
const dataJson = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
const dataCJson = JSON.parse(fs.readFileSync(dataCPath, "utf-8"));
const dataWJson = JSON.parse(fs.readFileSync(dataWPath, "utf-8"));
const dataMJson = JSON.parse(fs.readFileSync(dataMPath, "utf-8"));
const dataCAJson = JSON.parse(fs.readFileSync(dataCA, "utf-8"));
const dataCWJson = JSON.parse(fs.readFileSync(dataCW, "utf-8"));

// 创建数据
const newData = {};

function getMiniItemLv1(name, type) {
  return name.map((item) => {
    if (type === "material") {
      return {
        star: getInfoLv3(item),
        content_id: getInfoLv1(item, type),
        name: item,
        icon: `/source/calendar/${type}/${item}.webp`,
      };
    } else {
      const itemInfo = getInfoLv2(item, type);
      return {
        id: itemInfo.id,
        star: itemInfo.star,
        content_id: getInfoLv1(item, type),
        name: item,
        icon: `/source/calendar/${type}/${item}.webp`,
      };
    }
  });
}

function getMiniItemLv2(data, type) {
  return {
    title: data.area + " " + data.source,
    materials: getMiniItemLv1(data.materials, "material").sort(
      // 先按照 star 降序，再根据 content_id 升序
      (a, b) => b.star - a.star || a.content_id - b.content_id
    ),
    contents: getMiniItemLv1(data.contents, type).sort(
      // 先按照 star 降序，再按照 id 升序
      (a, b) => b.star - a.star || a.id - b.id
    ),
  };
}

function getMiniItemLv3(data, type) {
  return {
    0: getMiniItemLv2(data.Mondstadt, type),
    1: getMiniItemLv2(data.Liyue, type),
    2: getMiniItemLv2(data.Inazuma, type),
    3: getMiniItemLv2(data.Sumeru, type),
  };
}

function getMiniItemLv4(data) {
  return {
    characters: getMiniItemLv3(data.characters, "character"),
    weapons: getMiniItemLv3(data.weapons, "weapon"),
  };
}

function getInfoLv1(data, type) {
  let itemF;
  if (type === "character") {
    itemF = dataCJson.find((item) => item.name === data);
  } else if (type === "weapon") {
    itemF = dataWJson.find((item) => item.name === data);
  } else if (type === "material") {
    itemF = dataMJson.find((item) => item.name === data);
  }
  return Number(itemF.content_id);
}

function getInfoLv2(data, type) {
  if (type === "character") {
    return dataCAJson[data];
  } else if (type === "weapon") {
    return dataCWJson[data];
  }
}

function getInfoLv3(data) {
  // 获取最后两个字
  const endStr = data.slice(-2);
  const star1List = [
    "始龀",
    "铅丹",
    "枷锁",
    "一粒",
    "破瓦",
    "光砂",
    "瑚枝",
    "恶尉",
    "明惠",
    "残响",
    "铜符",
    "追忆",
  ];
  const satr2List = [
    "裂齿",
    "汞丹",
    "铁链",
    "一片",
    "残垣",
    "辉岩",
    "玉枝",
    "欢喜",
    "虎啮",
    "余光",
    "铁符",
    "恩惠",
  ];
  const star3List = [
    "断牙",
    "金丹",
    "镣铐",
    "一角",
    "断片",
    "圣骸",
    "琼枝",
    "亲爱",
    "梦想",
    "银符",
    "哀思",
  ];
  const star4List = [
    "怀乡",
    "转还",
    "理想",
    "碎梦",
    "神体",
    "一块",
    "金枝",
    "勇武",
    "鬼人",
    "旧日",
    "金符",
    "真谛",
  ];
  // 天赋材料
  if (data.endsWith("教导")) {
    return 2;
  }
  if (data.endsWith("指引")) {
    return 3;
  }
  if (data.endsWith("哲学")) {
    return 4;
  }
  if (star1List.includes(endStr)) {
    return 1;
  }
  if (satr2List.includes(endStr)) {
    return 2;
  }
  if (star3List.includes(endStr)) {
    return 3;
  }
  if (star4List.includes(endStr)) {
    return 4;
  }
}

// 周日的数据作为基础数据
newData[0] = getMiniItemLv4(dataJson[6]);
// 因为周一跟周四是一样的，所以舍弃周四的数据
newData[1] = getMiniItemLv4(dataJson[0]);
// 因为周二跟周五是一样的，所以舍弃周五的数据
newData[2] = getMiniItemLv4(dataJson[1]);
// 因为周三跟周六是一样的，所以舍弃周六的数据
newData[3] = getMiniItemLv4(dataJson[2]);
// 写入数据
const newPath = "./calendar/data/newData.json";
fs.writeFileSync(newPath, JSON.stringify(newData, null, 2));
