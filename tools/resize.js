/**
 * @file tools resize.js
 * @description 用于将图片转换为 webp 格式
 * @author BTMuli<bt-muli@outlook.com>
 * @version 1.0.0
 */

// Node
import sharp from "sharp";
import path from "path";
import fs from "fs";
// TGAssistant
import { TEMP_PATH, OUT_PATH } from "../root.js";

// 遍历文件夹
fs.readdir(TEMP_PATH, (err, files) => {
  files.forEach(async (file, index) => {
    const filePath = path.join(TEMP_PATH, file);
    const savePath = path.join(OUT_PATH, `${file.split(".")[0]}.webp`);
    // 获取文件名
    const fileName = file.split(".")[0];
    sharp(filePath)
      .png()
      .toFormat("webp", {
        // 透明色
        background: { r: 0, g: 0, b: 0, alpha: 0 },
        // 无损
        lossless: true,
      })
      .resize(64, 64, {
        // 原图片放在新图片的右侧
        position: "center",
        // 用透明色填充
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toFile(savePath, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`转换${fileName}成功，大小为：${info.size} 字节`);
        }
      });
  });
});
