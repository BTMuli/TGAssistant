/**
 * 资源移动目录
 * @since 2.5.0
 */
import logger from "@core/tools/logger";
import Counter from "@tools/counter.ts";
import { getAppDirPath } from "@utils/getBasePaths.ts";
import fs from "fs-extra";

// 目的项目路径
const TARGET_DIR = "D:\\Code\\App\\TeyvatGuide";

logger.init();
Counter.Init("[scripts][moveSrc]");

// 处理data目录，直接覆盖
const localDataDir = getAppDirPath("data").out;
const targetDataDir = `${TARGET_DIR}\\src\\data`;
console.log(targetDataDir);
await fs.copy(localDataDir, targetDataDir);

// 处理assets目录
// const localAssetsDir = getAppDirPath("assets").out;
// const targetAssetsDir = `${TARGET_DIR}\\public`;
