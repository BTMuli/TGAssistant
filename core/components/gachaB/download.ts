/**
 * 千星奇域资源下载脚本
 * @since 2.5.0
 */

import path from "node:path";

import hakushiTool from "@hakushi/hakushi.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import fs from "fs-extra";
import sharp from "sharp";

import { imgDir, jsonDetailDir, jsonDir } from "./constant.ts";

logger.init();
Counter.Init(`[components][gachaB][download]`);
logger.default.info(`[components][gachaB][download] 执行 download.ts`);

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

// logger.default.info(`[GachaB][Download] 开始下载部件数据`);
// try {
//   const res = await hakushiTool.fetchJson<TGACore.Plugins.Hakushi.Beyond.CostumeResp>(
//     "data/zh/beyond/costume.json",
//   );
//   logger.default.info(`[GachaB][Download] 部件数据下载完成`);
//   Counter.Success();
//   const savePath = jsonDetailDir.costume;
//   await fs.writeJson(savePath, res, { spaces: 2 });
// } catch (error) {
//   logger.default.error(`[GachaB][Download] 下载部件数据失败`);
//   logger.console.error(error);
//   Counter.Fail();
// }

let rawSuits: Array<TGACore.Plugins.Hakushi.Beyond.SuitInfo>;

logger.default.info(`[component][gachaB][Download] 开始下载套装数据`);
try {
  const res = await hakushiTool.fetchJson<TGACore.Plugins.Hakushi.Beyond.SuitResp>(
    "data/zh/beyond/costume_suit.json",
  );
  rawSuits = Object.values(res);
  logger.default.info(`[GachaB][Download] 套装数据下载完成`);
  const savePath = jsonDetailDir.suit;
  await fs.writeJson(savePath, res, { spaces: 2 });
} catch (error) {
  logger.default.error(`[GachaB][Download] 下载套装数据失败`);
  logger.console.error(error);
  Counter.Fail();
  process.exit(1);
}

Counter.addTotal(rawSuits.length);
logger.default.info("[components][gachaB][download] 开始下载套装图片");
for (const info of rawSuits) {
  const savePath = path.join(imgDir.src, `${info.Icon}.webp`);
  const check = fileCheck(savePath, false);
  if (check) {
    logger.console.mark(`[components][gachaB][download] ${info.Icon} 已存在，跳过`);
    Counter.Skip();
    continue;
  }
  try {
    const buffer = await hakushiTool.fetchBuffer(info.Icon);
    await sharp(buffer).toFile(savePath);
    logger.default.info(`[components][gachaB][download] ${info.Icon} 下载成功`);
    Counter.Success();
  } catch (e) {
    logger.default.warn(`[components][gachaB][download] ${info.Icon} 下载失败`);
    logger.default.error(e);
    Counter.Fail();
  }
}
Counter.End();

logger.default.info(`[components][gachaB][download] 数据下载完成，耗时 ${Counter.getTime()}`);
Counter.EndAll();
Counter.Output();
