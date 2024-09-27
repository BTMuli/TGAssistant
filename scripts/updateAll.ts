/**
 * @file scripts/updateAll.ts
 * @description 更新所有数据
 * @since 2.2.0
 */

import { spawn, spawnSync } from "child_process";
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
  "gacha",
  "character",
  "weapon",
  "calendar",
  "wiki",
  "wikiAvatar",
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
    if (dir == "achievements" && file == "convert.ts") {
      await execTsFile(filePath, true);
    } else {
      await execTsFile(filePath);
    }
  }
  Counter.End();
  logger.console.info(`[script][updateAll][${dir}] 更新完成，耗时 ${Counter.getTime()}`);
}
// prettier
spawnSync("pnpm prettier", { cwd: getProjRootPath(), shell: true });

logger.console.info("[scripts][updateAll] 运行 updateAll.ts 完成");
Counter.EndAll(false);

/**
 * @description 执行 ts 文件
 * @param {string} filePath 文件路径
 * @param {boolean} isTsx 是否采用 tsx 运行
 * @returns {Promise<void>} 无返回值
 */
async function execTsFile(filePath: string, isTsx: boolean = false): Promise<void> {
  await new Promise<void>((resolve) => {
    const command = isTsx ? "tsx" : "node --loader ts-node/esm";
    const child = spawn(command, [filePath], {
      cwd: getProjRootPath(),
      shell: true,
    });
    child.stdout.on("data", (data: Uint8Array) => {
      console.info(data.toString());
    });
    child.stderr.on("data", (data: Uint8Array) => {
      console.error(data.toString());
    });
    child.on("close", async (code) => {
      if (code !== 0) {
        logger.default.error(`[scripts][updateAll] 执行 ${filePath} 出现错误`);
        resolve();
      } else {
        logger.console.info(`[scripts][updateAll] 执行 ${filePath} 完成`);
        resolve();
      }
    });
  });
}
