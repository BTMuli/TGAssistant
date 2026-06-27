/**
 * 圣遗物组件转换器
 * @since 2.6.0
 */

import logger from "@tools/logger.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import { imgDir, jsonDetail, jsonDir } from "./constant.ts";
import fs from "fs-extra";
import hutaoTool from "@hutao/hutao.ts";
import Counter from "@tools/counter.ts";
import process from "node:process";
import path from "node:path";
import sharp from "sharp";

logger.init();
logger.default.info("[components][wikiRelic][convert] 运行 convert.ts");

// 前置检查
fileCheckObj(imgDir);
fileCheckObj(jsonDetail);
fileCheckObj(jsonDir);

// 检测yatta文件
if (!fileCheck(jsonDetail.yatta, false)) {
  logger.default.error("[components][wikiRelic][convert] 源数据不存在");
  logger.console.info("[components][wikiRelic][convert] 请先运行 download.ts");
  process.exit(1);
}

// 检测元数据文件
const hutaoList: ReadonlyArray<TGACore.Plugins.Hutao.Base.GithubFileTypeEnum> = [
  hutaoTool.enum.file.Relic,
  hutaoTool.enum.file.RelicSet,
  hutaoTool.enum.file.RelicMainLv,
  hutaoTool.enum.file.RelicMain,
  hutaoTool.enum.file.RelicSub,
];
Counter.Reset(hutaoList.length);
for (const item of hutaoList) {
  const check = hutaoTool.check(item);
  if (!check) {
    logger.default.error(`[components][wikiRelic][convert] ${item}元数据文件不存在`);
    Counter.Fail();
    process.exit(1);
  }
}

// 处理图片
const rawYattaRelic = <TGACore.Plugins.Yatta.Relic.LocalRelicSetList>(
  fs.readJSONSync(jsonDetail.yatta)
);

logger.default.info(`[components][wikiRelic][convert] 开始处理图像数据`);
Counter.Reset();
for (const item of rawYattaRelic) {
  for (const child of Object.values(item.suit)) {
    const oriPath = path.join(imgDir.src, `${child.icon}.png`);
    const savePath = path.join(imgDir.out, `${child.icon}.webp`);
    Counter.addTotal();
    if (!fileCheck(oriPath, false)) {
      logger.default.warn(`[components][wikiRelic][convert][icon] ${child.icon} 无图标`);
      Counter.Fail();
      continue;
    }
    if (fileCheck(savePath, false)) {
      logger.console.mark(`[components][wikiRelic][convert][icon] ${child.icon} 已转换`);
      Counter.Skip();
      continue;
    }
    await sharp(oriPath).webp().toFile(savePath);
    logger.console.info(`[components][wikiRelic][convert][icon] ${child.icon} 转换完成`);
    Counter.Success();
  }
}
Counter.End();
Counter.Output();

Counter.Reset(6);

// 处理MainLv
logger.default.info(`[components][wikiRelic][convert] 开始处理MainLv数据`);
const rawMainLv = hutaoTool.read<TGACore.Plugins.Hutao.Relic.RawMainLv>(
  hutaoTool.enum.file.RelicMainLv,
);
const cvtMainLv: TGACore.Components.Relic.MainLv = [];
for (const item of rawMainLv) {
  const prop: Record<number, number> = {};
  for (const p of item.Properties) prop[p.Type] = p.Value;
  const cvt: TGACore.Components.Relic.MainLvItem = {
    star: item.Rank,
    level: item.Level,
    prop: prop,
  };
  cvtMainLv.push(cvt);
}
fs.writeJSONSync(path.join(jsonDetail.dir, "MainLv.json"), cvtMainLv);
Counter.Success();

// 处理MainProp
logger.default.info(`[components][wikiRelic][convert] 开始处理MainProp数据`);
const rawMain = hutaoTool.read<TGACore.Plugins.Hutao.Relic.RawMain>(hutaoTool.enum.file.RelicMain);
const cvtMain: TGACore.Components.Relic.MainProp = {};
for (const item of rawMain) cvtMain[item.Id] = item.Type;
fs.writeJSONSync(path.join(jsonDetail.dir, "MainProp.json"), cvtMain);
Counter.Success();

