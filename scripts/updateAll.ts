/**
 * @file scripts/updateAll.ts
 * @description 更新所有数据
 * @since 2.5.0
 */

import { spawn, spawnSync } from "child_process";
import { join } from "node:path";

import logger from "@tools/logger.ts";
import { getProjRootPath } from "@utils/getBasePaths.ts";
import fs from "fs-extra";

logger.console.info("[scripts][updateAll] 运行 updateAll.ts");

// 可能的文件命名
const files = ["download.ts", "convert.ts", "update.ts"];
let dirs = [
  "material",
  "achievements",
  "namecard",
  "gacha",
  "gachaB",
  "hyperlink",
  "character",
  "weapon",
  "calendar",
  "wikiWeapon",
  "wikiAvatar",
];

const args = process.argv.slice(2);
if (args.length > 0 && args[0] !== "all" && dirs.includes(args[0])) dirs = [args[0]];

for (const dir of dirs) {
  const dirPath = join(getProjRootPath(), "core", "components", dir);
  logger.console.info(`[scripts][updateAll][${dir}] 更新 ${dir}`);
  const readFiles = fs.readdirSync(dirPath);
  const execFiles = readFiles.filter((file) => files.includes(file));
  for (const file of files) {
    if (!execFiles.includes(file)) continue;
    const filePath = join(dirPath, file);
    await execTsFile(filePath);
  }
}
// prettier
logger.console.info(`[scripts][updateAll]执行 pnpm prettier`);
spawnSync("pnpm prettier", { cwd: getProjRootPath(), shell: true });
logger.console.info(`[scripts][updateAll]执行 pnpm eslint --fix`);
spawnSync("pnpm eslint --fix", { cwd: getProjRootPath(), shell: true });

logger.console.info("[scripts][updateAll] 运行 updateAll.ts 完成");

/**
 * @description 执行 ts 文件
 * @param {string} filePath 文件路径
 * @returns {Promise<void>} 无返回值
 */
async function execTsFile(filePath: string): Promise<void> {
  await new Promise<void>((resolve) => {
    const command = "node --import=tsx --experimental-strip-types --no-warnings";
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
