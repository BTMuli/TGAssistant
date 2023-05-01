/**
 * @file calendar download.js
 * @description 下载 json 跟图像资源
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.0.0
 */

// Node
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
// TGAssistant
import { ORI_SRC_PATH, ORI_DATA_PATH } from "../root.js";

// paths
const imgDir = path.join(ORI_SRC_PATH, "calendar");
const imgCDir = path.join(imgDir, "character");
const imgWDir = path.join(imgDir, "weapon");
const imgMDir = path.join(imgDir, "material");
const jsonDir = path.join(ORI_DATA_PATH, "calendar");
const jsonPath = path.join(jsonDir, "mys.json");
// url
const mysUrl =
  "https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/get_activity_calendar?app_sn=ys_obc";

// check if the directory exists
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir);
}
if (!fs.existsSync(imgCDir)) {
  fs.mkdirSync(imgCDir);
}
if (!fs.existsSync(imgWDir)) {
  fs.mkdirSync(imgWDir);
}
if (!fs.existsSync(imgMDir)) {
  fs.mkdirSync(imgMDir);
}
if (!fs.existsSync(jsonDir)) {
  fs.mkdirSync(jsonDir);
}

// download json
fetch(mysUrl).then((res) => {
  res.json().then((data) => {
    let useFulData = data.data.list.filter((item) => item.kind === "2");
    fs.writeFileSync(jsonPath, JSON.stringify(useFulData, null, 2));
  });
});
