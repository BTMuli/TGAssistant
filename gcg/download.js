/**
 * @file gcg download.js
 * @description 用于下载图片
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.0.0
 */

// Node
import fs from "fs";
import path from "path";
import sharp from "sharp";
import fetch from "node-fetch";
// TGAssistant
import { ORI_DATA_PATH, ORI_SRC_PATH } from "../root.js";

// path
const dirGcg = path.resolve(ORI_DATA_PATH, "gcg");
const dirGcgImg = path.resolve(ORI_SRC_PATH, "gcg");
// check if dirGcg exists
if (!fs.existsSync(dirGcg)) {
  fs.mkdirSync(dirGcg);
}
// check if dirGcgImg exists
if (!fs.existsSync(dirGcgImg)) {
  fs.mkdirSync(dirGcgImg);
}

const ambrPath = path.resolve(dirGcg, "ambr.json");
const ambrUrl = "https://api.ambr.top/v2/chs/gcg?vh=37F2";
const ambrImgUrl = "https://api.ambr.top/assets/UI/gcg/";
const mysPath = path.resolve(dirGcg, "mys.json");
const mysUrl =
  "https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/home/content/list?app_sn=ys_obc&channel_id=231";

// download ambr.json
// await fetch(ambrUrl).then(async (res) => {
//   const data = (await res.json()).data.items;
//   fs.writeFileSync(ambrPath, JSON.stringify(data, null, 2));
// });
// console.log("ambr.json 下载完成");

// download mys.json
// await fetch(mysUrl).then(async (res) => {
//   const data = (await res.json()).data.list[0].children;
//   fs.writeFileSync(mysPath, JSON.stringify(data, null, 2));
// });
// console.log("mys.json 下载完成");

const ambrJson = JSON.parse(fs.readFileSync(ambrPath, "utf8"));
const mysJson = JSON.parse(fs.readFileSync(mysPath, "utf8"));
let downloadSet = new Set();
let totalSet = new Set();

// 添加 set
fs.readdirSync(dirGcgImg).forEach((file) => {
  totalSet.add(file.split(".")[0]);
});

async function downloadImg(url, name, savePath) {
  return await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "image/png",
    },
  }).then(async (res) => {
    const buffer = await res.arrayBuffer();
    sharp(Buffer.from(buffer))
      .png()
      .toFile(savePath, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`下载 ${name} 成功，大小为 ${buffer.byteLength} 字节`);
        }
      });
  });
}

Object.keys(ambrJson).forEach(async (key) => {
  const item = ambrJson[key];
  const name = item.name;
  const icon = item.icon;
  const savePath = path.join(dirGcgImg, `${name}.png`);
  if (name === "？？？" || totalSet.has(item.name)) {
    return;
  }
  console.log(`开始下载 ${name}`);
  totalSet.add(name);
  downloadSet.add(name);
  const downloadUrl = `${ambrImgUrl}${icon}.png`;
  await downloadImg(downloadUrl, name, savePath);
});

await mysJson.map((item) => {
  item.list.map(async (card) => {
    const cardName = card.title;
    const savePath = path.join(dirGcgImg, `${cardName}.png`);
    if (totalSet.has(cardName)) {
      return;
    }
    console.log(`开始下载 ${cardName}`);
    totalSet.add(cardName);
    downloadSet.add(cardName);
    const downloadUrl = card.icon;
    await downloadImg(downloadUrl, cardName, savePath);
  });
});

console.log(`\n共下载 ${downloadSet.size} 张图片，共 ${totalSet.size} 张图片`);
