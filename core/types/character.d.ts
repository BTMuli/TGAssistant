/**
 * 角色数据类型定义。
 *
 * @since 2.6.0
 */

declare namespace TGACore.Components.Character {
  /**
   * 应用使用的角色数据。
   *
   * @remarks
   * 对应 `App/character.json`。
   *
   * @since 2.6.0
   */
  type Character = {
    /** 角色 ID。 */
    id: number;
    /** 观测枢内容 ID。 */
    contentId: number;
    /** 角色名称。 */
    name: string;
    /** 角色称号。 */
    title: string;
    /** 角色所属地区。 */
    area: string;
    /** 队伍强化标签列表。 */
    team: Array<number>;
    /** 角色生日，依次为月份和日期。 */
    birthday: [number, number];
    /** 角色星级。 */
    star: number;
    /** 角色元素类型。 */
    element: string;
    /** 角色上线时间。 */
    release: string;
    /** 角色武器类型。 */
    weapon: string;
    /** 角色名片资源名称。 */
    nameCard: string;
    /** 角色衣装列表。 */
    costumes: Array<Costume>;
  };

  /**
   * 角色衣装的简要数据。
   *
   * @since 2.5.0
   */
  type Costume = {
    /** 衣装 ID。 */
    id: number;
    /** 是否为默认衣装。 */
    isDefault: boolean;
    /** 衣装名称。 */
    name: string;
    /** 衣装描述。 */
    desc: string;
  };

  /**
   * 角色 Wiki 数据。
   *
   * @remarks
   * 对应 `WIKI/character/[id].json`。
   *
   * @since 2.6.0
   */
  type Wiki = {
    /** 角色 ID。 */
    id: number;
    /** 角色名称。 */
    name: string;
    /** 角色称号。 */
    title: string;
    /** 角色简介。 */
    description: string;
    /** 角色所属地区。 */
    area: string;
    /** 队伍强化标签列表。 */
    team: Array<number>;
    /** 角色简介信息。 */
    brief: WikiBrief;
    /** 角色星级。 */
    star: number;
    /** 元素描述。 */
    elePrefix: string;
    /** 元素类型。 */
    element: string;
    /** 角色武器类型。 */
    weapon: string;
    /** 角色培养材料列表。 */
    materials: Array<TGACore.Components.Calendar.Material>;
    /** 角色技能列表。 */
    skills: Array<WikiSkill>;
    /** 角色命之座列表。 */
    constellation: Array<TGACore.Plugins.Hutao.Avatar.Constellation>;
    /** 角色闲聊文本。 */
    talks: Array<TGACore.Plugins.Hutao.Avatar.Text>;
    /** 角色故事文本。 */
    stories: Array<TGACore.Plugins.Hutao.Avatar.Text>;
  };

  /**
   * 角色 Wiki 的技能数据。
   *
   * @since 2.6.0
   */
  type WikiSkill = {
    /** 技能组 ID。 */
    group: number;
    /** 技能 ID。 */
    id: number;
    /** 技能名称。 */
    name: string;
    /** 技能描述。 */
    desc: string;
    /** 加强后的特殊描述 */
    descSp?: string;
    /** 技能图标资源名称。 */
    icon: string;
    /**
     * 技能等级上限。
     *
     * @remarks
     * 元数据中 `Proud.Parameters` 仅有一项时为 `1`，否则为 `10`。
     */
    maxLv: number;
    /**
     * 技能等级提高 3 级所需的命之座层数。
     *
     * @remarks
     * 没有对应命之座加成时为 `null`。
     */
    luc: number | null;
  };

  /**
   * 角色 Wiki 的简介数据。
   *
   * @since 2.4.0
   */
  type WikiBrief = {
    /** 角色所属阵营。 */
    camp: string;
    /** 命之座名称。 */
    constellation: string;
    /** 角色生日。 */
    birth: string;
    /** 角色配音演员。 */
    cv: WikiCv;
  };

  /**
   * 角色配音演员信息。
   *
   * @since 2.4.0
   */
  type WikiCv = {
    /** 中文配音演员。 */
    cn: string;
    /** 日文配音演员。 */
    jp: string;
    /** 英文配音演员。 */
    en: string;
    /** 韩文配音演员。 */
    kr: string;
  };
}
