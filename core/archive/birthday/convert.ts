/**
 * @file core/archive/birthday/convert.ts
 * @description 存档-留影叙佳期-转换
 * @since 2.1.0
 */

import path from "node:path";

import fs from "fs-extra";

import { ArcBirDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";

logger.init();
logger.default.info("[core][archive][birthday][convert] 运行 convert.ts");

const rawDraw: TGACore.Archive.Birthday.DrawData[] = await fs.readJson(
  path.join(ArcBirDir, "raw_draw.json"),
);
const rawDraw2: TGACore.Archive.Birthday.DrawData[] = await fs.readJson(
  path.join(ArcBirDir, "raw_draw_2.json"),
);
Counter.Reset(rawDraw.length);
const res: TGACore.Archive.Birthday.DrawDataTrans[] = [];

for (const item of rawDraw) {
  logger.console.info(
    `[core][archive][birthday][convert] 正在转换画片 ${item.year} ${item.role_name}`,
  );
  const draw2Find = rawDraw2.find((draw2) => draw2.op_id === item.op_id);
  if (draw2Find === undefined) {
    throw new Error(
      `[core][archive][birthday][convert] 画片 ${item.year} ${item.role_name} 未找到对应的画片2`,
    );
  }
  res.push({
    year: item.year,
    role_id: item.role_id,
    role_name: item.role_name,
    birthday: item.birthday,
    take_picture: [item.take_picture, draw2Find.take_picture],
    unread_picture: [item.unread_picture, draw2Find.unread_picture],
    word_text: item.word_text,
    gal_xml: item.gal_xml,
    gal_resource: item.gal_resource,
    op_id: item.op_id,
  });
  Counter.Success();
}
await fs.writeJson(path.join(ArcBirDir, "draw.json"), res, { spaces: 2 });
Counter.End();
logger.default.info(
  `[core][archive][birthday][convert] 画片转换完成，共转换了 ${rawDraw.length} 个画片`,
);
