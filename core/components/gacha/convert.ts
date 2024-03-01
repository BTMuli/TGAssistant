/**
 * @file core/components/gacha/convert.ts
 * @description gacha 组件资源转换
 * @since 2.1.0
 */

import process from "node:process";

import fs from "fs-extra";

import { jsonDir, jsonDetailDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";

logger.init();
Counter.Init("[components][gacha][convert]");

// 前置检查
fileCheckObj(jsonDir);
if (!fileCheck(jsonDetailDir.src, false)) {
  logger.default.error("[components][gacha][convert] gacha 数据文件不存在");
  logger.console.info("[components][gacha][convert] 请执行 download.ts");
  process.exit(1);
}

Counter.Reset();
const gachaRaw: TGACore.Components.Gacha.RawHutao = await fs.readJSON(jsonDetailDir.src);
const gacha: TGACore.Components.Gacha.ConvertItem[] = [];
// 转换 gacha 数据
gachaRaw.forEach((item) => {
  const convert: TGACore.Components.Gacha.ConvertItem = {
    name: item.Name,
    version: item.Version,
    order: item.Order,
    banner: item.Banner,
    from: item.From,
    to: item.To,
    type: item.Type,
    up5List: item.UpOrangeList,
    up4List: item.UpPurpleList,
  };
  gacha.push(convert);
});
await fs.writeJSON(jsonDetailDir.out, gacha, { spaces: 2 });
Counter.End();
logger.default.info(`[components][gacha][convert] gacha 数据转换完成，耗时 ${Counter.getTime()}`);
