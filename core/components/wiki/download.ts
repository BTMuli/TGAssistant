/**
 * @file core/components/wiki/download.ts
 * @description wiki组件下载器
 * @since 2.0.0
 */

import process from "node:process";

import axios from "axios";
import fs from "fs-extra";
import sharp from "sharp";

import { imageDetail, jsonDetail, jsonDir } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";
import {
  checkMetadata,
  getMetadata,
  getSnapDownloadUrl,
  updateMetadata,
} from "../../utils/operGitRepo.ts";

logger.init();
Counter.Init("[components][wiki][download]");
logger.default.info("[components][wiki][download] 运行 download.ts");

fileCheckObj(jsonDir);
fileCheckObj(imageDetail);

const metadata = await getMetadata().catch((e) => {
  logger.default.error("[components][wiki][download] 获取元数据失败");
  logger.console.error(e);
  process.exit(1);
});

// 下载 wiki 数据
Counter.Reset();
const urlRes = getSnapDownloadUrl("Avatar", "Weapon", "Material");
for (const [key, value] of urlRes) {
  let savePath: string;
  if (key === "Avatar") {
    savePath = jsonDetail.character.src;
  } else if (key === "Weapon") {
    savePath = jsonDetail.weapon.src;
  } else {
    savePath = jsonDetail.material;
  }
  if (checkMetadata(key, metadata) && fileCheck(savePath, false)) {
    logger.console.mark(`[components][wiki][download] ${key} 数据已存在，跳过`);
    Counter.Skip();
    continue;
  }
  try {
    const res = await axios.get(value);
    await fs.writeJSON(savePath, res.data, { spaces: 2 });
    logger.default.info(`[components][wiki][download] ${key} 数据下载完成`);
    Counter.Success();
    await updateMetadata(key, metadata);
  } catch (e) {
    logger.default.error(`[components][wiki][download] ${key} 数据下载失败`);
    console.error(e);
    Counter.Fail();
  }
}
Counter.End();

// 下载 wiki 所需的材料、天赋、命座数据
Counter.Reset();
const rawCharacter: TGACore.Components.Character.RawHutaoItem[] = await fs.readJSON(
  jsonDetail.character.src,
);
const rawWeapon: TGACore.Components.Weapon.RawHutaoItem[] = await fs.readJSON(
  jsonDetail.weapon.src,
);
for (const character of rawCharacter) {
  await downloadMaterials(character.CultivationItems);
  await downloadTalents(character.SkillDepot.Skills);
  await downloadTalent(character.SkillDepot.EnergySkill);
  await downloadTalents(character.SkillDepot.Inherents);
  await downloadConstellations(character.SkillDepot.Talents);
}
for (const weapon of rawWeapon) {
  await downloadMaterials(weapon.CultivationItems);
}
Counter.End();

logger.default.info(
  `[components][wiki][download] download.ts 运行结束，耗时：${Counter.getTime()}`,
);
Counter.Output();

// 用到的函数

/**
 * @description 下载材料图像
 * @since 2.0.0
 * @param {number[]} materials 材料id数组
 * @returns {Promise<void>}
 */
async function downloadMaterials(materials: number[]): Promise<void> {
  const saveDir = imageDetail.material.src;
  Counter.addTotal(materials.length);
  for (const material of materials) {
    const savePath = `${saveDir}/${material}.png`;
    const link = `https://api.ambr.top/assets/UI/UI_ItemIcon_${material}.png`;
    await downloadImage(savePath, link, `材料 ${material}`);
  }
}

/**
 * @description 下载天赋图像
 * @since 2.0.0
 * @param {TGACore.Components.Character.RhisdSkill[]} talents 天赋数组
 * @returns {Promise<void>}
 */
async function downloadTalents(talents: TGACore.Components.Character.RhisdTalent[]): Promise<void> {
  for (const talent of talents) {
    await downloadTalent(talent);
  }
}

/**
 * @description 下载天赋图像
 * @since 2.0.0
 * @param {TGACore.Components.Character.RhisdSkill} talent 天赋
 * @returns {Promise<void>}
 */
async function downloadTalent(talent: TGACore.Components.Character.RhisdTalent): Promise<void> {
  Counter.addTotal(1);
  if (talent.Icon === "") {
    logger.default.warn(`[components][wiki][download][icon] 天赋 ${talent.Name} 无图标，跳过`);
    Counter.Skip();
    return;
  }
  const saveDir = imageDetail.talents.src;
  const savePath = `${saveDir}/${talent.Icon}.png`;
  const link = `https://api.ambr.top/assets/UI/${talent.Icon}.png`;
  await downloadImage(savePath, link, `天赋 ${talent.Icon}`);
}

/**
 * @description 下载命座图像
 * @since 2.0.0
 * @param {TGACore.Components.Character.RhisdSkill[]} constellations 命座数组
 * @returns {Promise<void>}
 */
async function downloadConstellations(
  constellations: TGACore.Components.Character.RhisdTalent[],
): Promise<void> {
  Counter.addTotal(constellations.length);
  for (const constellation of constellations) {
    const saveDir = imageDetail.constellations.src;
    const savePath = `${saveDir}/${constellation.Icon}.png`;
    const link = `https://api.ambr.top/assets/UI/${constellation.Icon}.png`;
    await downloadImage(savePath, link, `命座 ${constellation.Icon}`);
  }
}

/**
 * @description 下载图像
 * @since 2.0.0
 * @param {string} savePath 保存路径
 * @param {string} link 图像链接
 * @param {string} label 日志标签
 * @returns {Promise<void>}
 */
async function downloadImage(savePath: string, link: string, label: string): Promise<void> {
  if (fileCheck(savePath, false)) {
    logger.console.mark(`[components][wiki][download][icon] ${label} 已存在，跳过`);
    Counter.Skip();
    return;
  }
  try {
    const res = await axios.get(link, { responseType: "arraybuffer" });
    await sharp(<ArrayBuffer>res.data).toFile(savePath);
    logger.default.info(`[components][wiki][download][icon] ${label} 下载完成`);
    Counter.Success();
  } catch (e) {
    logger.default.error(`[components][wiki][download][icon] ${label} 下载失败`);
    Counter.Fail();
  }
}
