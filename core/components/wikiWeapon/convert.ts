/**
 * @file core/components/wiki/convert.ts
 * @description wiki组件转换器
 * @since 2.3.0
 */

import process from "node:process";

import hutaoTool from "@hutao/hutao.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import matchMaterials from "@utils/matchMaterials.ts";
import fs from "fs-extra";

import { jsonDetail, jsonDir } from "./constant.ts";

logger.init();
logger.default.info("[components][wiki][convert] 运行 convert.ts");

// 前置检查
fileCheckObj(jsonDir);
fileCheck(jsonDetail.dir);

if (
  !fileCheck(jsonDetail.weapon.src, false) ||
  !hutaoTool.check(hutaoTool.enum.file.Weapon) ||
  !hutaoTool.check(hutaoTool.enum.file.Material)
) {
  logger.default.error("[components][wiki][convert] wiki元数据文件不存在");
  logger.console.info("[components][wiki][convert] 请执行 download.ts");
  process.exit(1);
}

Counter.Reset();
const yattaRaw: Array<TGACore.Plugins.Yatta.Weapon.LocalWeapon> = await fs.readJSON(
  jsonDetail.weapon.src,
);
const weaponRaw = hutaoTool.read<TGACore.Plugins.Hutao.Weapon.RawWeapon>(
  hutaoTool.enum.file.Weapon,
);
Counter.addTotal(weaponRaw.length);

// 处理武器
const wikiWeapon: Array<TGACore.Components.Weapon.WikiItem> = [];
for (const weapon of weaponRaw) {
  const materials = matchMaterials(weapon.CultivationItems);
  const yattaFind = yattaRaw.find((item) => item.id === weapon.Id);
  if (!yattaFind) {
    logger.default.warn(
      `[components][wiki][convert][${weapon.Id}] 武器 ${weapon.Name} 在 yatta 数据中未找到对应项，跳过`,
    );
    Counter.Fail();
    continue;
  }
  const data = {
    id: weapon.Id,
    name: weapon.Name,
    description: weapon.Description,
    star: weapon.RankLevel,
    weapon: hutaoTool.enum.transW(weapon.WeaponType),
    materials,
    affix: weapon.Affix,
    story: yattaFind.story,
  };
  wikiWeapon.push(data);
  logger.console.mark(`[components][wiki][convert][${weapon.Id}] 武器 ${weapon.Name} 数据转换完成`);
  Counter.Success();
}
await fs.writeJSON(jsonDetail.weapon.out, wikiWeapon);
Counter.End();

logger.default.info(`[components][wiki][convert] wiki组件转换完成，耗时${Counter.getTime()}`);
Counter.Output();
