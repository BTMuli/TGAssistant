/**
 * @file core/components/wikiAvatar/convert.ts
 * @description wikiAvatar 组件转换器
 * @since 2.4.0
 */

import path from "node:path";

import hutaoTool from "@hutao/hutao.ts";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import matchMaterials from "@utils/matchMaterials.ts";
import { fileCheck } from "core/utils/fileCheck.ts";
import fs from "fs-extra";
import sharp from "sharp";

import { imageDetail, jsonOutDir } from "./constant.ts";

logger.init();
logger.default.info("[components][wikiAvatar][convert] 运行 convert.ts");

// 前置检查
fileCheck(jsonOutDir);
const localMeta = hutaoTool.read<Record<string, string>>(hutaoTool.enum.file.Meta);
const paramList = hutaoTool.readIds(localMeta);

Counter.Reset(paramList.length);
for (const param of paramList) {
  const check = hutaoTool.check(hutaoTool.enum.file.Avatar, param);
  if (!check) {
    logger.default.error(`[components][wikiAvatar][convert] 角色${param}元数据文件不存在`);
    Counter.Fail();
    continue;
  }

  const avatarRaw = hutaoTool.read<TGACore.Plugins.Hutao.Avatar.RawAvatar>(
    hutaoTool.enum.file.Avatar,
    param,
  );
  // 处理图像
  for (const skill of avatarRaw.SkillDepot.Skills) await convertSkill(skill);
  for (const inherent of avatarRaw.SkillDepot.Inherents) await convertSkill(inherent);
  await convertSkill(avatarRaw.SkillDepot.EnergySkill);
  for (const talent of avatarRaw.SkillDepot.Talents) await convertTalent(talent);
  // 转换数据
  const avatarTrans: TGACore.Components.Character.WikiItem = transCharacter(avatarRaw);
  const savePath = path.join(jsonOutDir, `${param}.json`);
  await fs.writeJSON(savePath, avatarTrans);
  logger.default.info(`[components][wikiAvatar][convert] 角色${param}转换完成`);
  Counter.Success();
}
Counter.End();

logger.default.info("[components][wikiAvatar][convert] convert.ts 执行完成");
logger.default.info(`[components][wikiAvatar][convert] 耗时: ${Counter.getTime()}`);
Counter.Output();

/**
 * @description 转换角色数据
 * @since 2.2.0
 * @param {TGACore.Components.Character.RawHutaoItem} raw 原始数据
 * @returns {TGACore.Components.Character.WikiItem} 转换后的数据
 */
function transCharacter(
  raw: TGACore.Components.Character.RawHutaoItem,
): TGACore.Components.Character.WikiItem {
  const materials = matchMaterials(raw.CultivationItems);
  const tempSkills = [
    ...raw.SkillDepot.Skills,
    raw.SkillDepot.EnergySkill,
    ...raw.SkillDepot.Inherents,
  ];
  let skills: Array<Omit<TGACore.Components.Character.RhisdSkill, "Proud">> = [];
  tempSkills.forEach((skill) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { Proud, ...rest } = skill;
    skills.push(rest);
  });
  skills = skills.filter((skill) => skill.Icon !== "");
  return {
    id: raw.Id,
    name: raw.Name,
    title: raw.FetterInfo.Title,
    description: raw.Description,
    area: transArea(raw.FetterInfo.Association),
    brief: {
      camp: raw.FetterInfo.Native,
      constellation: raw.FetterInfo.ConstellationBefore,
      birth: `${raw.FetterInfo.BirthMonth}月${raw.FetterInfo.BirthDay}日`,
      cv: {
        cn: raw.FetterInfo.CvChinese,
        jp: raw.FetterInfo.CvJapanese,
        en: raw.FetterInfo.CvEnglish,
        kr: raw.FetterInfo.CvKorean,
      },
    },
    star: raw.Quality === 105 ? 5 : raw.Quality,
    element: raw.FetterInfo.VisionBefore,
    weapon: hutaoTool.enum.transW(raw.Weapon),
    materials,
    skills,
    constellation: raw.SkillDepot.Talents,
    // todo: costume 衣装
    // todo: food 料理
    talks: transTalks(raw.FetterInfo.Fetters, raw.Name),
    stories: raw.FetterInfo.FetterStories,
  };
}

/**
 * @description 转换地区
 * @since 2.4.0
 * @param {number} raw 原始数据
 * @returns {string} 转换后的数据
 */
export function transArea(raw: number): string {
  const AssocList = [
    "未知",
    "蒙德",
    "璃月",
    "主角",
    "愚人众",
    "稻妻",
    "游侠",
    "须弥",
    "枫丹",
    "纳塔",
    "至冬",
    "寰宇劫灭",
    "挪德卡莱",
  ];
  if (raw >= AssocList.length || raw < 0) {
    return "未知";
  }
  return AssocList[raw];
}

/**
 * @description 转换对话
 * @since 2.2.0
 * @param {TGACore.Components.Character.RhiFetter[]} raw 原始数据
 * @param {string} name 角色名
 * @returns {TGACore.Components.Character.RhiFetter[]} 转换后的数据
 */
