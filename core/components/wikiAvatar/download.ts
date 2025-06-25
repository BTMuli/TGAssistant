/**
 * @file core/components/wikiAvatar/download
 * @description 角色Wiki组件资源下载
 * @since 2.4.0
 */

import axios from "axios";
import fs from "fs-extra";
import sharp from "sharp";

import { imageDetail, jsonDir, jsonDetail } from "./constant.ts";
import Counter from "../../tools/counter.ts";
import logger from "../../tools/logger.ts";
import { fileCheck, fileCheckObj } from "../../utils/fileCheck.ts";
import { getSnapAvatarDownloadUrl } from "../../utils/operGitRepo.ts";
import { readConfig } from "../../utils/readConfig.ts";
import process from "node:process";
import path from "node:path";

logger.init();
Counter.Init("[components][wikiAvatar][download]");
logger.default.info("[components][wikiAvatar][download] 运行 download.ts");
const ambrConfig = readConfig("constant").amber;

fileCheckObj(jsonDir);
fileCheckObj(imageDetail);

const avatarIds: number[] = [];

// 下载ambr的角色数据
Counter.Reset();
logger.default.info("[components][wikiAvatar][download] 下载 amber 角色数据");
try {
  const res: TGACore.Plugins.Amber.ResponseCharacter = await axios
    .get(`${ambrConfig.api}chs/avatar`, { params: { vh: ambrConfig.version } })
    .then((res) => res.data);
  // 获取角色ID列表存到本地
  Object.values(res.data.items).forEach((i) => {
    if (!isNaN(Number(i.id))) avatarIds.push(Number(i.id));
  });
  await fs.writeJSON(jsonDetail.amber, avatarIds);
  logger.default.info(`[components][wikiAvatar][download] 成功获取 ${avatarIds.length} 条角色ID`);
} catch (error) {
  logger.default.error("[components][wikiAvatar][download] 获取角色ID列表失败");
  logger.console.error(error);
  process.exit(1);
}

// 下载 metadata 元数据
Counter.Reset(avatarIds.length);
const urlRes = getSnapAvatarDownloadUrl(avatarIds);
for (const url of urlRes) {
  const fileName = url.split("/").pop();
  if (fileName === undefined) {
    logger.default.error(`[components][wikiAvatar][download] 文件名获取失败: ${url}`);
    Counter.Fail();
    continue;
  }
  const savePath = path.join(jsonDir.src, fileName);
  if (fs.existsSync(savePath)) {
    logger.default.mark(`[components][wikiAvatar][download] ${fileName} 已存在，跳过`);
    Counter.Skip();
    continue;
  }
  try {
    const res = await axios.get(url);
    await fs.writeJSON(savePath, res.data, { spaces: 2 });
    logger.default.info(`[components][wikiAvatar][download] ${fileName} 下载完成`);
    Counter.Success();
  } catch (error) {
    logger.default.error(`[components][wikiAvatar][download] ${fileName} 下载失败`);
    logger.console.error(error);
    Counter.Fail();
  }
}
Counter.End();

// 下载角色天赋&命座数据
Counter.Reset();
for (const id of avatarIds) {
  const filePath = path.join(jsonDir.src, `${id}.json`);
  if (!fs.existsSync(filePath)) {
    logger.default.error(`[components][wikiAvatar][download] 角色 ${id} JSON不存在`);
    Counter.Fail();
    continue;
  }
  const rawAvatar: TGACore.Components.Character.RawHutaoItem = await fs.readJson(filePath);
  await downloadTalents(rawAvatar.SkillDepot.Skills);
  await downloadTalent(rawAvatar.SkillDepot.EnergySkill);
  await downloadTalents(rawAvatar.SkillDepot.Inherents);
  await downloadConstellations(rawAvatar.SkillDepot.Talents);
}
Counter.End();

logger.default.info("[components][wikiAvatar][download] download.ts 运行结束");
logger.default.info(`[components][wikiAvatar][download] 耗时：${Counter.getTime()}`);
Counter.Output();

/**
 * @description 下载天赋图像（批量）
 * @since 2.2.0
 * @param {TGACore.Components.Character.RhisdSkill[]} talents
 * @returns {Promise<void>}
 */
async function downloadTalents(talents: TGACore.Components.Character.RhisdSkill[]): Promise<void> {
  for (const talent of talents) {
    await downloadTalent(talent);
  }
}

/**
 * @description 下载天赋图像（单个）
 * @since 2.2.0
 * @param {TGACore.Components.Character.RhisdSkill} talent
 * @returns {Promise<void>}
 */
async function downloadTalent(talent: TGACore.Components.Character.RhisdSkill): Promise<void> {
  Counter.addTotal(1);
  if (talent.Icon === "") {
    logger.default.warn(
      `[components][wikiAvatar][download][icon] 天赋 ${talent.Name}(${talent.Id}) 无图标，跳过`,
    );
    Counter.Skip();
    return;
  }
  const savePath = path.join(imageDetail.talents.src, `${talent.Icon}.png`);
  const link = `${ambrConfig.assets}${talent.Icon}.png`;
  await downloadImage(savePath, link, `天赋 ${talent.Icon}(${talent.Id})`);
}

/**
 * @description 下载命座图像
 * @since 2.2.0
 * @param {TGACore.Components.Character.RhisdTalent[]} constellations 命座数据
 * @returns {Promise<void>}
 */
async function downloadConstellations(
  constellations: TGACore.Components.Character.RhisdTalent[],
): Promise<void> {
  Counter.addTotal(constellations.length);
  for (const constellation of constellations) {
    const savePath = path.join(imageDetail.constellations.src, `${constellation.Icon}.png`);
    const link = `${ambrConfig.assets}${constellation.Icon}.png`;
    await downloadImage(savePath, link, `命座 ${constellation.Icon}(${constellation.Id})`);
  }
}

/**
 * @description 下载图像
 * @since 2.2.0
 * @param {string} savePath 保存路径
 * @param {string} link 图像链接
 * @param {string} label 描述
 * @returns {Promise<void>}
 */
async function downloadImage(savePath: string, link: string, label: string): Promise<void> {
  if (fileCheck(savePath, false)) {
    logger.console.mark(`[components][wikiAvatar][download][icon] ${label}已存在，跳过下载`);
    Counter.Skip();
    return;
  }
  try {
    const res = await axios.get(link, { responseType: "arraybuffer" });
    await sharp(<ArrayBuffer>res.data).toFile(savePath);
    logger.default.info(`[components][wikiAvatar][download][icon] ${label} 下载完成`);
    Counter.Success();
  } catch (e) {
    logger.default.error(`[components][wikiAvatar][download][icon] ${label} 下载失败`);
    logger.default.error(e);
    Counter.Fail();
  }
}
