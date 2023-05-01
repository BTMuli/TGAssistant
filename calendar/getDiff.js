/**
 * @file calendar getDiff.js
 * @description 获取转换数据
 * @author BTMuli<bt-muli@outlook.com>
 * @version 1.0.0
 */

import fs from "node:fs";
import path from "node:path";

const dataDir = "./calendar/data";
const dataC = JSON.parse(fs.readFileSync(path.join(dataDir, "charactorData.json")));
const dataW = JSON.parse(fs.readFileSync(path.join(dataDir, "weaponData.json")));

const diffData = {};
// 基本数据

const talentC = new Set();
dataW.map((item) => {
  // 获取 materialList[0] 最后两个字
  try {
    const talent = item.materialList[2].slice(-2);
    if (talentC.has(talent)) return;
    talentC.add(talent);
  } catch (error) {
    console.log(item.name);
  }
  // const talent = item.materialList[3].slice(-2);
  // if (talentC.has(talent)) return;
  // talentC.add(talent);
});
console.log("sourceW", talentC);
