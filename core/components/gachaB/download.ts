/**
 * 千星奇域资源下载脚本
 * @since 2.5.0
 */

import hakushiTool from "@core/plugins/hakushi/hakushi.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import { fileCheckObj } from "@utils/fileCheck.ts";
import fs from "fs-extra";

import { jsonDir, jsonDetailDir } from "./constant.ts";

logger.init();
Counter.Init(`[components][gachaB][download]`);
logger.default.info(`[components][gachaB][download] 执行 download.ts`);

fileCheckObj(jsonDir);

logger.default.info(`[GachaB][Download] 开始下载部件数据`);
try {
  const res = await hakushiTool.fetchJson<TGACore.Plugins.Hakushi.Beyond.CostumeResp>(
    "data/zh/beyond/costume.json",
  );
  logger.default.info(`[GachaB][Download] 部件数据下载完成`);
  Counter.Success();
  const savePath = jsonDetailDir.costume;
  await fs.writeJson(savePath, res, { spaces: 2 });
} catch (error) {
  logger.default.error(`[GachaB][Download] 下载部件数据失败`);
  logger.console.error(error);
  Counter.Fail();
}

logger.default.info(`[GachaB][Download] 开始下载套装数据`);
try {
  const res = await hakushiTool.fetchJson<TGACore.Plugins.Hakushi.Beyond.SuitResp>(
    "data/zh/beyond/costume_suit.json",
  );
  logger.default.info(`[GachaB][Download] 套装数据下载完成`);
  Counter.Success();
  const savePath = jsonDetailDir.suit;
  await fs.writeJson(savePath, res, { spaces: 2 });
} catch (error) {
  logger.default.error(`[GachaB][Download] 下载套装数据失败`);
  logger.console.error(error);
  Counter.Fail();
}
