/**
 * 千星奇域资源下载脚本
 * @since 2.5.0
 */

import path from "node:path";

import hutaoTool from "@hutao/hutao.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import fetchMysObserver from "@utils/fetchMysObserver.ts";
import fetchSgBuffer from "@utils/fetchSgBuffer.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import fs from "fs-extra";
import sharp from "sharp";

import { imgDir, jsonDetailDir, jsonDir } from "./constant.ts";

logger.init();
Counter.Init(`[components][gachaB][download]`);
logger.default.info(`[components][gachaB][download] 执行 download.ts`);

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

logger.default.info(`[component][gachaB][download] 开始下载千星奇域物品JSON`);

// 下载 Metadata 千星奇域数据
const meta = await hutaoTool.sync();
const statQx = await hutaoTool.update(meta, hutaoTool.enum.file.Beyond);
if (statQx) Counter.Success();
else Counter.Skip();

// 下载观测枢数据
const mysData: Array<TGACore.Plugins.Mys.WikiItem> = [];
const channelList: ReadonlyArray<number> = [264, 266, 268, 270];
for (const channel of channelList) {
  try {
    const res = await fetchMysObserver(channel);
    let data = <Array<TGACore.Plugins.Mys.WikiItem>>res[0].list;
    data = data.filter((i) => i.ext.includes("获取方式/颂愿"));
    mysData.push(...data);
    Counter.Success();
  } catch (error) {
    logger.default.error(`[component][gachaB][download] 下载物品数据失败`);
    logger.console.error(error);
    Counter.Fail();
  }
}
await fs.writeJson(jsonDetailDir.obc, mysData, { spaces: 2 });

Counter.End();
logger.default.info(`[components][gachaB][download] 数据更新完成，耗时 ${Counter.getTime()}`);
Counter.Output();

// 下载图像
Counter.Reset();
logger.console.info("[components][gachaB][download] 开始下载图片数据");
const hutaoRaw = hutaoTool.read<TGACore.Plugins.Hutao.Beyond.RawBeyondItem>(
  hutaoTool.enum.file.Beyond,
);

// const mysRaw: Array<TGACore.Plugins.Mys.WikiItem> = await fs.readJSON(jsonDetailDir.obc);
for (const item of hutaoRaw) {
  if (item.Type <= 3) {
    if (item.Icon === undefined) continue;
    await downloadImg(item.Icon, item.Name);
  }
}

logger.default.info(`[components][gachaB][download] 数据下载完成，耗时 ${Counter.getTime()}`);
Counter.EndAll();
Counter.Output();

/**
 * 下载图片
 * @param {string} iconOri 图片名称
 * @param {string} name 名称
 * @return {Promise<void>}
 */
async function downloadImg(iconOri: string, name: string): Promise<void> {
  const icon = iconOri;
  if (icon === "") {
    logger.default.warn(`[components][gachaB][download] ${name} 图标为空，跳过`);
    Counter.Skip();
    return;
  }
  const savePath = path.join(imgDir.src, `${icon}.png`);
  const check = fileCheck(savePath, false);
  if (check) {
    logger.console.mark(`[components][gachaB][download] ${name} ${icon} 已存在，跳过`);
    Counter.Skip();
    return;
  }
  try {
    const buffer = await fetchSgBuffer("BeydAvatar", `${icon}.png`);
    await sharp(buffer).toFile(savePath);
    logger.default.info(`[components][gachaB][download] ${name} ${icon} 下载成功`);
    Counter.Success();
  } catch (e) {
    logger.default.warn(`[components][gachaB][download] ${name} ${icon} 下载失败`);
    logger.default.error(e);
    Counter.Fail();
  }
}
