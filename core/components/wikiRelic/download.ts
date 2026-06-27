/**
 * 圣遗物组件资源下载
 * @since 2.6.0
 */

import hutaoTool from "@hutao/hutao.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";

import { imgDir, jsonDetail, jsonDir } from "./constant.ts";
import path from "node:path";
import fs from "fs-extra";
import yattaTool from "@yatta/yatta.ts";
import fetchSgBuffer from "@utils/fetchSgBuffer.ts";
import sharp from "sharp";

logger.init();
Counter.Init("[components][wikiRelic][download]");
logger.default.info("[components][wikiRelic][download] 运行 download.ts");

fileCheckObj(jsonDir);
fileCheckObj(imgDir);

Counter.Reset(5);
logger.default.info("[components][wikiRelic][download] 开始更新 JSON 数据");

// 下载 Metadata 圣遗物元数据
const meta = await hutaoTool.sync();
try {
  const statSet = await hutaoTool.update(meta, hutaoTool.enum.file.RelicSet);
  if (statSet) Counter.Success();
  else Counter.Skip();
} catch (e) {
  logger.default.error("[components][wikiRelic][download] 下载 Snap.Metadata 圣遗物套装数据失败");
  logger.console.error(`[components][wikiRelic][download] ${e}`);
  Counter.Fail();
}
try {
  const statRelic = await hutaoTool.update(meta, hutaoTool.enum.file.Relic);
  if (statRelic) Counter.Success();
  else Counter.Skip();
} catch (e) {
  logger.default.error("[components][wikiRelic][download] 下载 Snap.Metadata 圣遗物数据失败");
  logger.console.error(`[components][wikiRelic][download] ${e}`);
  Counter.Fail();
}
try {
  const statMain = await hutaoTool.update(meta, hutaoTool.enum.file.RelicMain);
  if (statMain) Counter.Success();
  else Counter.Skip();
} catch (e) {
  logger.default.error("[components][wikiRelic][download] 下载 Snap.Metadata 圣遗物主词条数据失败");
  logger.console.error(`[components][wikiRelic][download] ${e}`);
  Counter.Fail();
}
try {
  const statMainLv = await hutaoTool.update(meta, hutaoTool.enum.file.RelicMain);
  if (statMainLv) Counter.Success();
  else Counter.Skip();
} catch (e) {
  logger.default.error(
    "[components][wikiRelic][download] 下载 Snap.Metadata 圣遗物主词条等级数据失败",
  );
  logger.console.error(`[components][wikiRelic][download] ${e}`);
  Counter.Fail();
}
try {
  const statSub = await hutaoTool.update(meta, hutaoTool.enum.file.RelicSub);
  if (statSub) Counter.Success();
  else Counter.Skip();
} catch (e) {
  logger.default.error("[components][wikiRelic][download] 下载 Snap.Metadata 圣遗物副词条数据失败");
  logger.console.error(`[components][wikiRelic][download] ${e}`);
  Counter.Fail();
}

// 读取套装元数据
const rawRelicSet = hutaoTool.read<TGACore.Plugins.Hutao.Relic.RawSet>(
  hutaoTool.enum.file.RelicSet,
);

Counter.addTotal(rawRelicSet.length);
logger.console.info("[components][wikiRelic][download] 开始下载 Yatta 数据");
const yattaRelicSet: TGACore.Plugins.Yatta.Relic.LocalRelicSetList = [];

for (const relicSet of rawRelicSet) {
  let setLocal: TGACore.Plugins.Yatta.Relic.LocalRelicSet;
  const savePath = path.join(jsonDir.src, `relic_${relicSet.SetId}.json`);
  if (fs.existsSync(savePath)) {
    logger.console.mark(`[components][wikiRelic][download][${relicSet.SetId}] 已存在，跳过`);
    Counter.Skip();
  }
  try {
    const detailResp = await yattaTool.fetchJson<TGACore.Plugins.Yatta.Relic.RelicSetResp>(
      `CHS/reliquary/${relicSet.SetId}`,
    );
    if (detailResp.response !== 200) {
      logger.default.warn(`[components][wikiRelic][download][${relicSet.SetId}] 不存在，跳过`);
      Counter.Skip();
      continue;
    }
    setLocal = { ...detailResp.data, story: {} };
    Counter.Success();
  } catch (e) {
    logger.default.warn(`[components][wikiRelic][download][${relicSet.SetId}] 详细数据获取失败`);
    logger.default.error(e);
    Counter.Fail();
    continue;
  }
  let setStory: Record<string, string> = {};
  Counter.addTotal(Object.values(setLocal.suit).length);
  for (const [k, v] of Object.entries(setLocal.suit)) {
    const rPath = v.icon.replace("UI_", "").replace("Icon_", "");
    try {
      const storyResp = await yattaTool.fetchJson<TGACore.Plugins.Yatta.Weapon.WeaponReadResponse>(
        `CHS/readable/${rPath}`,
      );
      setStory = { ...setStory, [k]: storyResp.data };
      Counter.Success();
    } catch (e) {
      logger.default.error(
        `[components][wikiRelic][downloada][${relicSet.SetId}] 获取圣遗物故事 ${rPath} 失败`,
      );
      logger.default.error(e);
      Counter.Fail();
    }
  }
  setLocal = { ...setLocal, story: setStory };
  logger.console.mark(
    `[components][wikiRelic][download][${relicSet.SetId}] 圣遗物 ${relicSet.Name} 数据获取完成`,
  );
  await fs.writeJSON(savePath, setLocal);
}

for (const relicSet of rawRelicSet) {
  const savePath = path.join(jsonDir.src, `relic_${relicSet.SetId}.json`);
  if (!fs.existsSync(savePath)) {
    logger.default.warn(`[components][wikiRelic][download] ${relicSet.SetId} 数据未下载`);
    continue;
  }
  const detail = fs.readJsonSync(savePath);
  yattaRelicSet.push(detail);
}
await fs.writeJSON(jsonDetail.yatta, yattaRelicSet, { spaces: 2 });
Counter.End();

logger.default.info(`[components][wikiRelic][download] 数据更新完成，耗时 ${Counter.getTime()}`);
Counter.Output();

// 下载图片数据
Counter.Reset();
logger.console.info("[components][wikiRelic][download] 开始下载图片数据");
for (const relicSet of yattaRelicSet) {
  const vals = Object.values(relicSet.suit);
  Counter.addTotal(vals.length);
  for (const item of vals) {
    const savePath = path.join(imgDir.src, `${item.icon}.png`);
    if (fileCheck(savePath, false)) {
      logger.console.mark(`[components][wikiRelic][download] ${item.name} 图片已存在，跳过`);
      Counter.Skip();
      continue;
    }
    try {
      const buffer = await fetchSgBuffer("RelicIcon", `${item.icon}.png`);
      await sharp(buffer).toFile(savePath);
      logger.default.info(`[components][wikiRelic][download] ${item.name} 图片下载完成`);
      Counter.Success();
    } catch (e) {
      logger.default.warn(`[components][wikiRelic][download] ${item.name} 图片下载失败`);
      logger.console.warn(e);
      Counter.Fail();
    }
  }
}
Counter.End();
logger.default.info(`[components][wikiRelic][download] 图片下载完成，耗时 ${Counter.getTime()}`);
Counter.Output();

logger.default.info("[components][wikiRelic][download] download.ts 运行结束");
Counter.EndAll();
logger.console.info("[components][wikiRelic][download] 请执行 convert.ts 进行转换");
