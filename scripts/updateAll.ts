/**
 * @file scripts/updateAll.ts
 * @description 更新所有数据
 * @since 2.1.0
 */

import { spawnSync } from "child_process";
import { join } from "node:path";

import fs from "fs-extra";

import Counter from "../core/tools/counter.ts";
import logger from "../core/tools/logger.ts";
import { getProjRootPath } from "../core/utils/getBasePaths.ts";

logger.console.info("[scripts][updateAll] 运行 updateAll.ts");

// 可能的文件命名
const files = ["download.ts", "convert.ts", "update.ts"];
const dirs = [
  "material",
  "achievements",
  "namecard",
  "gcg",
  "gacha",
  "character",
  "weapon",
  "calendar",
  "wiki",
];
for (const dir of dirs) {
  Counter.Init(`[scripts][updateAll][${dir}]`);
  const dirPath = join(getProjRootPath(), "core", "components", dir);
  logger.console.info(`[scripts][updateAll][${dir}] 更新 ${dir}`);
  const readFiles = fs.readdirSync(dirPath);
  Counter.Reset(readFiles.length);
  const execFiles = readFiles.filter((file) => files.includes(file));
  Counter.Skip(readFiles.length - execFiles.length);
  for (const file of files) {
    if (!execFiles.includes(file)) continue;
    const filePath = join(dirPath, file);
    const child = spawnSync("node --loader ts-node/esm", [filePath], {
      cwd: getProjRootPath(),
      shell: true,
    });
    if (child.stdout !== null) console.info(child.stdout.toString());
    logger.console.info(`[scripts][updateAll][${dir}] 执行 ${file} 完成`);
    Counter.Success();
  }
  Counter.End();
  logger.console.info(`[script][updateAll][${dir}] 更新完成，耗时 ${Counter.getTime()}`);
}
// prettier
spawnSync("pnpm prettier", { cwd: getProjRootPath(), shell: true });

logger.console.info("[scripts][updateAll] 运行 updateAll.ts 完成");
Counter.EndAll(false);