// 处理SubProp
logger.default.info(`[components][wikiRelic][convert] 开始处理SubProp数据`);
const rawSub = hutaoTool.read<TGACore.Plugins.Hutao.Relic.RawSub>(hutaoTool.enum.file.RelicSub);
const cvtSub: TGACore.Components.Relic.SubProp = {};
for (const item of rawSub) cvtSub[item.Id] = { val: item.Value, type: item.Type };
fs.writeJSONSync(path.join(jsonDetail.dir, "SubProp.json"), cvtSub);
Counter.Success();

// 处理RelicMap
logger.default.info(`[components][wikiRelic][convert] 开始处理部件映射`);
const rawRelic = hutaoTool.read<Array<TGACore.Plugins.Hutao.Relic.RelicFull>>(
  hutaoTool.enum.file.Relic,
);
const cvtRelicMap: TGACore.Components.Relic.RelicMap = {};
for (const item of rawRelic) {
  for (const child of item.Ids) {
    cvtRelicMap[child] = {
      set: item.SetId,
      star: item.RankLevel,
      name: item.Name,
      icon: item.Icon,
      pos: item.EquipType,
    };
  }
}
fs.writeJsonSync(path.join(jsonDetail.dir, "RelicMap.json"), cvtRelicMap);
Counter.Success();

// 处理圣遗物
logger.default.info(`[components][wikiRelic][convert] 开始处理圣遗物部件`);
const cvtRelic: TGACore.Components.Relic.RelicFile = [];
for (const relic of rawRelic) {
  const relicItem: TGACore.Components.Relic.RelicItem = {
    set: relic.SetId,
    pos: relic.EquipType,
    name: relic.Name,
    icon: relic.Icon,
    desc: relic.Description,
    story: "",
  };
  const yattaSet = rawYattaRelic.find((i) => i.id === relic.SetId);
  if (!yattaSet) {
    logger.default.warn(`[components][wikiRelic][convert] 未找到${relic.SetId}套装对应的Yatta数据`);
    continue;
  }
  const key = getYattaPos(relic.EquipType);
  if (key === "") {
    logger.default.warn(`[components][wikiRelic][convert] 未知部件位置 ${relic.EquipType}`);
    continue;
  }
  if (Object.hasOwn(yattaSet.story, key) && yattaSet.story[key] !== undefined)
    relicItem.story = yattaSet.story[key];
  else {
    logger.default.warn(
      `[components][wikiRelic][convert] 未获取到部件${relic.SetId}_${relic.EquipType}故事`,
    );
    continue;
  }
  cvtRelic.push(relicItem);
}
fs.writeJSONSync(path.join(jsonDetail.dir, "Relic.json"), cvtRelic);
Counter.Success();

// 处理套装
logger.default.info(`[components][wikiRelic][convert] 开始处理套装数据`);
const rawSet = hutaoTool.read<TGACore.Plugins.Hutao.Relic.RawSet>(hutaoTool.enum.file.RelicSet);
const cvtSet: TGACore.Components.Relic.SetFile = [];
for (const set of rawSet) {
  const affix: Array<TGACore.Components.Relic.SetAffix> = [];
  for (let i = 0; i < set.NeedNumber.length; i++) {
    affix.push({ cnt: set.NeedNumber[i], desc: set.Descriptions[i] });
  }
  const suits: Array<TGACore.Components.Relic.SetSuit> = [];
  const filter = rawRelic.filter((i) => i.SetId === set.SetId);
  for (const i of filter) {
    suits.push({ star: i.RankLevel, list: i.Ids });
  }
  cvtSet.push({
    id: set.SetId,
    name: set.Name,
    affix: affix,
    suits: suits,
  });
}
fs.writeJSONSync(path.join(jsonDetail.dir, "RelicSet.json"), cvtSet);
Counter.Success();
Counter.End();
Counter.Output();

logger.default.info("[components][wikiRelic][convert] convert.ts 运行完成");

/**
 * 根据部件位置获取Yatta对应Key
 * @since 2.6.0
 * @param pos - 部件位置
 * @returns 部件Key
 */
function getYattaPos(pos: number): string {
  switch (pos) {
    case 1:
      return "EQUIP_BRACER";
    case 2:
      return "EQUIP_NECKLACE";
    case 3:
      return "EQUIP_SHOES";
    case 4:
      return "EQUIP_RING";
    case 5:
      return "EQUIP_DRESS";
    default:
      return "";
  }
}
