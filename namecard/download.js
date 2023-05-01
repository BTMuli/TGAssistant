/**
 * @file download.js
 * @description 下载来自 HoneyHunterWorld 的图像资源
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.0.0
 */

// Node
import sharp from "sharp";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
// TSAssistant
import { ORI_SRC_PATH } from "../root.js";

// path
const namecardDir = path.resolve(ORI_SRC_PATH, "namecard");
const profileDir = path.resolve(namecardDir, "profile");
const iconDir = path.resolve(namecardDir, "icon");
const bgDir = path.resolve(namecardDir, "bg");
// check if exists
if (!fs.existsSync(namecardDir)) {
  fs.mkdirSync(namecardDir);
}
if (!fs.existsSync(profileDir)) {
  fs.mkdirSync(profileDir);
}
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir);
}
if (!fs.existsSync(bgDir)) {
  fs.mkdirSync(bgDir);
}
// urls
const urlPast = "https://genshin.honeyhunterworld.com/img/i_7";
const urlNow = "https://genshin.honeyhunterworld.com/img/i_n210";

function getSavePath(type, i) {
  switch (type) {
    case "profile":
      return path.join(profileDir, `${i}.webp`);
    case "icon":
      return path.join(iconDir, `${i}.webp`);
    case "bg":
      return path.join(bgDir, `${i}.webp`);
  }
}

function downloadImg(url, i, type) {
  const savePath = getSavePath(type, i);
  // check if exists
  if (fs.existsSync(savePath)) {
    return;
  }
  fetch(url).then(async (res) => {
    const buffer = await res.arrayBuffer();
    sharp(Buffer.from(buffer))
      .webp()
      .toFile(savePath, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`转换${type} ${i}成功，大小为：${info.size} 字节`);
        }
      });
  });
}

// download
function download(start, end, type) {
  for (let i = start; i <= end; i++) {
    let baseUrl = "";
    const iStr = i.toString().padStart(3, "0");
    if (type === "past") {
      baseUrl = urlPast;
    } else {
      baseUrl = urlNow;
    }
    const iconUrl = `${baseUrl}${iStr}_70.webp`;
    const bgUrl = `${baseUrl}${iStr}_back.webp`;
    const profileUrl = `${baseUrl}${iStr}_profile.webp`;
    downloadImg(iconUrl, i, "icon");
    downloadImg(bgUrl, i, "bg");
    downloadImg(profileUrl, i, "profile");
  }
}

// download past
download(1, 117, "past");
// download now
download(122, 161, "now");
