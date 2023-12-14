/**
 * @file core/components/wiki/convert.ts
 * @description wiki组件转换器
 * @since 2.0.0
 */

import process from "node:process";

import fs from "fs-extra";

import { jsonDetail, jsonDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";

logger.init();
logger.default.info("[components][wiki][convert] 运行 convert.ts");

// 前置检查
fileCheckObj(jsonDir);
fileCheck(jsonDetail.weapon.out);
fileCheck(jsonDetail.character.out);
if (!fileCheck(jsonDetail.character.src, false) || !fileCheck(jsonDetail.weapon.src)) {
  logger.default.error("[components][wiki][convert] wiki元数据文件不存在");
  logger.console.info("[components][wiki][convert] 请执行 download.ts");
  process.exit(1);
}

Counter.Reset();
const weaponRaw: any[] = await fs.readJSON(jsonDetail.weapon.src);
const characterRaw: any[] = await fs.readJSON(jsonDetail.character.src);
Counter.addTotal(weaponRaw.length + characterRaw.length);

for (const character of characterRaw) {
  const fileName = character.Id;
  const outPath = `${jsonDetail.character.out}/${fileName}.json`;
  await fs.writeJSON(outPath, character, { spaces: 2 });
  logger.console.mark(`[components][wiki][convert] 角色 ${fileName} 转换完成`);
  Counter.Success();
}
for (const weapon of weaponRaw) {
  const fileName = weapon.Id;
  const outPath = `${jsonDetail.weapon.out}/${fileName}.json`;
  await fs.writeJSON(outPath, weapon, { spaces: 2 });
  logger.console.mark(`[components][wiki][convert] 武器 ${fileName} 转换完成`);
  Counter.Success();
}
Counter.End();
logger.console.mark(`[components][wiki][convert] wiki组件转换完成，耗时${Counter.getTime()}`);
Counter.Output();
