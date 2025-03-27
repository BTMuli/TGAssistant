/**
 * @file core/components/wiki/download.ts
 * @description wiki组件下载器
 * @since 2.3.0
 */

import axios, { AxiosResponse } from "axios";
import fs from "fs-extra";

import { jsonDetail, jsonDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheckObj } from "../../utils/fileCheck.ts";
import { getSnapDownloadUrl } from "../../utils/operGitRepo.ts";
import { readConfig } from "../../utils/readConfig.ts";

logger.init();
Counter.Init("[components][wiki][download]");
logger.default.info("[components][wiki][download] 运行 download.ts");

const amberConfig = readConfig("constant").amber;

fileCheckObj(jsonDir);

Counter.Reset();

// 下载 Snap.Metadata 元数据
const urlRes = getSnapDownloadUrl("Weapon", "Material");
for (const [key, value] of urlRes) {
  let savePath: string;
  if (key === "Weapon") {
    savePath = jsonDetail.weapon.src;
  } else {
    savePath = jsonDetail.material;
  }
  try {
    const res = await axios.get(value);
    await fs.writeJSON(savePath, res.data, { spaces: 2 });
    logger.default.info(`[components][wiki][download] ${key} 数据下载完成`);
    Counter.Success();
  } catch (e) {
    logger.default.error(`[components][wiki][download] ${key} 数据下载失败`);
    console.error(e);
    Counter.Fail();
  }
}

// 下载 Amber 武器数据
const weaponAllUrl = `${amberConfig.api}CHS/weapon`;
const weaponAllRaw: Array<TGACore.Plugins.Amber.WeaponDetail> = [];
let weaponIds: string[] = [];
try {
  const weaponAllResp: AxiosResponse<TGACore.Plugins.Amber.ResponseWeapon> = await axios.get(
    weaponAllUrl,
    { params: { vh: amberConfig.version } },
  );
  const weaponAllData = weaponAllResp.data.data.items;
  weaponIds = Object.keys(weaponAllData);
  logger.default.info("[components][wiki][download] Amber.top 武器数据下载完成");
  Counter.Success();
} catch (e) {
  logger.default.error("[components][wiki][download] Amber.top 武器数据下载失败");
  console.error(e);
  Counter.Fail();
}
for (const weaponId of weaponIds) {
  const weaponUrl = `${amberConfig.api}CHS/weapon/${weaponId}`;
  try {
    const detailResp: AxiosResponse<TGACore.Plugins.Amber.WeaponDetailResp> = await axios.get(
      weaponUrl,
      { params: { vh: amberConfig.version } },
    );
    if (detailResp.data.response === 200) {
      weaponAllRaw.push(detailResp.data.data);
      logger.console.info(`[components][wiki][download] Amber.top 武器 ${weaponId} 数据下载完成`);
      Counter.Success();
    }
  } catch (e) {
    logger.default.error(`[components][wiki][download] Amber.top 武器 ${weaponId} 数据下载失败`);
    console.error(e);
    Counter.Fail();
  }
}
await fs.writeJSON(jsonDetail.weapon.amber, weaponAllRaw, { spaces: 2 });
Counter.End();

logger.default.info("[components][wiki][download] download.ts 运行结束");
logger.default.info(`[components][wiki][download] 耗时: ${Counter.getTime()}`);
Counter.Output();
