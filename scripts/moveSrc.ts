/**
 * 资源移动目录
 * @since 2.5.0
 */
import path from "node:path";

import logger from "@core/tools/logger";
import Counter from "@tools/counter.ts";
import { getAppDirPath } from "@utils/getBasePaths.ts";
import fs from "fs-extra";

const TARGET_DIR = "D:\\Code\\App\\TeyvatGuide";

logger.init();
Counter.Init("[scripts][moveSrc]");

const localDataDir = getAppDirPath("data").out;
const targetDataDir = `${TARGET_DIR}\\src\\data`;
await fs.copy(localDataDir, targetDataDir);
console.log("Json directory processing completed.");

const localAssetsDir = getAppDirPath("assets").out;
const targetPublicDir = `${TARGET_DIR}\\public`;

const iconDirs = ["achievement", "constellations", "material", "talents"];

const dirs = await fs.readdir(localAssetsDir, { withFileTypes: true });
const assetDirs = dirs.filter((dir) => dir.isDirectory()).map((dir) => dir.name);

for (const dirName of assetDirs) {
  const srcDir = path.join(localAssetsDir, dirName);
  const isIconDir = iconDirs.includes(dirName);
  const targetBase = isIconDir ? "icon" : "WIKI";
  const destDir = path.join(targetPublicDir, targetBase, dirName);

  await fs.copy(srcDir, destDir, {
    overwrite: false,
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
