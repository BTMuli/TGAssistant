/**
 * @file weapon resize.js
 * @description 图像转换&移动
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.0.0
 */

// Node
import fs from "fs";
import path from "path";
import sharp from "sharp";
// TGAssistant
import { ORI_SRC_PATH, ORI_DATA_PATH, SRC_PATH } from "../root.js";

// paths
const ambrJson = JSON.parse(fs.readFileSync(path.join(ORI_DATA_PATH, "/weapon/ambr.json")));
const oriPath = path.join(ORI_SRC_PATH, "/weapon");
const savePath = path.join(SRC_PATH, "/weapon");

// check if the folder exists
if (!fs.existsSync(savePath)) {
  fs.mkdirSync(savePath);
}

// check if all the images are converted
const imageSet = new Set();
// read oriPath
fs.readdirSync(oriPath).forEach((file) => {
  const fileName = file.split(".")[0];
  const saveIPath = path.join(savePath, `${fileName}.webp`);
  if (fs.existsSync(saveIPath)) {
    return;
  }
  sharp(path.join(oriPath, file))
    .png()
    .toFormat("webp", {
      lossless: true,
      quality: 100,
    })
    .toFile(saveIPath, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`[INFO] ${file} converted.`);
      }
    });
});
