/**
 * @file core/components/weapon/download.ts
 * @description 武器组件资源下载
 * @since 2.4.0
 */

import path from "node:path";

import hutaoTool from "@hutao/hutao.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import fetchMysObserver from "@utils/fetchMysObserver.ts";
import fetchSgBuffer from "@utils/fetchSgBuffer.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import yattaTool from "@yatta/yatta.ts";
import fs from "fs-extra";
import sharp from "sharp";

import { imgDir, jsonDetailDir, jsonDir } from "./constant.ts";

logger.init();
Counter.Init("[components][weapon][download]");
logger.default.info("[components][weapon][download] 运行 download.ts");

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

Counter.Reset(3);
logger.default.info("[components][weapon][download] 开始更新 JSON 数据");

// 下载 Metadata 武器数据
const meta = await hutaoTool.sync();
try {
  const statWeapon = await hutaoTool.update(meta, hutaoTool.enum.file.Weapon);
  if (statWeapon) Counter.Success();
  else Counter.Skip();
} catch (e) {
  logger.default.error("[components][weapon][download] 下载 Snap.Metadata 武器数据失败");
  logger.console.error(`[components][weapon][download] ${e}`);
  Counter.Fail();
}
// 下载 amber 数据
try {
  const res = await yattaTool.fetchJson<TGACore.Plugins.Yatta.Weapon.WeaponResponse>("CHS/weapon");
  const amberData = Object.keys(res.data.items).map((id) => res.data.items[id]);
  await fs.writeJson(jsonDetailDir.yatta, amberData, { spaces: 2 });
  logger.default.info("[components][weapon][download] Amber.top 武器数据下载完成");
  Counter.Success();
} catch (e) {
  logger.default.error("[components][weapon][download] Amber.top 武器数据下载失败");
  logger.default.error(e);
  Counter.Fail();
}
// 下载 mys 数据
try {
  const res = await fetchMysObserver();
  const mysData: Array<TGACore.Plugins.Mys.WikiItem> =
    res[0].children.find((item) => item.name === "武器")?.list ?? [];
  if (mysData.length === 0) {
    logger.default.warn("[components][weapon][download] 观测枢 武器数据为空");
    Counter.Fail();
  } else {
    await fs.writeJson(jsonDetailDir.mys, mysData, { spaces: 2 });
    logger.default.info("[components][weapon][download] 观测枢 武器数据下载完成");
    Counter.Success();
  }
} catch (e) {
  logger.default.warn("[components][weapon][download] 观测枢 武器数据下载失败");
  logger.default.error(e);
  Counter.Fail();
}

Counter.End();
logger.default.info(`[components][weapon][download] 数据更新完成，耗时 ${Counter.getTime()}`);
Counter.Output();

// 下载图片数据
Counter.Reset();
logger.console.info("[components][weapon][download] 开始下载图片数据");

const amberJson: Array<TGACore.Plugins.Yatta.Weapon.WeaponItem> = await fs.readJson(
  jsonDetailDir.yatta,
);
Counter.addTotal(amberJson.length);
for (const item of amberJson) {
  const savePath = path.join(imgDir.src, `${item.id}.png`);
  if (fileCheck(savePath, false)) {
    logger.console.mark(`[components][weapon][download] ${item.name} 图片已存在，跳过`);
    Counter.Skip();
    continue;
  }
  try {
    const buffer = await fetchSgBuffer("EquipIcon", `${item.icon}.png`);
    await sharp(buffer).toFile(savePath);
    logger.default.info(`[components][weapon][download] ${item.name} 图片下载完成`);
    Counter.Success();
  } catch (e) {
    logger.default.warn(`[components][weapon][download] ${item.name} 图片下载失败`);
    logger.console.warn(e);
    Counter.Fail();
  }
}
Counter.End();
logger.default.info(`[components][weapon][download] 图片下载完成，耗时 ${Counter.getTime()}`);
Counter.Output();

logger.default.info("[components][weapon][download] download.ts 运行结束");
Counter.EndAll();
logger.console.info("[components][weapon][download] 请执行 convert.ts 进行转换");
