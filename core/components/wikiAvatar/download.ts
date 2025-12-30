/**
 * @file core/components/wikiAvatar/download
 * @description 角色Wiki组件资源下载
 * @since 2.4.1
 */

import path from "node:path";

import hutaoTool from "@hutao/hutao.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import fetchSgBuffer from "@utils/fetchSgBuffer.ts";
import { fileCheck, fileCheckObj } from "@utils/fileCheck.ts";
import sharp from "sharp";

import { imageDetail } from "./constant.ts";

logger.init();
Counter.Init("[components][wikiAvatar][download]");
logger.default.info("[components][wikiAvatar][download] 运行 download.ts");

fileCheckObj(imageDetail);

const meta = await hutaoTool.sync();
const paramList: Array<string> = Object.keys(meta)
  .filter((key) => key.startsWith(hutaoTool.enum.file.Avatar))
  .map((key) => key.replace(hutaoTool.enum.file.Avatar, ""));
Counter.addTotal(paramList.length);
for (const param of paramList) {
  try {
    const statKey = await hutaoTool.update(meta, hutaoTool.enum.file.Avatar, param);
    if (statKey) {
      logger.default.info(`[components][wikiAvatar][download][${param}] 成功更新 Metadata 数据`);
      Counter.Success();
    } else {
      logger.console.mark(`[components][wikiAvatar][download][${param}] 无需更新 Metadata 数据`);
      Counter.Skip();
    }
  } catch (e) {
    logger.default.error(`[components][wikiAvatar][download][${param}] 更新 Metadata 数据失败`);
    logger.console.error(`[components][wikiAvatar][download][${param}] ${e}`);
    Counter.Fail();
  }
}

// 下载角色天赋&命座数据
Counter.Reset();
for (const param of paramList) {
  const check = hutaoTool.check(hutaoTool.enum.file.Avatar, param);
  if (!check) {
    logger.default.error(`[components][wikiAvatar][download][${param}] 角色元数据文件不存在`);
    Counter.Fail();
    continue;
  }
  const rawAvatar = hutaoTool.read<TGACore.Plugins.Hutao.Avatar.FullInfo>(
    hutaoTool.enum.file.Avatar,
    param,
  );
  for (const skill of rawAvatar.SkillDepot.Skills) await downloadSkill(skill);
  await downloadSkill(rawAvatar.SkillDepot.EnergySkill);
  for (const inherent of rawAvatar.SkillDepot.Inherents) await downloadSkill(inherent, true);
  await downloadTalents(rawAvatar.SkillDepot.Talents);
  for (const skill of rawAvatar.SkillDepot?.SpecialSkills ?? []) await downloadSkill(skill, true);
}
Counter.End();

logger.default.info("[components][wikiAvatar][download] download.ts 运行结束");
logger.default.info(`[components][wikiAvatar][download] 耗时：${Counter.getTime()}`);
Counter.Output();

/**
 * @description 下载天赋图像（单个）
 * @since 2.4.0
 * @function downloadSkill
 * @param {TGACore.Plugins.Hutao.Avatar.Skill} skill 天赋数据
 * @param {boolean} isDepot 是否是技能
 * @returns {Promise<void>}
 */
async function downloadSkill(
  skill: TGACore.Plugins.Hutao.Avatar.Skill,
  isDepot: boolean = false,
): Promise<void> {
  Counter.addTotal(1);
  if (skill.Icon === "") {
    logger.default.warn(
      `[components][wikiAvatar][download][icon] 天赋 ${skill.Name}(${skill.Id}) 无图标，跳过`,
    );
    Counter.Skip();
    return;
  }
  const savePath = path.join(imageDetail.talents.src, `${skill.Icon}.png`);
  if (fileCheck(savePath, false)) {
    logger.console.mark(
      `[components][wikiAvatar][download][icon] 天赋 ${skill.Name}(${skill.Id}) 已存在，跳过下载`,
    );
    Counter.Skip();
    return;
  }
  try {
    const staticDir = isDepot ? "Talent" : "Skill";
    const buffer = await fetchSgBuffer(staticDir, `${skill.Icon}.png`);
    await sharp(buffer).toFile(savePath);
    logger.default.info(
      `[components][wikiAvatar][download][icon] 天赋 ${skill.Name}(${skill.Id}) 下载完成`,
    );
    Counter.Success();
  } catch (e) {
    logger.default.error(
      `[components][wikiAvatar][download][icon] 天赋 ${skill.Name}(${skill.Id}) 下载失败`,
    );
    logger.default.error(e);
    Counter.Fail();
  }
}

/**
 * @description 下载命座图像
 * @since 2.4.0
 * @function downloadTalents
 * @param {Array<TGACore.Plugins.Hutao.Avatar.Constellation>} talents 命座数据
 * @returns {Promise<void>}
 */
async function downloadTalents(
  talents: Array<TGACore.Plugins.Hutao.Avatar.Constellation>,
): Promise<void> {
  Counter.addTotal(talents.length);
  for (const talent of talents) {
    const savePath = path.join(imageDetail.constellations.src, `${talent.Icon}.png`);
    if (fileCheck(savePath, false)) {
      logger.console.mark(
        `[components][wikiAvatar][download][icon] 命座 ${talent.Icon}(${talent.Id}) 已存在，跳过下载`,
      );
      Counter.Skip();
      continue;
    }
    try {
      const buffer = await fetchSgBuffer("Talent", `${talent.Icon}.png`);
      await sharp(buffer).toFile(savePath);
      logger.default.info(
        `[components][wikiAvatar][download][icon] 命座 ${talent.Icon}(${talent.Id}) 下载完成`,
      );
      Counter.Success();
    } catch (e) {
      logger.default.error(
        `[components][wikiAvatar][download][icon] 命座 ${talent.Icon}(${talent.Id}) 下载失败`,
      );
      logger.default.error(e);
      Counter.Fail();
    }
  }
}
