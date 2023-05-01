/**
 * @file calendar transData.js
 * @description 转换获取到的数据
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.0.0
 */

// Node.js
import fs from "node:fs";
import path from "node:path";
// Types
/// <reference path="./types.d.ts" />

// 读取数据
const dataDir = "./calendar/data";
const dataRead = fs.readFileSync(path.join(dataDir, "oriData.json"), "utf-8");
const dataJson = JSON.parse(dataRead);
console.log("原始数据长度 ", dataJson.data.list.length);
// 转换数据
const dataGet = dataJson.data.list.filter((item) => item.kind === "2");
console.log("kind 为 2 的数据长度 ", dataGet.length);
// 写入数据
fs.writeFileSync(path.join(dataDir, "firstData.json"), JSON.stringify(dataGet, null, 2));
// set 数据
const charactorList = []; // 角色
const weaponList = []; // 武器
const materialList = []; // 材料
const sourceList = []; // 来源
const dataSet = new Set();
// 遍历数据
await dataGet.map((item) => {
  // 根据 break_type 分类
  // 1 为武器, 2 为角色
  if (item.break_type === "1") {
    const weaponItem = {
      content_id: item.content_id,
      name: item.title,
      url: item.img_url,
      source: item.contentSource.length === 0 ? "" : item.contentSource[0].title,
      materialList: item.contentInfos.map((content) => content.title),
      days: item.drop_day,
    };
    if (!dataSet.has(weaponItem.content_id)) {
      weaponList.push(weaponItem);
      dataSet.add(weaponItem.content_id);
    }
  } else if (item.break_type === "2") {
    const charactorItem = {
      content_id: item.content_id,
      name: item.title,
      url: item.img_url,
      source: item.contentSource.length === 0 ? "" : item.contentSource[0].title,
      materialList: item.contentInfos.map((content) => content.title),
      days: item.drop_day,
    };
    if (!dataSet.has(charactorItem.content_id)) {
      charactorList.push(charactorItem);
      dataSet.add(charactorItem.content_id);
    }
  }
  // 写入材料数据
  item.contentInfos.map((content) => {
    const materialItem = {
      content_id: content.content_id,
      name: content.title,
      icon: content.img_url,
    };
    if (!dataSet.has(materialItem.content_id)) {
      materialList.push(materialItem);
      dataSet.add(materialItem.content_id);
    }
  });
});
// 列表排序
charactorList.sort((a, b) => a.content_id - b.content_id);
weaponList.sort((a, b) => a.content_id - b.content_id);
sourceList.sort((a, b) => a.name.localeCompare(b.name));
// 写入数据
fs.writeFileSync(
  path.join(dataDir, "charactorData.json"),
  JSON.stringify([...charactorList], null, 2)
);
fs.writeFileSync(path.join(dataDir, "weaponData.json"), JSON.stringify([...weaponList], null, 2));
fs.writeFileSync(
  path.join(dataDir, "materialData.json"),
  JSON.stringify([...materialList], null, 2)
);
// 数据长度比较
console.log("角色数据长度 ", charactorList.length);
console.log("武器数据长度 ", weaponList.length);
