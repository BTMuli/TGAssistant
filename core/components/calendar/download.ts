/**
 * 日历组件资源下载
 * @since 2.5.0
 */
import hakushiTool from "@hakushi/hakushi.ts";
import hutaoTool from "@hutao/hutao.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import fetchMysObserver from "@utils/fetchMysObserver.ts";
import { fileCheckObj } from "@utils/fileCheck.ts";
import yattaTool from "@yatta/yatta.ts";
import fs from "fs-extra";

import { imgDir, jsonDetailDir, jsonDir } from "./constant.ts";

logger.init();
Counter.Init("[components][calendar][download]");
logger.default.info("[components][calendar][download] 运行 download.ts");

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

Counter.Reset(5);
logger.default.info("[components][calendar][download] 开始更新 JSON 数据");

// 下载秘境数据
try {
  const res =
    await yattaTool.fetchJson<TGACore.Plugins.Yatta.DailyDungeon.DailyResponse>("CHS/dailyDungeon");
  await fs.writeJson(jsonDetailDir.domain, res.data, { spaces: 2 });
  logger.default.info("[components][calendar][download] Yatta 秘境数据下载完成");
  Counter.Success();
} catch (e) {
  logger.default.error("[components][calendar][download] Yatta 秘境数据下载失败");
  logger.default.error(e);
  Counter.Fail();
}
// 下载角色数据
try {
  const res = await yattaTool.fetchJson<TGACore.Plugins.Yatta.Avatar.AvatarResponse>("CHS/avatar");
  await fs.writeJson(jsonDetailDir.avatar, res, { spaces: 2 });
  logger.default.info("[components][calendar][download] Yatta 角色数据下载完成");
  Counter.Success();
} catch (e) {
  logger.default.error("[components][calendar][download] Yatta 角色数据下载失败");
  logger.default.error(e);
  Counter.Fail();
}
// 下载米游社数据
try {
  const res = await fetchMysObserver();
  await fs.writeJson(jsonDetailDir.mys, res[0].children, { spaces: 2 });
  logger.default.info("[components][calendar][download] 米游社 日历数据下载完成");
  Counter.Success();
} catch (e) {
  logger.default.error("[components][calendar][download] 米游社 日历数据下载失败");
  logger.default.error(e);
  Counter.Fail();
}
// 下载Hakushi角色数据
try {
  const res =
    await hakushiTool.fetchJson<TGACore.Plugins.Hakushi.Avatar.BriefResp>("data/character.json");
  await fs.writeJson(jsonDetailDir.hakushi, res, { spaces: 2 });
  logger.default.info("[components][calendar][download] Hakushi 角色数据下载完成");
  Counter.Success();
} catch (e) {
  logger.default.error("[components][calendar][download] Hakushi 角色数据下载失败");
  logger.default.error(e);
  Counter.Fail();
}

const meta = await hutaoTool.sync();
const paramList = hutaoTool.readIds(meta);
Counter.addTotal(paramList.length);
for (const param of paramList) {
  try {
    const statKey = await hutaoTool.update(meta, hutaoTool.enum.file.Avatar, param);
    if (statKey) Counter.Success();
    else Counter.Skip();
  } catch (e) {
    logger.default.error(`[components][calendar][download][${param}] 下载 Metadata 数据失败`);
    logger.console.error(`[components][calendar][download][${param}] ${e}`);
    Counter.Fail();
  }
}
// 下载武器数据
try {
  const statWeapon = await hutaoTool.update(meta, hutaoTool.enum.file.Weapon);
  if (statWeapon) Counter.Success();
  else Counter.Skip();
} catch (e) {
  logger.default.error("[components][calendar][download] 下载 Snap.Metadata Weapon 数据失败");
  logger.console.error(`[components][calendar][download] ${e}`);
  Counter.Fail();
}
// 下载材料数据
try {
  const statMaterial = await hutaoTool.update(meta, hutaoTool.enum.file.Material);
  if (statMaterial) Counter.Success();
  else Counter.Skip();
} catch (e) {
  logger.default.error("[components][calendar][download] 下载 Snap.Metadata Material 数据失败");
  logger.console.error(`[components][calendar][download] ${e}`);
  Counter.Fail();
}

Counter.End();
logger.default.info(
  `[components][calendar][download] JSON 数据更新完成，耗时 ${Counter.getTime()}`,
);
Counter.Output();

logger.default.info("[components][calendar][download] download.ts 运行完成");
Counter.EndAll();
logger.console.info("[components][calendar][download] 请执行 convert.ts 进行数据转换");
