/**
 * @file character download.js
 * @description 下载角色资源
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
const dirCharacter = path.resolve(ORI_DATA_PATH, "character");
const dirCharacterImg = path.resolve(ORI_SRC_PATH, "character");
// check if dirCharacter exists
if (!fs.existsSync(dirCharacter)) {
  fs.mkdirSync(dirCharacter);
}
// check if dirCharacterImg exists
if (!fs.existsSync(dirCharacterImg)) {
  fs.mkdirSync(dirCharacterImg);
}

const ambrPath = path.resolve(dirCharacter, "ambr.json");
const mysPath = path.resolve(dirCharacter, "mys.json");
const ambrUrl = "https://api.ambr.top/v2/chs/avatar?vh=37F2";
const mysUrl =
  "https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/home/content/list?app_sn=ys_obc&channel_id=189";
const ambrImgUrl = "https://api.ambr.top/assets/UI/";

// download ambr.json
// await fetch(ambrUrl).then(async (res) => {
//   const data = (await res.json()).data;
//   fs.writeFileSync(ambrPath, JSON.stringify(data, null, 2));
// });
// console.log("ambr.json 下载完成");

// download mys.json
await fetch(mysUrl).then(async (res) => {
  const data = (await res.json()).data.list[0].children[0].list;
  fs.writeFileSync(mysPath, JSON.stringify(data, null, 2));
});
console.log("mys.json 下载完成");

const ambrJson = JSON.parse(fs.readFileSync(ambrPath, "utf8"));
let downloadSet = new Set();
let totalSet = new Set();

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
          console.log(`下载 ${name} 头像成功，大小为 ${buffer.byteLength} 字节`);
        }
      });
  });
}

Object.keys(ambrJson.items).forEach((key) => {
  const item = ambrJson.items[key];
  const id = item.id;
  const icon = item.icon;
  const savePath = path.resolve(dirCharacterImg, id + ".png");
  totalSet.add(id);
  if (fs.existsSync(savePath)) {
    return;
  }
  console.log(`下载 ${item.name} 头像`);
  downloadSet.add(id);
  const downloadUrl = `${ambrImgUrl}${icon}.png`;
  downloadSet.add(downloadImg(downloadUrl, name, savePath));
  totalSet.add(name);
});

console.log(`共下载 ${downloadSet.size} 个角色头像，共 ${totalSet.size} 个角色头像`);