function transTalks(
  raw: TGACore.Components.Character.RhiFetter[],
  name: string,
): TGACore.Components.Character.RhiFetter[] {
  const res = [];
  for (const r of raw) {
    const item = JSON.parse(JSON.stringify(r));
    const visionM = "<color=#FFA726>【空视角】</color>\r\n";
    const visionF = "<color=#FFA726>【荧视角】</color>\r\n";
    if (name === "流浪者") {
      if (r.Title.startsWith("#") && r.Title.includes("{REALNAME[ID(1)]}")) {
        item.Title = item.Title.substring(1);
        item.Title = item.Title.replace("{REALNAME[ID(1)]}", "流浪者");
        logger.console.info("[components][wiki][convert][talk]", r.Title, "->", item.Title);
      }
    } else if (name === "温迪") {
      if (r.Context.startsWith("#")) {
        const specialStr = "{MATEAVATAR#SEXPRO[INFO_MALE_PRONOUN_BOYD|INFO_FEMALE_PRONOUN_GIRLD]}";
        let transA = r.Context.replace(specialStr, "公主");
        let transB = r.Context.replace(specialStr, "王子");
        transA = transA.replace("#", visionM);
        transB = transB.replace("#", visionF);
        item.Context = `${transA}\r\n\r\n${transB}`;
      }
    } else if (name === "凝光") {
      if (r.Context.startsWith("#")) {
        const reg = /\{M#(.*?)}\{F#(.*?)}/;
        const match = r.Context.match(reg);
        if (match !== null) {
          const transA = match[1];
          const transB = match[2];
          item.Context = `${visionM}${transA}\r\n\r\n${visionF}${transB}`;
        }
      }
    } else if (name === "菲谢尔") {
      if (r.Context.startsWith("#")) {
        const specialStr = "{PLAYERAVATAR#SEXPRO[INFO_MALE_PRONOUN_HE|INFO_FEMALE_PRONOUN_SHE]}";
        let transA = r.Context.replace(specialStr, "他");
        let transB = r.Context.replace(specialStr, "她");
        transA = transA.replace("#", visionM);
        transB = transB.replace("#", visionF);
        item.Context = `${transA}\r\n\r\n${transB}`;
      }
    } else if (name === "赛索斯") {
      if (r.Context.startsWith("#")) {
        const specialStr = "{M#先生}{F#小姐}";
        let transA = r.Context.replace(specialStr, "先生");
        let transB = r.Context.replace(specialStr, "小姐");
        transA = transA.replace("#", visionM);
        transB = transB.replace("#", visionF);
        item.Context = `${transA}\r\n\r\n${transB}`;
      }
    } else if (name === "克洛琳德") {
      if (r.Context.startsWith("#")) {
        const specialStr = "{M#他}{F#她}";
        let transA = r.Context.replace(specialStr, "他").replace(specialStr, "他");
        let transB = r.Context.replace(specialStr, "她").replace(specialStr, "她");
        transA = transA.replace("#", visionM);
        transB = transB.replace("#", visionF);
        item.Context = `${transA}\r\n\r\n${transB}`;
      }
    }
    res.push(item);
  }
  return res;
}

/**
 * @description 转换天赋图像
 * @since 2.4.0
 * @function convertSkill
 * @param {TGACore.Plugins.Hutao.Avatar.Skill} skill 天赋
 * @returns {Promise<void>}
 */
async function convertSkill(skill: TGACore.Plugins.Hutao.Avatar.Skill): Promise<void> {
  const imgDir = imageDetail.talents;
  if (skill.Icon === "") {
    Counter.addTotal();
    logger.default.warn(`[components][wiki][convert][icon] 天赋 ${skill.Name} 无图标`);
    Counter.Skip();
    return;
  }
  const oriPath = `${imgDir.src}/${skill.Icon}.png`;
  const savePath = `${imgDir.out}/${skill.Icon}.webp`;
  await convertImage(oriPath, savePath, `天赋 ${skill.Icon}`);
}

/**
 * @description 转换命座图像
 * @since 2.4.0
 * @function convertTalent
 * @param {TGACore.Plugins.Hutao.Avatar.Talent} talent 命座数组
 * @returns {Promise<void>}
 */
async function convertTalent(talent: TGACore.Plugins.Hutao.Avatar.Talent): Promise<void> {
  const oriPath = `${imageDetail.constellations.src}/${talent.Icon}.png`;
  const savePath = `${imageDetail.constellations.out}/${talent.Icon}.webp`;
  await convertImage(oriPath, savePath, `命座 ${talent.Icon}`);
}

/**
 * @description 转换图像
 * @since 2.2.0
 * @param {string} oriPath 原始路径
 * @param {string} savePath 保存路径
 * @param {string} name 名称
 * @returns {Promise<void>}
 */
async function convertImage(oriPath: string, savePath: string, name: string): Promise<void> {
  Counter.addTotal();
  if (!fileCheck(oriPath, false)) {
    logger.default.warn(`[components][wiki][convert][icon] ${name} 无图标`);
    Counter.Fail();
    return;
  }
  if (fileCheck(savePath, false)) {
    logger.console.mark(`[components][wiki][convert][icon] ${name} 已存在，跳过`);
    Counter.Skip();
    return;
  }
  await sharp(oriPath).webp().toFile(savePath);
  logger.console.info(`[components][wiki][convert][icon] ${name} 转换完成`);
  Counter.Success();
}
