/**
 * @file core/components/wikiWeapon/download.ts
 * @description wiki组件下载器
 * @since 2.4.0
 */

import hutaoTool from "@hutao/hutao.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import { fileCheckObj } from "@utils/fileCheck.ts";
import yattaTool from "@yatta/yatta.ts";
import fs from "fs-extra";

import { jsonDetail, jsonDir } from "./constant.ts";

logger.init();
Counter.Init("[components][wiki][download]");
logger.default.info("[components][wiki][download] 运行 download.ts");

fileCheckObj(jsonDir);

Counter.Reset(2);

logger.console.info("[components][wiki][download] 开始下载 Metadata 数据");
const meta = await hutaoTool.sync();
// 更新武器元数据
try {
  const weaponStat = await hutaoTool.update(meta, hutaoTool.enum.file.Weapon);
  if (weaponStat) Counter.Success();
  else Counter.Skip();
} catch (e) {
  logger.default.error(`[components][wiki][download] 更新武器元数据失败`);
  console.error(e);
  Counter.Fail();
}
// 更新材料元数据
try {
  const materialStat = await hutaoTool.update(meta, hutaoTool.enum.file.Material);
  if (materialStat) Counter.Success();
  else Counter.Skip();
} catch (e) {
  logger.default.error(`[components][wiki][download] 更新材料元数据失败`);
  console.error(e);
  Counter.Fail();
}
// 读取武器元数据
const rawWeapon = hutaoTool.read<TGACore.Plugins.Hutao.Weapon.RawWeapon>(
  hutaoTool.enum.file.Weapon,
);

Counter.addTotal(rawWeapon.length);
logger.console.info("[components][wiki][download] 开始下载 Yatta 数据");
const yattaWeapon: TGACore.Plugins.Yatta.Weapon.LocalWeaponList = [];

for (const weapon of rawWeapon) {
  let detail: TGACore.Plugins.Yatta.Weapon.LocalWeapon;
  try {
    const detailResp = await yattaTool.fetchJson<TGACore.Plugins.Yatta.Weapon.WeaponDetailResponse>(
      `CHS/weapon/${weapon.Id}`,
    );
    detail = { ...detailResp.data, story: [] };
    Counter.Success();
  } catch (e) {
    logger.default.warn(`[components][wiki][download][${weapon.Id}] 详细数据获取失败`);
    logger.default.error(e);
    Counter.Fail();
    continue;
  }
  Counter.addTotal(detail.storyId.length);
  const storyList: Array<string> = [];
  for (const id of detail.storyId) {
    try {
      const storyResp = await yattaTool.fetchJson<TGACore.Plugins.Yatta.Weapon.WeaponReadResponse>(
        `CHS/readable/Weapon${id}`,
      );
      storyList.push(storyResp.data);
      Counter.Success();
    } catch (e) {
      logger.default.error(`[components][wiki][downloada][${weapon.Id}] 获取武器故事 ${id} 失败`);
      logger.default.error(e);
      Counter.Fail();
    }
  }
  detail.story = storyList;
  logger.console.mark(
    `[components][wiki][download][${weapon.Id}] 武器 ${weapon.Name} 数据获取完成`,
  );
  yattaWeapon.push(detail);
}

await fs.writeJSON(jsonDetail.weapon.src, yattaWeapon, { spaces: 2 });
Counter.End();

logger.default.info("[components][wiki][download] download.ts 运行结束");
logger.default.info(`[components][wiki][download] 耗时: ${Counter.getTime()}`);
Counter.Output();
