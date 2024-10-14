/**
 * @file core components character update.ts
 * @description 角色组件数据更新
 * @since 2.0.0
 */

import process from "node:process";

import fs from "fs-extra";

import { jsonDetailDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck } from "../../utils/fileCheck.ts";

logger.init();
Counter.Init("[components][character][update]");
logger.default.info("[components][character][update] 运行 update.ts");

// 前置检查
if (!fileCheck(jsonDetailDir.out, false)) {
  logger.default.error("[components][character][update] 角色名片数据文件不存在");
  logger.console.info("[components][character][update] 请执行 convert.ts");
  process.exit(1);
}
if (!fileCheck(jsonDetailDir.namecard, false)) {
  logger.default.error("[components][character][update] 角色名片数据文件不存在");
  logger.console.info("[components][character][update] 请执行 namecard/convert.ts");
  process.exit(1);
}

const converData: TGACore.Components.Character.ConvertData[] = await fs.readJson(jsonDetailDir.out);
const namecardData: TGACore.Components.Namecard.ConvertData[] = (
  await fs.readJson(jsonDetailDir.namecard)
).filter((value: TGACore.Components.Namecard.ConvertData) => value.type === 2);
logger.console.info("[components][character][update] 开始更新角色名片数据");
Counter.Reset(converData.length);
for (const item of converData) {
  const namecard = namecardData.findIndex((value) => {
    const name = value.name.split("·")[0];
    return name === item.name || name === item.name.slice(-2) || value.source.includes(item.name);
  });
  if (namecard === -1 && item.element !== "") {
    logger.default.warn(`[components][character][update] 角色 ${item.name} 名片数据不存在`);
    Counter.Fail();
    continue;
  }
  if (item.element === "" || namecardData[namecard].name === item.nameCard) {
    logger.console.mark(`[components][character][update] 角色 ${item.name} 名片数据无需更新`);
    Counter.Skip();
    continue;
  }
  logger.console.info(`[components][character][update] 角色 ${item.name} 名片数据更新完成`);
  item.nameCard = namecardData[namecard].name;
  Counter.Success();
}
Counter.End();
// 写入文件
fs.writeJsonSync(jsonDetailDir.out, converData, { spaces: 2 });

logger.default.info(`[components][character][update] 更新完成，耗时 ${Counter.getTime()}`);
Counter.Output();
