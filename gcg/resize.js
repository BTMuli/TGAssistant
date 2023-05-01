/**
 * @file gcg resize.js
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
const mysJosn = JSON.parse(fs.readFileSync(path.join(ORI_DATA_PATH, "/gcg/mys.json")));
const ambrJson = JSON.parse(fs.readFileSync(path.join(ORI_DATA_PATH, "/gcg/ambr.json")));
const oriPath = path.join(ORI_SRC_PATH, "/gcg");
const saveGPath = path.join(SRC_PATH, "/gcg");

// check if the folder exists
if (!fs.existsSync(saveGPath)) {
  fs.mkdirSync(saveGPath);
}

// check if all the images are converted
const imageSet = new Set();
// read oriPath
fs.readdirSync(oriPath).forEach((file) => {
  const fileName = file.split(".")[0];
  imageSet.add(fileName);
});

mysJosn.forEach((item) => {
  const content_id = item.id;
  item.list.forEach((card) => {
    const cardName = card.title;
    const filePath = path.join(oriPath, `${cardName}.png`);
    let savePath;
    switch (content_id) {
      case 233:
        savePath = path.join(saveGPath, cardName);
        break;
      case 234:
        savePath = path.join(saveGPath, cardName);
        break;
      case 235:
        savePath = path.join(saveGPath, cardName);
        break;
    }
    imageSet.delete(cardName);
    savePath = savePath + ".webp";
    if (fs.existsSync(savePath)) {
      return;
    }
    sharp(filePath)
      .png()
      .toFormat("webp", {
        lossless: true,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toFile(savePath, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`转换 ${cardName} 成功`);
        }
      });
  });
});

console.log("以下图片未转换：");
console.log(imageSet);
