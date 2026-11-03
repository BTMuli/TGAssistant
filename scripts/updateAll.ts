/**
 * 按数据域更新资源并汇总失败阶段。
 * @since 2.7.0
 */

import { spawn } from "node:child_process";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import logger from "@tools/logger.ts";
import { getProjRootPath } from "@utils/getBasePaths.ts";
import fs from "fs-extra";

const files = ["download.ts", "convert.ts", "update.ts"];
// material 自行准备材料及角色 Metadata，不依赖 character 预先运行。
const dirs = [
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
  "wikiRelic",
];

/**
 * 执行指定数据域的更新，独立数据域失败后继续执行。
 * @since 2.7.0
 * @param args - 命令行参数，省略或 all 表示全量更新
 * @returns 全部成功时为 0，参数或执行失败时为 1
 */
export async function runUpdates(args: ReadonlyArray<string>): Promise<number> {
  if (args.length > 1 || (args.length === 1 && args[0] !== "all" && !dirs.includes(args[0]))) {
    logger.console.error(
      `[scripts][updateAll] 参数无效，用法：pnpm auto:update [all|${dirs.join("|")}]`,
    );
    return 1;
  }
  logger.init();
  logger.console.info("[scripts][updateAll] 运行 updateAll.ts");
  const selected = args.length === 0 || args[0] === "all" ? dirs : [args[0]];
  const failed: Array<string> = [];
  for (const dir of selected) {
    const dirPath = join(getProjRootPath(), "core", "components", dir);
    logger.console.info(`[scripts][updateAll][${dir}] 更新 ${dir}`);
    let readFiles: Array<string>;
    try {
      readFiles = await fs.readdir(dirPath);
    } catch (error) {
      logger.default.error(`[scripts][updateAll][${dir}] 读取数据域目录失败`, error);
      failed.push(`${dir}/读取目录`);
      continue;
    }
    for (const file of files) {
      if (!readFiles.includes(file)) continue;
      if (!(await execTsFile(join(dirPath, file)))) {
        failed.push(`${dir}/${file}`);
        logger.console.warn(`[scripts][updateAll][${dir}] 跳过依赖此阶段的后续步骤`);
        break;
      }
    }
  }
  if (failed.length > 0) {
    logger.console.error(`[scripts][updateAll] 失败阶段：\n${failed.join("\n")}`);
    return 1;
  }
  logger.console.info("[scripts][updateAll] 更新完成；全仓格式化请显式运行 pnpm prettier");
  return 0;
}

/**
 * 使用当前 Node.js 执行一个阶段，记录退出状态和启动错误。
 * @since 2.7.0
 * @param filePath - 阶段脚本的绝对路径
 * @returns 子进程是否成功完成
 */
async function execTsFile(filePath: string): Promise<boolean> {
  return new Promise<boolean>((resolveResult) => {
    let child: ReturnType<typeof spawn>;
    try {
      child = spawn(process.execPath, ["--import=tsx", "--no-warnings", filePath], {
        cwd: getProjRootPath(),
        stdio: "inherit",
      });
    } catch (error) {
      logger.default.error(`[scripts][updateAll] 启动 ${filePath} 失败`, error);
      resolveResult(false);
      return;
    }
    child.on("error", (error) => {
      logger.default.error(`[scripts][updateAll] 启动 ${filePath} 失败`, error);
      resolveResult(false);
    });
    child.on("close", (code, signal) => {
      if (code !== 0) {
        logger.default.error(
          `[scripts][updateAll] ${filePath} 失败，退出码 ${code}，信号 ${signal ?? "无"}`,
        );
        resolveResult(false);
      } else {
        logger.console.info(`[scripts][updateAll] 执行 ${filePath} 完成`);
        resolveResult(true);
      }
    });
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = await runUpdates(process.argv.slice(2));
}
