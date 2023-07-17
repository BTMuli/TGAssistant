/**
 * @file gcg download.js
 * @description 下载 GCG 相关 JSON 和图片
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import path from "node:path";
import fs from "node:fs";
import axios from "axios";
import sharp from "sharp";
// TGAssistant
import { defaultLogger, consoleLogger } from "../tools/logger.js";
import pathList, { AMBER_VH } from "../../root.js";
import { dirCheck, fileExist } from "../tools/utils.js";

defaultLogger.info("[GCG][下载] 正在运行 download.js");

const srcImgDir = path.resolve(pathList.src.img, "gcg");
const srcJsonDir = path.resolve(pathList.src.json, "gcg");
const amberUrl = `https://api.ambr.top/v2/chs/gcg?vh=${AMBER_VH}`;
const amberSavePath = path.resolve(srcJsonDir, "amber.json");
const mysUrl =
  "https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/home/content/list?app_sn=ys_obc&channel_id=231";
const mysSavePath = path.resolve(srcJsonDir, "mys.json");

// 检测目录是否存在
dirCheck(srcImgDir);
dirCheck(srcJsonDir);

// 下载JSON

try {
  await axios
    .get(amberUrl, {
      timeout: 10000,
    })
    .then((res) => {
      const dataGet = res.data["data"]["items"];
      const savePath = path.resolve(srcJsonDir, "amber.json");
      fs.writeFileSync(savePath, JSON.stringify(dataGet, null, 2));
      defaultLogger.info("[GCG][下载] amber.json 下载完成");
    });
} catch (error) {
  defaultLogger.error("[GCG][下载] amber.json 下载失败");
  defaultLogger.error(error.message);
}

try {
  await axios.get(mysUrl).then((res) => {
    const dataGet = res.data["data"]["list"][0]["children"];
    const savePath = path.resolve(srcJsonDir, "mys.json");
    fs.writeFileSync(savePath, JSON.stringify(dataGet, null, 2));
    defaultLogger.info("[GCG][下载] mys.json 下载完成");
  });
} catch (error) {
  defaultLogger.error("[GCG][下载] mys.json 下载失败");
  defaultLogger.error(error.message);
}

// 下载图片
const amberJson = JSON.parse(fs.readFileSync(amberSavePath, "utf-8"));
const amberKeys = Object.keys(amberJson);
await Promise.allSettled(
  amberKeys.map(async (key) => {
    const item = amberJson[key];
    const url = getAmberImgUrl(item["icon"]);
    await downloadImg(url, item["name"], "amber");
  }),
);
const mysJson = JSON.parse(fs.readFileSync(mysSavePath, "utf-8"));
await Promise.allSettled(
  mysJson.map(async (itemList) => {
    await Promise.allSettled(
      itemList.list.map(async (item) => {
        const url = item["icon"];
        await downloadImg(url, item["title"], "mys");
      }),
    );
  }),
);

defaultLogger.info("[GCG][下载] download.js 运行结束");

// 用到的函数

/**
 * @description 获取 amber.json 中的图片下载链接
 * @since 1.1.0
 * @param {string} icon 图片名
 * @returns {string} 图片下载链接
 */
function getAmberImgUrl(icon) {
  return `https://api.ambr.top/assets/UI/gcg/${icon}.png`;
}

/**
 * @description 下载图片
 * @since 1.1.0
 * @param {string} url 图片下载链接
 * @param {string} name 图片名
 * @param {string} source 图片来源
 * @returns {Promise<void>} 无返回值
 */
async function downloadImg(url, name, source) {
  const savePath = path.resolve(srcImgDir, `${name}.png`);
  if (fileExist(savePath)) {
    consoleLogger.mark(`[GCG][下载][${source}] ${name}.png 已存在，跳过下载`);
    return;
  }
  await axios
    .get(url, {
      responseType: "arraybuffer",
    })
    .then((res) => {
      sharp(res.data)
        .png()
        .toFile(savePath, (err) => {
          if (err) {
            defaultLogger.error(`[GCG][下载][${source}] ${name}.png 下载失败`);
          } else {
            defaultLogger.info(
              `[GCG][下载][${source}] ${name}.png 下载完成，大小为 ${res.data.length} 字节`,
            );
          }
        });
    });
}
