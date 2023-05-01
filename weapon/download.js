/**
 * @file weapon download
 * @description 下载武器资源
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
const dirWeapon = path.resolve(ORI_DATA_PATH, "weapon");
const dirWeaponImg = path.resolve(ORI_SRC_PATH, "weapon");
// check if dirWeapon exists
if (!fs.existsSync(dirWeapon)) {
  fs.mkdirSync(dirWeapon);
}
// check if dirWeaponImg exists
if (!fs.existsSync(dirWeaponImg)) {
  fs.mkdirSync(dirWeaponImg);
}

const ambrPath = path.resolve(dirWeapon, "ambr.json");
const mysPath = path.resolve(dirWeapon, "mys.json");
const ambrUrl = "https://api.ambr.top/v2/chs/weapon?vh=37F2";
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
// await fetch(mysUrl).then(async (res) => {
//   const data = (await res.json()).data.list[0].children[1].list;
//   fs.writeFileSync(mysPath, JSON.stringify(data, null, 2));
// });
// console.log("mys.json 下载完成");

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
          console.log(`下载 ${name} icon 成功，大小为 ${buffer.byteLength} 字节`);
        }
      });
  });
}

Object.keys(ambrJson.items).forEach((key) => {
  const item = ambrJson.items[key];
  const id = item.id;
  const icon = item.icon;
  const savePath = path.resolve(dirWeaponImg, id + ".png");
  totalSet.add(id);
  if (fs.existsSync(savePath)) {
    return;
  }
  console.log(`下载 ${item.name} icon`);
  downloadSet.add(id);
  const downloadUrl = `${ambrImgUrl}${icon}.png`;
  downloadSet.add(downloadImg(downloadUrl, item.name, savePath));
});

console.log(`共下载 ${downloadSet.size} 个武器 icon，共 ${totalSet.size} 个武器 icon`);
