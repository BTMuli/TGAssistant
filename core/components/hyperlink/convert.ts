/**
 * Hyperlink Convert
 * @since 2.5.0
 */

import path from "node:path";

import hutaoTool from "@hutao/hutao.ts";
import logger from "@tools/logger.ts";
import { fileCheck } from "@utils/fileCheck.ts";
import { getAppDirPath } from "@utils/getBasePaths.ts";
import fs from "fs-extra";

logger.init();
logger.default.info("[components][hyperlink][convert] 执行 convert.ts");

if (!hutaoTool.check(hutaoTool.enum.file.HyperLink)) {
  logger.default.error("[components][hyperlink][convert] 元数据缺失");
  logger.console.info("[components][hyperlink][convert] 请执行 download.ts");
  process.exit(1);
}
const hyperRaw = hutaoTool.read<TGACore.Plugins.Hutao.HyperLink.RawHyperLinks>(
  hutaoTool.enum.file.Achievement,
);
const res = hyperRaw.map((i) => ({
  id: i.Id,
  name: i.Name,
  desc: i.Description,
}));
const saveDir = getAppDirPath("data", "hyperlink").out;
const savePath = path.join(saveDir, "app", "hyperlink.json");
fileCheck(savePath, false);
fs.writeJSONSync(savePath, res);
logger.default.info(`[components][hyperlink][convert] 处理完成`);
