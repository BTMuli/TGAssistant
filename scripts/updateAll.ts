/**
 * @file scripts/updateAll.ts
 * @description 更新所有数据
 * @since 2.0.0
 */

import { spawnSync } from "child_process";
import * as console from "console";
import { join } from "node:path";

import fs from "fs-extra";

import Counter from "../core/tools/counter.ts";
import logger from "../core/tools/logger.ts";
import { getProjRootPath } from "../core/utils/getBasePaths.ts";

logger.console.warn("[scripts][updateAll] 运行 updateAll.ts");

// 可能的文件命名
const files = ["download.ts", "convert.ts", "update.ts"];
const dirs = ["achievements", "namecard", "character", "weapon", "calendar", "wiki"];
Counter.Init("[scripts][updateAll]");
const startTime = Date.now();
for (const dir of dirs) {
  const dirPath = join(getProjRootPath(), "core", "components", dir);
  logger.console.warn(`[scripts][updateAll] 更新 ${dir}`);
  const readFiles = fs.readdirSync(dirPath);
  Counter.addTotal(readFiles.length);
  const execFiles = readFiles.filter((file) => files.includes(file));
  Counter.Skip(readFiles.length - execFiles.length);
  for (const file of files) {
    if (!execFiles.includes(file)) continue;
    logger.console.warn(`[scripts][updateAll] 执行 ${dir}/${file}`);
    const filePath = join(dirPath, file);
    const child = spawnSync("node --loader ts-node/esm", [filePath], {
      cwd: getProjRootPath(),
      shell: true,
    });
    if (child.stdout !== null) console.log(child.stdout.toString());
    logger.console.warn(`[scripts][updateAll] 执行 ${dir}/${file} 完成`);
    Counter.Success();
  }
}
const costTime = Date.now() - startTime;
logger.console.warn(`[scripts][updateAll] 运行 updateAll.ts 完成，耗时${costTime}ms`);
