/**
 * 角色类型定义
 * @since 2.5.0
 */

declare namespace TGACore.Components.Character {
  /**
   * 转换后的数据
   * @since 2.4.0
   * @remarks App/character.json
   */
  type Character = {
    /** 角色编号 */
    id: number;
    /** 观测枢 contentId */
    contentId: number;
    /** 角色名称 */
    name: string;
    /** 角色称号 */
    title: string;
    /** 角色地区 */
    area: string;
    /** 角色生日 */
    birthday: [number, number];
    /** 角色星级 */
    star: number;
    /** 角色元素类型 */
    element: string;
    /** 角色上线时间 */
    release: string;
    /** 角色武器类型 */
    weapon: string;
    /** 角色名片 */
    nameCard: string;
  };

  /**
   * wiki 数据
   * @since 2.0.0
   * @remarks WIKI/character/[id].json
   */
  type Wiki = {
    /** 角色编号 */
    id: number;
    /** 角色名称 */
    name: string;
    /** 角色称号 */
    title: string;
    /** 角色简介 */
    description: string;
    /** 角色地区 */
    area: string;
    /** 角色简介信息 */
    brief: WikiBrief;
    /** 角色星级 */
    star: number;
    /** 角色元素类型 */
    element: string;
    /** 角色武器类型 */
    weapon: string;
    /** 角色培养材料 */
    materials: Array<TGACore.Components.Calendar.Material>;
    /** 角色技能 */
    skills: Array<WikiSkill>;
    /** 角色命座 */
    constellation: Array<TGACore.Plugins.Hutao.Avatar.Constellation>;
    /** 闲聊 */
    talks: Array<TGACore.Plugins.Hutao.Avatar.Text>;
    /** 故事 */
    stories: Array<TGACore.Plugins.Hutao.Avatar.Text>;
  };

  /**
   * wiki技能
   * @since 2.5.0
   */
  type WikiSkill = Omit<TGACore.Plugins.Hutao.Avatar.Skill, "Proud">;

  /**
   * wiki简介
   * @since 2.4.0
   */
  type WikiBrief = {
    /** 阵营 */
    camp: string;
    /** 命之座 */
    constellation: string;
    /** 角色生日 */
    birth: string;
    /** 角色声优 */
    cv: WikiCv;
  };

  /**
   * 声优
   * @since 2.4.0
   */
  type WikiCv = {
    /** 角色声优-中文 */
    cn: string;
    /** 角色声优-日文 */
    jp: string;
    /** 角色声优-英文 */
    en: string;
    /** 角色声优-韩文 */
    kr: string;
  };
}
