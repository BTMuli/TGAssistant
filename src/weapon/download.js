/**
 * @file weapon download.js
 * @description 武器原始数据下载
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import fs from "node:fs";
import path from "node:path";
import axios from "axios";
import sharp from "sharp";
// TGAssistant
import pathList, { AMBER_VH } from "../../root.js";
import { consoleLogger, defaultLogger } from "../tools/logger.js";
import { dirCheck, fileExist } from "../tools/utils.js";

defaultLogger.info("[武器][下载] 开始执行 download.js");

// 检测保存路径是否存在
const srcImgDir = path.resolve(pathList.src.img, "weapon");
const srcJsonDir = path.resolve(pathList.src.json, "weapon");
dirCheck(srcImgDir);
dirCheck(srcJsonDir);

const mysUrl =
  "https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/home/content/list?app_sn=ys_obc&channel_id=189";
const amberUrl = `https://api.ambr.top/v2/chs/weapon?vh=${AMBER_VH}`;
const amberSavePath = path.resolve(srcJsonDir, "amber.json");
const mysSavePath = path.resolve(srcJsonDir, "mys.json");

// 下载JSON
defaultLogger.info("[武器][下载] 正在下载 JSON");
try {
  await axios.get(amberUrl).then((res) => {
    const dataGet = res.data["data"];
    fs.writeFileSync(amberSavePath, JSON.stringify(dataGet, null, 2));
    defaultLogger.info("[武器][下载] amber.json 下载完成");
  });
} catch (error) {
  defaultLogger.error("[武器][下载] amber.json 下载失败");
  defaultLogger.error(error.message);
}

try {
  await axios.get(mysUrl).then((res) => {
    const dataGet = res.data["data"]["list"][0]["children"][1]["list"];
    fs.writeFileSync(mysSavePath, JSON.stringify(dataGet, null, 2));
    defaultLogger.info("[武器][下载] mys.json 下载完成");
  });
} catch (error) {
  defaultLogger.error("[武器][下载] mys.json 下载失败");
  defaultLogger.error(error.message);
}

// 下载图片
defaultLogger.info("[武器][下载] 正在下载图片");
const count = {
  total: 0,
  success: 0,
  fail: 0,
  skip: 0,
};
const amberJson = JSON.parse(fs.readFileSync(amberSavePath, "utf8"));
const amberKeys = Object.keys(amberJson["items"]);
await Promise.allSettled(
  amberKeys.map(async (key) => {
    count.total++;
    const item = amberJson["items"][key];
    const url = getAmberUrl(item["icon"]);
    const savePath = path.resolve(srcImgDir, `${key}.png`);
    if (!fileExist(savePath)) {
      await downloadImg(url, savePath, key);
    } else {
      count.skip++;
      consoleLogger.mark(`[武器][下载][${key}] 图像已存在，跳过下载`);
    }
  }),
);
defaultLogger.info(
  `[武器][下载] 图片下载完成，共 ${count.total} 张，成功 ${count.success} 张，失败 ${count.fail} 张，跳过 ${count.skip} 张`,
);
defaultLogger.info("[武器][下载] download.js 执行完毕");

// 用到的函数

/**
 * @description 获取 Amber.top 图片链接
 * @since 1.1.0
 * @param {string} pre 原始链接
 * @returns {string} Amber.top 图片链接
 */
function getAmberUrl(pre) {
  return `https://api.ambr.top/assets/UI/${pre}.png`;
}

/**
 * @description 下载图片
 * @since 1.1.0
 * @param {string} url 图片链接
 * @param {string} savePath 保存路径
 * @param {string} index 图片索引
 * @returns {Promise<void>} 下载完成
 */
async function downloadImg(url, savePath, index) {
  try {
    await axios
      .get(url, {
        responseType: "arraybuffer",
      })
      .then(async (res) => {
        defaultLogger.info(`[武器][下载][${index}] 图像下载完成`);
        await sharp(res.data).png().toFile(savePath);
        count.success++;
      });
  } catch (error) {
    count.fail++;
    defaultLogger.error(`[武器][下载][${index}] ${savePath} 下载失败`);
    defaultLogger.error(error.message);
  }
}
