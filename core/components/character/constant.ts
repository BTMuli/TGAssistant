/**
 * 角色组件常量
 * @since 2.5.0
 */

import path from "node:path";

import { getAppDirPath, getProjDataPath } from "@utils/getBasePaths.ts";

export const imgDir = getAppDirPath("assets", "character");
export const jsonDir = getAppDirPath("data", "character");

export const jsonDetailDir = {
  yatta: path.join(jsonDir.src, "yatta.json"),
  mys: path.join(jsonDir.src, "mys.json"),
  out: path.join(jsonDir.out, "app", "character.json"),
  namecard: path.join(jsonDir.out, "app", "namecard.json"),
  hakushi: path.join(jsonDir.src, "hakushi.json"),
};
export const imgCostumeDir = {
  src: path.join(getProjDataPath("assets"), "src", "costume"),
  out: path.join(getProjDataPath("assets"), "out", "costume"),
};

export const LumineCostumes: Array<TGACore.Plugins.Hutao.Avatar.Costume> = [
  {
    Id: 200701,
    Name: "复地重天",
    Description:
      "旅行者的装扮款式。陪伴双「星」遍访无数世界的衣服。它已然见过无数的世界，但还是不明白宇宙的目的究竟为何。但只要思考，总会得到那个「最后的答案」。",
    FrontIcon: "UI_AvatarIcon_PlayerGirlCostumeCWXR",
    SideIcon: "UI_AvatarIcon_Side_PlayerGirlCostumeCWXR",
    IsDefault: false,
  },
  {
    Id: 200700,
    Name: "初升之星",
    Description: "旅行者的装扮款式。陪伴旅人走过漫漫长路的实用衣装。",
    IsDefault: true,
  },
];
export const AetherCostumes: Array<TGACore.Plugins.Hutao.Avatar.Costume> = [
  {
    Id: 200501,
    Name: "复地重天",
    Description:
      "旅行者的装扮款式。陪伴双「星」遍访无数世界的衣服。它已然见过无数的世界，但还是不明白宇宙的目的究竟为何。但只要思考，总会得到那个「最后的答案」。",
    FrontIcon: "UI_AvatarIcon_PlayerBoyCostumeCWXR",
    SideIcon: "UI_AvatarIcon_Side_PlayerBoyCostumeCWXR",
    IsDefault: false,
  },
  {
    Id: 200500,
    Name: "初升之星",
    Description: "旅行者的装扮款式。陪伴旅人走过漫漫长路的实用衣装。",
    IsDefault: true,
  },
];
