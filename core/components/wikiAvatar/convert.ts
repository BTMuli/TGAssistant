/**
 * wikiAvatar 组件转换器
 * @since 2.6.0
 */

import path from "node:path";

import hutaoTool from "@hutao/hutao.ts";
import hutao from "@hutao/hutao.ts";
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

  const avatarRaw = hutaoTool.read<TGACore.Plugins.Hutao.Avatar.FullInfo>(
    hutaoTool.enum.file.Avatar,
    param,
  );
  // 处理图像
  for (const skill of avatarRaw.SkillDepot.Skills) await convertSkill(skill);
  for (const inherent of avatarRaw.SkillDepot.Inherents) await convertSkill(inherent);
  await convertSkill(avatarRaw.SkillDepot.EnergySkill);
  for (const skill of avatarRaw.SkillDepot?.SpecialSkills ?? []) await convertSkill(skill);
  for (const talent of avatarRaw.SkillDepot.Talents) await convertTalent(talent);
  // 转换数据
  const avatarTrans: TGACore.Components.Character.Wiki = transCharacter(avatarRaw);
  const savePath = path.join(jsonOutDir, `${param}.json`);
  await fs.writeJSON(savePath, avatarTrans);
  logger.console.info(`[components][wikiAvatar][convert] 角色${param}转换完成`);
  Counter.Success();
}
Counter.End();

logger.default.info("[components][wikiAvatar][convert] convert.ts 执行完成");
logger.default.info(`[components][wikiAvatar][convert] 耗时: ${Counter.getTime()}`);
Counter.Output();

/**
 * @description 转换角色数据
 * @since 2.6.0
 * @param raw - 原始数据
 * @returns 转换后的数据
 */
function transCharacter(
  raw: TGACore.Plugins.Hutao.Avatar.FullInfo,
): TGACore.Components.Character.Wiki {
  const materials = matchMaterials(raw.CultivationItems);
  const tempSkills = [
    ...raw.SkillDepot.Skills,
    raw.SkillDepot.EnergySkill,
    ...(raw.SkillDepot?.SpecialSkills ?? []),
    ...raw.SkillDepot.Inherents,
  ];
  // TODO: 对技能排序
  const skills: Array<TGACore.Components.Character.WikiSkill> = tempSkills
    .filter((skill) => skill.Icon !== "")
    .map((skill) => {
      const levelUpTalentIndex =
        skill.Proud.Parameters.length === 1
          ? -1
          : raw.SkillDepot.Talents.findIndex(
              (talent) =>
                talent.ExtraLevel?.Index === skill.GroupId % 10 && talent.ExtraLevel.Level === 3,
            );
      return {
        group: skill.GroupId,
        id: skill.Id,
        name: skill.Name,
        desc: skill.Description,
        descSp: skill.SpecialDescription,
        icon: skill.Icon,
        maxLv: skill.Proud.Parameters.length === 1 ? 1 : 10,
        luc: levelUpTalentIndex === -1 ? null : levelUpTalentIndex + 1,
      };
    });
  return {
    id: raw.Id,
    name: raw.Name,
    title: raw.FetterInfo.Title,
    description: raw.Description,
    area: hutao.enum.area(raw.FetterInfo.Association),
    team: raw.Tags ?? [0],
    brief: {
      camp: raw.FetterInfo.Native,
      constellation: raw.FetterInfo.ConstellationAfter
        ? raw.FetterInfo.ConstellationAfter
        : raw.FetterInfo.ConstellationBefore,
      birth: `${raw.FetterInfo.BirthMonth}月${raw.FetterInfo.BirthDay}日`,
      cv: {
        cn: raw.FetterInfo.CvChinese,
        jp: raw.FetterInfo.CvJapanese,
        en: raw.FetterInfo.CvEnglish,
        kr: raw.FetterInfo.CvKorean,
      },
    },
    star: raw.Quality,
    elePrefix: raw.FetterInfo.VisionOverrideUnlocked,
    element: raw.FetterInfo.VisionBefore,
    weapon: hutaoTool.enum.transW(raw.Weapon),
    materials,
    skills,
    constellation: raw.SkillDepot.Talents,
    food: transFood(raw.FetterInfo.CookBonus),
    talks: transTalks(raw.FetterInfo.Fetters, raw.Name),
    stories: raw.FetterInfo.FetterStories,
  };
}

/**
 * 转换角色特殊料理数据。
 *
 * @since 2.6.0
 * @param raw - Metadata 中的特殊料理数据
 * @returns 转换后的特殊料理数据
 */
function transFood(
  raw: TGACore.Plugins.Hutao.Avatar.CookBonus | undefined,
): TGACore.Components.Character.WikiFood | undefined {
  if (raw === undefined) return undefined;
  const materials = matchMaterials([raw.OriginItemId, raw.ItemId]);
  const origin = materials.find((item) => item.id === raw.OriginItemId);
  const special = materials.find((item) => item.id === raw.ItemId);
  if (origin === undefined || special === undefined) return undefined;
  return {
    recipeId: raw.OriginItemId,
    origin: { id: origin.id, name: origin.name, star: origin.star },
    special: { id: special.id, name: special.name, star: special.star },
  };
}

