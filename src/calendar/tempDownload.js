/**
 * @file calendar tempDownload.js
 * @description 临时下载数据
 * @author BTMuli <bt-muli@outlook.com>
 * @since 1.3.0
 */

// Node
import fs from "node:fs";
import path from "node:path";
import axios from "axios";
// TGAssistant
import pathList, { AMBER_VH } from "../../root.js";
import { consoleLogger, defaultLogger } from "../tools/logger.js";

const srcJsonDir = path.resolve(pathList.src.json, "calendar");
const srcWeapon = JSON.parse(
  fs.readFileSync(path.resolve(pathList.out.json, "weapon.json"), "utf-8"),
);

let weaponData = [];
const weaponIdSet = new Set();
if (fs.existsSync(path.resolve(srcJsonDir, "tempWeapon.json"))) {
  weaponData = JSON.parse(fs.readFileSync(path.resolve(srcJsonDir, "tempWeapon.json"), "utf-8"));
  weaponData.map((item) => {
    weaponIdSet.add(item.id);
  });
}

const total = srcWeapon.length;
let success = 0;
let skip = 0;
let fail = 0;

for (const weapon of srcWeapon) {
  if (weaponIdSet.has(weapon["id"])) {
    consoleLogger.mark(`[素材日历][下载][${weapon["id"]}] ${weapon["name"]}数据已存在，跳过`);
    skip++;
    continue;
  }
  const url = `https://api.ambr.top/v2/chs/weapon/${weapon["id"]}?vh=${AMBER_VH}`;
  await axios
    .get(url)
    .then((res) => {
      const dataGet = res.data["data"]["ascension"];
      const resW = {
        id: weapon["id"],
        materials: Object.keys(dataGet).map((key) => parseInt(key)),
        name: weapon["name"],
      };
      weaponData.push(resW);
      consoleLogger.info(`[素材日历][下载][${weapon["id"]}] ${weapon["name"]} 数据添加成功`);
      success++;
    })
    .catch((err) => {
      consoleLogger.error(`[素材日历][下载][${weapon["id"]}] ${weapon["name"]} 数据添加失败`);
      fail++;
    });
}

fs.writeFileSync(path.resolve(srcJsonDir, "tempWeapon.json"), JSON.stringify(weaponData, null, 2));
consoleLogger.info(
  `[素材日历][下载] 共${total}条数据，成功${success}条，跳过${skip}条，失败${fail}条`,
);
defaultLogger.info("[素材日历][下载] 临时下载数据完成");
