/**
 * 武器WIKI组件转换器
 * @since 2.6.0
 */

import process from "node:process";

import hutaoTool from "@hutao/hutao.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import matchMaterials from "@utils/matchMaterials.ts";
import fs from "fs-extra";

import { jsonDetail, jsonDir } from "./constant.ts";
import path from "node:path";

logger.init();
logger.default.info("[components][wikiWeapon][convert] 运行 convert.ts");

// 前置检查
fileCheckObj(jsonDir);
fileCheck(jsonDetail.dir);

if (
  !fileCheck(jsonDetail.yatta, false) ||
  !hutaoTool.check(hutaoTool.enum.file.Weapon) ||
  !hutaoTool.check(hutaoTool.enum.file.WeaponPromote) ||
  !hutaoTool.check(hutaoTool.enum.file.WeaponCurve) ||
  !hutaoTool.check(hutaoTool.enum.file.Material)
) {
  logger.default.error("[components][wikiWeapon][convert] wiki元数据文件不存在");
  logger.console.info("[components][wikiWeapon][convert] 请执行 download.ts");
  process.exit(1);
}

Counter.Reset();
const rawYatta: Array<TGACore.Plugins.Yatta.Weapon.LocalWeapon> = await fs.readJSON(
  jsonDetail.yatta,
);
const rawWeapon = hutaoTool.read<TGACore.Plugins.Hutao.Weapon.RawWeapon>(
  hutaoTool.enum.file.Weapon,
);
Counter.addTotal(rawWeapon.length);

// 处理武器
const wikiWeapon: Array<TGACore.Components.Weapon.WikiItem> = [];
for (const weapon of rawWeapon) {
  const materials = matchMaterials(weapon.CultivationItems);
  const yattaFind = rawYatta.find((item) => item.id === weapon.Id);
  if (!yattaFind) {
    logger.default.warn(
      `[components][wikiWeapon][convert][${weapon.Id}] 武器 ${weapon.Name} 在 yatta 数据中未找到对应项，跳过`,
    );
    Counter.Fail();
    continue;
  }
  const data: TGACore.Components.Weapon.WikiItem = {
    id: weapon.Id,
    name: weapon.Name,
    description: weapon.Description,
    star: weapon.RankLevel,
    weapon: hutaoTool.enum.transW(weapon.WeaponType),
    materials,
    affix: weapon.Affix,
    curves: weapon.GrowCurves.map((i) => ({
      curve: i.Value,
      prop: i.Type,
      val: i.InitValue,
    })),
    story: yattaFind.story,
  };
  wikiWeapon.push(data);
  logger.console.mark(
    `[components][wikiWeapon][convert][${weapon.Id}] 武器 ${weapon.Name} 数据转换完成`,
  );
  Counter.Success();
}
fs.writeJSONSync(path.join(jsonDetail.dir, "weapon.json"), wikiWeapon);
Counter.End();

// 处理武器突破
logger.default.info(`[components][wikiWeapon][convert] 开始处理Promote数据`);
const rawPromote = hutaoTool.read<TGACore.Plugins.Hutao.Weapon.RawPromote>(
  hutaoTool.enum.file.WeaponPromote,
);
const cvtPromote: TGACore.Components.Weapon.WeaponPromote = {};
for (const item of rawPromote) {
  if (!cvtPromote[item.Id]) cvtPromote[item.Id] = {};
  cvtPromote[item.Id][item.Level] = item.AddProperties.filter((i) => i.Value !== 0).map((i) => ({
    type: i.Type,
    addVal: i.Value,
  }));
}
fs.writeJSONSync(path.join(jsonDetail.dir, "promote.json"), cvtPromote);

// 处理武器升级
logger.default.info(`[components][wikiWeapon][convert] 开始处理Curve数据`);
const rawCurve = hutaoTool.read<TGACore.Plugins.Hutao.Weapon.RawCurve>(
  hutaoTool.enum.file.WeaponCurve,
);
const cvtCurve: TGACore.Components.Weapon.WeaponCurve = {};
for (const item of rawCurve) {
  cvtCurve[item.Level] = item.Curves.map((i) => ({ type: i.Type, addVal: i.Value }));
}
fs.writeJSONSync(path.join(jsonDetail.dir, "curve.json"), cvtPromote);

logger.default.info(`[components][wikiWeapon][convert] wiki组件转换完成，耗时${Counter.getTime()}`);
Counter.Output();
