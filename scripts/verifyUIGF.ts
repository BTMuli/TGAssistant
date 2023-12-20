/**
 * @file scripts/verifyUIGF.ts
 * @description 校验 UIGF 导出文件
 * @since 2.0.0
 */

import path from "node:path";

import fs from "fs-extra";

import Counter from "../core/tools/counter.ts";
import logger from "../core/tools/logger.ts";
import { fileCheck } from "../core/utils/fileCheck.ts";
import { getProjRootPath } from "../core/utils/getBasePaths.ts";

interface UIGFItem {
  uid: string;
  gacha_type: string;
  item_id: string;
  count: string;
  time: string;
  name: string;
  lang: string;
  item_type: string;
  rank_type: string;
}

interface UIGFOut {
  info: unknown;
  list: UIGFItem[];
}

logger.init();
Counter.Init("[scripts][verifyUIGF]");
logger.default.info("[scripts][verifyUIGF] 运行 verifyUIGF.ts");
const baseDir = path.join(getProjRootPath(), "scripts", "data");
fileCheck(baseDir, true);
const files = fs.readdirSync(baseDir);
for (const file of files) {
  if (file.includes("out")) continue;
  const savePath = path.join(baseDir, file.replace(".json", "_out.json"));
  const data: UIGFOut = await fs.readJson(path.join(baseDir, file));
  Counter.addTotal(data.list.length);
  const res: UIGFOut = {
    info: data.info,
    list: [],
  };
  for (const item of data.list) {
    const resItem: UIGFItem = item;
    if (item.rank_type === "3" && item.item_type === "角色") {
      logger.console.info(JSON.stringify(item));
      if (item.name === "黎明神剑") {
        logger.console.info(`[scripts][verifyUIGF] ${item.name} ${item.item_type} -> 武器`);
        resItem.item_type = "武器";
        Counter.Success();
      } else {
        resItem.rank_type = "4";
        logger.console.info(
          `[scripts][verifyUIGF] ${item.name} ${item.item_type} ${item.rank_type} -> 4`,
        );
        Counter.Success();
      }
    } else {
      Counter.Skip();
    }
    res.list.push(resItem);
  }
  Counter.End();
  fs.writeJsonSync(savePath, res, { spaces: 2 });
  logger.default.info(`[scripts][verifyUIGF] ${file} 校验完成`);
  Counter.Output();
}
Counter.EndAll();

logger.default.info(`[scripts][verifyUIGF] 校验完成，耗时 ${Counter.getTime()}`);
