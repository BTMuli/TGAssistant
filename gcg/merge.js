/**
 * @file gcg merge.js
 * @description 生成 GCG.json
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.0.0
 */

// Node
import fs from "fs";
import path from "path";
// TGAssitant
import { ORI_DATA_PATH, DATA_PATH } from "../root.js";

const oriDir = path.join(ORI_DATA_PATH, "gcg");
const oriJson = JSON.parse(fs.readFileSync(path.join(oriDir, "mys.json")));
const ambrJson = JSON.parse(fs.readFileSync(path.join(oriDir, "ambr.json")));
const savePath = path.join(DATA_PATH, "GCG.json");

let dataJson = [];

// 获取 id
function findId(name) {
  return (
    Object.keys(ambrJson).find((key) => {
      if (ambrJson[key].name === name) {
        return key;
      }
    }) || null
  );
}

await oriJson.map((item) => {
  const typeName = item.name;
  item.list.forEach((card) => {
    const cardName = card.title;
    const id = findId(cardName);
    const cardIcon = `/WIKI/GCG/normal/${cardName}.webp`;
    dataJson.push({
      id: Number(id),
      content_id: card.content_id,
      name: cardName,
      type: typeName,
      icon: cardIcon,
    });
  });
});
// 按照 name 排序
dataJson.sort((a, b) => {
  return a.type.localeCompare(b.type) || a.id - b.id || a.content_id - b.content_id;
});

fs.writeFileSync(savePath, JSON.stringify(dataJson, null, 2), "utf8");
