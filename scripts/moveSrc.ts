/**
 * 将转换结果复制到指定的 TeyvatGuide 仓库。
 * @since 2.7.0
 */
import path from "node:path";

import logger from "@tools/logger.ts";
import Counter from "@tools/counter.ts";
import { getAppDirPath, getProjRootPath } from "@utils/getBasePaths.ts";
import fs from "fs-extra";

const args = process.argv.slice(2);
if (args.length > 1 || (args.length === 1 && (!args[0].trim() || args[0].startsWith("-")))) {
  console.error("用法：pnpm move [TeyvatGuide 根目录]");
  process.exit(1);
}
const targetDir = path.resolve(args[0] ?? path.join(getProjRootPath(), "..", "TeyvatGuide"));
console.info(`[scripts][moveSrc] 复制目标：${targetDir}`);
try {
  for (const dir of ["src/data", "public"]) {
    if (!(await fs.stat(path.join(targetDir, dir))).isDirectory()) {
      throw new Error(`${dir} 不是目录`);
    }
  }
} catch (error) {
  console.error(`[scripts][moveSrc] 目标缺少 TeyvatGuide 项目目录结构，停止复制：${error}`);
  process.exit(1);
}

logger.init();
Counter.Init("[scripts][moveSrc]");

const localDataDir = getAppDirPath("data").out;
const targetDataDir = path.join(targetDir, "src", "data");
await fs.copy(localDataDir, targetDataDir);
console.log("Json directory processing completed.");

const localAssetsDir = getAppDirPath("assets").out;
const targetPublicDir = path.join(targetDir, "public");

const iconDirs = ["achievement", "constellations", "material", "talents"];

const dirs = await fs.readdir(localAssetsDir, { withFileTypes: true });
const assetDirs = dirs.filter((dir) => dir.isDirectory()).map((dir) => dir.name);

for (const dirName of assetDirs) {
  const srcDir = path.join(localAssetsDir, dirName);
  const isIconDir = iconDirs.includes(dirName);
  const targetBase = isIconDir ? "icon" : "WIKI";
  const destDir = path.join(targetPublicDir, targetBase, dirName);

  await fs.copy(srcDir, destDir, {
    overwrite: true,
    errorOnExist: false,
    filter: async (src) => {
      const relativePath = path.relative(localAssetsDir, src);
      const destPath = path.join(targetPublicDir, targetBase, relativePath);
      const exists = await fs.pathExists(destPath);
      if (!exists) {
        logger.default.info(`[NEW] ${relativePath}`);
      }
      return true;
    },
  });

  console.log(`Copied ${dirName} to public/${targetBase}/${dirName}`);
}

console.log("Assets directory processing completed.");
