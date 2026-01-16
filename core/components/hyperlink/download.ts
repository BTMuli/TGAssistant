/**
 * Hyperlink Download
 */

import hutaoTool from "@hutao/hutao.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";

logger.init();
logger.default.info("[components][hyperlink][download] 运行 download.ts");

logger.console.info("[components][hyperlink][download] 开始下载 Metadata.");
const remoteMeta = await hutaoTool.sync();
try {
  const statHyperlink = await hutaoTool.update(remoteMeta, hutaoTool.enum.file.HyperLink);
  if (statHyperlink) Counter.Success();
  else Counter.Skip();
} catch (e) {
  logger.default.error("[components][hyperlink][download] 下载 Metadata Hyperlink 数据失败");
  logger.default.error(`[components][hyperlink][download] ${e}`);
  process.exit(1);
}
logger.default.info(`[components][hyperlink][download] 数据更新完成，耗时 ${Counter.getTime()}`);
Counter.Output();
