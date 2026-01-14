/**
 * 角色组件资源下载
 * @since 2.5.0
 */

import path from "node:path";

import hutaoTool from "@hutao/hutao.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import fetchMysObserver from "@utils/fetchMysObserver.ts";
import { fileCheckObj } from "@utils/fileCheck.ts";
import yattaTool from "@yatta/yatta.ts";
import fs from "fs-extra";

import {
  AetherCostumes,
  imgCostumeDir,
  imgDir,
  jsonDetailDir,
  jsonDir,
  LumineCostumes,
} from "./constant.ts";
import {
  downloadAvatarIcon,
  downloadCostumeFull,
  downloadCostumeIcon,
  downloadCostumeSide,
} from "./utils.ts";

logger.init();
Counter.Init("[components][character][download]");
logger.default.info("[components][character][download] 运行 download.ts");

fileCheckObj(jsonDir);
fileCheckObj(imgDir);
fileCheckObj(imgCostumeDir);
fileCheckObj(jsonDetailDir, false);

Counter.Reset(3);
logger.default.info("[components][character][download] 开始更新 JSON 数据");

// 下载Metadata数据
const meta = await hutaoTool.sync();
const paramList: Array<string> = Object.keys(meta)
  .filter((key) => key.startsWith(hutaoTool.enum.file.Avatar))
  .map((key) => key.replace(hutaoTool.enum.file.Avatar, ""));
Counter.addTotal(paramList.length);
for (const param of paramList) {
  try {
    const statKey = await hutaoTool.update(meta, hutaoTool.enum.file.Avatar, param);
    if (statKey) Counter.Success();
    else Counter.Skip();
  } catch (e) {
    logger.default.error(`[components][character][download][${param}] 下载 Metadata 数据失败`);
    logger.console.error(`[components][character][download][${param}] ${e}`);
    Counter.Fail();
  }
}
// 下载 Yatta 数据
try {
  const res = await yattaTool.fetchJson<TGACore.Plugins.Yatta.Avatar.AvatarResponse>("CHS/avatar");
  await fs.writeJson(jsonDetailDir.yatta, res.data.items, { spaces: 2 });
  logger.default.info("[components][character][download] Amber.top 角色数据下载完成");
  Counter.Success();
} catch (e) {
  logger.default.error("[components][character][download] 下载 Amber.top 角色数据失败");
  logger.default.error(e);
  Counter.Fail();
}
// 下载 mys 数据
try {
  const res = await fetchMysObserver();
  const mysData: Array<TGACore.Plugins.Mys.WikiItem> =
    res[0].children.find((item) => item.name === "角色")?.list ?? [];
  if (mysData.length === 0) {
    logger.default.warn("[components][character][download] 观测枢 角色数据为空");
    Counter.Fail();
  } else {
    await fs.writeJson(jsonDetailDir.mys, mysData, { spaces: 2 });
    logger.default.info("[components][character][download] 观测枢 角色数据下载完成");
    Counter.Success();
  }
} catch (e) {
  logger.default.warn("[components][character][download] 下载 观测枢 角色数据失败");
  logger.default.error(e);
  Counter.Fail();
}

Counter.End();
logger.default.info(`[components][character][download] 数据更新完成，耗时 ${Counter.getTime()}`);
Counter.Output();

// 下载图片数据
Counter.Reset();
logger.console.info("[components][character][download] 开始下载图片数据");
const yattaRaw: Record<string, TGACore.Plugins.Yatta.Avatar.AvatarItem> = await fs.readJson(
  jsonDetailDir.yatta,
);
const yattaAvatar = Object.values(yattaRaw);
for (const avatar of yattaAvatar) {
  const id = avatar.id.toString().split("-")[0];
  const iconSavePath = path.join(imgDir.src, `${id}.png`);
  await downloadAvatarIcon(avatar, iconSavePath);
  let costumeFilter: Array<TGACore.Plugins.Hutao.Avatar.CostumeExtra> = [];
  if (hutaoTool.check(hutaoTool.enum.file.Avatar, id)) {
    const hutaoRaw = hutaoTool.read<TGACore.Plugins.Hutao.Avatar.FullInfo>(
      hutaoTool.enum.file.Avatar,
      id,
    );
    costumeFilter = hutaoRaw.Costumes.filter((i) => !i.IsDefault);
  }
  if (id === "10000005") {
    costumeFilter = AetherCostumes.filter((i) => !i.IsDefault);
  } else if (id === "10000007") {
    costumeFilter = LumineCostumes.filter((i) => !i.IsDefault);
  }
  for (const costume of costumeFilter) {
    const costumFull = costume.FrontIcon.replace("UI_AvatarIcon", "UI_Costume");
    const iconSavePath = path.join(imgCostumeDir.src, `${costume.Id}.png`);
    const sideSavePath = path.join(imgCostumeDir.src, `${costume.Id}_side.png`);
    const fullSavePath = path.join(imgCostumeDir.src, `${costume.Id}_full.png`);
    await downloadCostumeIcon(costume, iconSavePath);
    await downloadCostumeSide(costume, sideSavePath);
    await downloadCostumeFull(costume, costumFull, fullSavePath);
  }
}

Counter.End();
logger.default.info(`[components][character][download] 图片下载完成，耗时 ${Counter.getTime()}`);
Counter.Output();

logger.default.info("[components][character][download] download.ts 运行结束");
Counter.EndAll();
logger.console.info("[components][character][download] 请执行 convert.ts 转换图片");