/**
 * 转换对话
 * @since 2.2.0
 * @param raw - 原始数据
 * @param name - 角色名
 * @returns 转换后的数据
 */
function transTalks(
  raw: TGACore.Plugins.Hutao.Avatar.Text[],
  name: string,
): TGACore.Components.Character.WikiTalk[] {
  const res: Array<TGACore.Plugins.Hutao.Avatar.Text> = [];
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
  return mergeTalks(res);
}

/**
 * 根据标题规则计算合并后的标题。
 *
 * @since 2.6.0
 * @param title - 原始标题
 * @returns 合并后的标题，无需合并时返回 `undefined`
 */
function getMergeTitle(title: string): string | undefined {
  // 闲聊·xxx → 闲聊
  if (title.startsWith("闲聊·")) return "闲聊";
  // 想要了解xxx·xxx → 想要了解xxx
  const wantMatch = /^想要了解[^·]+·/.exec(title);
  if (wantMatch) return title.slice(0, title.indexOf("·"));
  // 收到赠礼·xxx → 收到赠礼
  if (title.startsWith("收到赠礼·")) return "收到赠礼";
  // 突破的感受·xxx → 突破的感受
  if (title.startsWith("突破的感受·")) return "突破的感受";
  // 冲刺开始·xxx / 冲刺结束·xxx / 元素战技·xxx / 元素爆发·xxx / 打开宝箱·xxx / 打开风之翼·xxx / 下落攻击·xxx / 普通攻击·xxx / 重攻击·xxx / 特殊重攻击·xxx → 动作
  if (
    [
      "冲刺开始",
      "冲刺结束",
      "元素战技",
      "元素爆发",
      "打开宝箱",
      "打开风之翼",
      "下落攻击",
      "普通攻击",
      "重攻击",
      "特殊重攻击",
    ].some((prefix) => title.startsWith(`${prefix}·`))
  )
    return "动作";
  // 生命值低·xxx / 同伴生命值低·xxx / 普通受击·xxx / 重受击·xxx / 倒下·xxx / 加入队伍·xxx → 队伍
  if (
    ["生命值低·", "同伴生命值低·", "普通受击·", "重受击·", "倒下·", "加入队伍·"].some((prefix) =>
      title.startsWith(prefix),
    )
  )
    return "队伍";
  // 早上好… / 中午好… / 晚上好… / 晚安… / 初次见面… / 生日… / 生辰… → 问候
  if (
    ["早上好", "中午好", "晚上好", "晚安", "初次见面", "生日", "生辰"].some((prefix) =>
      title.startsWith(prefix),
    )
  )
    return "问候";
  // 下雨的时候… / 雨过天晴… / 打雷的时候… / 下雪的时候… / 起风的时候… / 在沙漠的时候… / 刮大风了… / 阳光很好… / 晴天的时候… → ...的时候
  if (
    [
      "下雨的时候",
      "雨过天晴",
      "打雷的时候",
      "下雪的时候",
      "起风的时候",
      "在沙漠的时候",
      "刮大风了",
      "阳光很好",
      "晴天的时候",
    ].some((prefix) => title.startsWith(prefix))
  )
    return "...的时候";
  // 关于xxx… / 对xxx… → 关于...
  if (title.startsWith("关于") || title.startsWith("对")) return "关于...";
  // xxx的爱好… / xxx的烦恼… / 喜欢的食物… / 讨厌的食物… / 有什么想要分享… / 感兴趣的见闻… → 兴趣
  if (
    title.includes("的爱好") ||
    title.includes("的烦恼") ||
    title.startsWith("喜欢的食物") ||
    title.startsWith("讨厌的食物") ||
    title.startsWith("有什么想要分享") ||
    title.startsWith("感兴趣的见闻")
  )
    return "兴趣";
  // 其余标题不合并，保持原样输出
  logger.default.warn(`[components][wikiAvatar][convert] 未知分类 ${title}`);
  return undefined;
}

/**
 * 按标题规则合并对话。
 *
 * @since 2.6.0
 * @param raw - 转换后的对话
 * @returns 合并后的对话
 */
function mergeTalks(
  raw: Array<TGACore.Plugins.Hutao.Avatar.Text>,
): Array<TGACore.Components.Character.WikiTalk> {
  const res: Array<TGACore.Components.Character.WikiTalk> = [];
  const groupIndex = new Map<string, number>();
  for (const item of raw) {
    const groupName = getMergeTitle(item.Title) ?? item.Title;
    let index = groupIndex.get(groupName);
    if (index === undefined) {
      index = res.length;
      groupIndex.set(groupName, index);
      res.push({ group: groupName, list: [] });
    }
    const group = res[index];
    if (group !== undefined) {
      group.list.push({ title: item.Title, talk: item.Context });
    }
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
 * @param {TGACore.Plugins.Hutao.Avatar.Constellation} talent 命座数组
 * @returns {Promise<void>}
 */
async function convertTalent(talent: TGACore.Plugins.Hutao.Avatar.Constellation): Promise<void> {
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
