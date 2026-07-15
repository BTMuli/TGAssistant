/**
 * 角色类型声明文件。
 *
 * @remarks
 * 对应 `Avatar/[id].json`。
 *
 * @since 2.6.0
 */

declare namespace TGACore.Plugins.Hutao.Avatar {
  /**
   * 角色标签枚举
   *
   * @since 2.6.0
   */
  enum AvatarTagEnum {
    /** 无标签 */
    None,
    /** 魔导 */
    HEXENZIRKEL,
    /** 月兆 */
    MOONPHASE,
  }

  /**
   * 单个角色文件的数据。
   *
   * @since 2.4.0
   */
  type FullInfo = {
    /** 角色 ID。 */
    Id: number;
    /**
     * 突破 ID。
     *
     * @remarks
     * 该数据与 {@link TGACore.Plugins.Hutao.AvatarPromote.FullInfo} 有关。
     */
    PromoteId: number;
    /** 排序值。 */
    Sort: number;
    /**
     * 身体类型。
     *
     * @remarks
     * 该字段为枚举值。
     */
    Body: number;
    /**
     * 头像资源名称。
     *
     * @remarks
     * 对应 `AvatarIcon/` 目录中的资源。
     */
    Icon: string;
    /**
     * 侧面头像资源名称。
     *
     * @remarks
     * 对应 `AvatarIcon/` 目录中的资源。
     */
    SideIcon: string;
    /** 角色名称。 */
    Name: string;
    /** 角色描述。 */
    Description: string;
    /** 上线时间。 */
    BeginTime: string;
    /** 角色星级。 */
    Quality: number;
    /** 武器类型。 */
    Weapon: TGACore.Plugins.Hutao.Weapon.WeaponTypeEnum;
    /** 基础属性。 */
    BaseValue: BaseValue;
    /** 成长曲线。 */
    GrowCurves: Array<TGACore.Plugins.Hutao.Base.Prop>;
    /** 技能信息。 */
    SkillDepot: SkillDepot;
    /** 好感信息。 */
    FetterInfo: FetterInfo;
    /** 衣装列表。 */
    Costumes: Array<Costume>;
    /** 养成材料 ID 列表。 */
    CultivationItems: Array<number>;
    /** 名片信息。 */
    NameCard: NameCard;
    /** 游迹信息。 */
    TraceEffect?: TraceEffect;
    /** 角色标签列表。 */
    Tags?: Array<AvatarTagEnum>;
  };

  /**
   * 角色的基础属性。
   *
   * @since 2.4.0
   */
  type BaseValue = {
    /** 基础生命值。 */
    HpBase: number;
    /** 基础攻击力。 */
    AttackBase: number;
    /** 基础防御力。 */
    DefenseBase: number;
  };

  /**
   * 角色的技能集合。
   *
   * @since 2.6.0
   */
  type SkillDepot = {
    /**
     * 荒芒属性。
     *
     * @remarks
     * `0` 表示不具有荒芒属性，`1` 表示荒性，`2` 表示芒性。
     */
    Arkhe: number;
    /** 普通攻击与元素战技。 */
    Skills: Array<Skill>;
    /**
     * 特殊技能。
     *
     * @example
     * 魔女的前夜礼。
     */
    SpecialSkills?: Array<Skill>;
    /** 元素爆发。 */
    EnergySkill: Skill;
    /** 固有天赋。 */
    Inherents: Array<Skill>;
    /** 命之座。 */
    Talents: Array<Constellation>;
  };

  /**
   * 角色技能。
   *
   * @since 2.6.0
   */
  type Skill = {
    /** 技能组 ID。 */
    GroupId: number;
    /** 技能参数。 */
    Proud: Proud;
    /** 技能 ID。 */
    Id: number;
    /** 技能名称。 */
    Name: string;
    /**
     * 技能描述。
     *
     * @remarks
     * 内容为 HTML 文本。
     */
    Description: string;
    /** 技能加强后的特殊描述。 */
    SpecialDescription?: string;
    /**
     * 技能图标资源名称。
     *
     * @remarks
     * 对应 `Skill/` 目录中的资源。
     */
    Icon: string;
  };

  /**
   * 技能参数信息。
   *
   * @since 2.6.0
   */
  type Proud = {
    /**
     * 参数描述列表。
     *
     * @example
     * ```json
     * [
     *   "一段伤害|{param1:F1P}",
     *   "二段伤害|{param2:F1P}",
     *   "三段伤害|{param3:F1P}",
     *   "四段伤害|{param4:F1P}",
     *   "五段伤害|{param5:F1P}",
     *   "瞄准射击|{param6:F1P}",
     *   "满蓄力瞄准射击|{param7:P}",
     *   "下坠期间伤害|{param8:F1P}",
     *   "低空/高空坠地冲击伤害|{param9:P}/{param10:P}"
     * ]
     * ```
     */
    Descriptions: Array<string>;
    /**
     * 各等级的参数列表。
     *
     * @example
     * ```json
     * [
     *   {
     *     "Id": 213101,
     *     "Level": 1,
     *     "Parameters": [
     *       0.3612,
     *       0.3612,
     *       0.4644,
     *       0.473,
     *       0.5934,
     *       0.4386,
     *       1.24,
     *       0.568288,
     *       1.136335,
     *       1.419344
     *     ]
     *   }
     * ]
     * ```
     */
    Parameters: Array<Parameter>;
    /** 普通参数索引列表。 */
    NormalParameters?: Array<number>;
    /**
     * 展示类型。
     *
     * @remarks
     * 具体用途未知。
     */
    Display?: number;
  };

  /**
   * 单个等级的技能参数。
   *
   * @since 2.4.0
   */
  type Parameter = {
    /** 参数 ID。 */
    Id: number;
    /** 技能等级。 */
    Level: number;
    /** 参数值列表。 */
    Parameters: Array<number>;
  };

  /**
   * 命之座信息。
   *
   * @since 2.6.0
   */
  type Constellation = {
    /** 命之座 ID。 */
    Id: number;
    /** 命之座名称。 */
    Name: string;
    /**
     * 命之座描述。
     *
     * @remarks
     * 内容为 HTML 文本。
     */
    Description: string;
    /** 命之座加强后的特殊描述。 */
    SpecialDescription?: string;
    /**
     * 命之座图标资源名称。
     *
     * @remarks
     * 对应 `Talent/` 目录中的资源。
     */
    Icon: string;
    /** 额外技能等级加成。 */
    ExtraLevel?: ConstExtraLevel;
  };

  /**
   * 命之座提供的额外技能等级加成。
   *
   * @since 2.4.0
   */
  type ConstExtraLevel = {
    /** 技能索引。 */
    Index: number;
    /** 提升的等级。 */
    Level: number;
  };

  /**
   * 角色好感信息。
   *
   * @since 2.4.0
   */
  type FetterInfo = {
    /** 角色称号。 */
    Title: string;
    /**
     * 角色详细描述。
     *
     * @remarks
     * 与 {@link FullInfo.Description} 一致。
     */
    Detail: string;
    /**
     * 所属地区。
     *
     * @remarks
     * 该字段为枚举值。
     */
    Association: number;
    /** 所属阵营。 */
    Native: string;
    /** 生日月份。 */
    BirthMonth: number;
    /** 生日日期。 */
    BirthDay: number;
    /** 神之眼名称。 */
    VisionBefore: string;
    /**
     * 神之眼的替代名称。
     *
     * @remarks
     * 字段存在时优先使用该值。
     */
    VisionAfter?: string;
    /** 神之眼未解锁时的描述。 */
    VisionOverrideLocked?: string;
    /** 神之眼解锁后的描述。 */
    VisionOverrideUnlocked: string;
    /** 命之座名称。 */
    ConstellationBefore: string;
    /**
     * 命之座的替代名称。
     *
     * @remarks
     * 字段存在时优先使用该值。
     */
    ConstellationAfter?: string;
    /** 中文配音演员。 */
    CvChinese: string;
    /** 日文配音演员。 */
    CvJapanese: string;
    /** 英文配音演员。 */
    CvEnglish: string;
    /** 韩文配音演员。 */
    CvKorean: string;
    /** 特殊料理信息。 */
    CookBonus?: CookBonus;
    /** 角色好感语音文本。 */
    Fetters: Array<Text>;
    /** 角色好感故事文本。 */
    FetterStories: Array<Text>;
  };

  /**
   * 角色特殊料理信息。
   *
   * @since 2.4.0
   */
  type CookBonus = {
    /**
     * 原料理 ID。
     *
     * @remarks
     * 参见 {@link TGACore.Plugins.Hutao.MaterialItem}。
     */
    OriginItemId: number;
    /**
     * 特殊料理 ID。
     *
     * @remarks
     * 参见 {@link TGACore.Plugins.Hutao.MaterialItem}。
     */
    ItemId: number;
    /** 料理原料 ID 列表。 */
    InputList: Array<number>;
  };

  /**
   * 带标题的文本内容。
   *
   * @since 2.4.0
   */
  type Text = {
    /** 文本标题。 */
    Title: string;
    /** 文本内容。 */
    Context: string;
  };

  /**
   * 角色衣装。
   *
   * @since 2.4.0
   */
  type Costume = CostumeDefault | CostumeExtra;

  /**
   * 角色衣装的基础数据。
   *
   * @since 2.4.0
   */
  type CostumeBase = {
    /** 衣装 ID。 */
    Id: number;
    /** 衣装名称。 */
    Name: string;
    /** 衣装描述。 */
    Description: string;
  };

  /**
   * 角色的默认衣装。
   *
   * @since 2.4.0
   */
  type CostumeDefault = CostumeBase & {
    /** 是否为默认衣装，固定为 `true`。 */
    IsDefault: true;
  };

  /**
   * 角色的非默认衣装。
   *
   * @since 2.4.0
   */
  type CostumeExtra = CostumeBase & {
    /** 是否为默认衣装，固定为 `false`。 */
    IsDefault: false;
    /**
     * 正面头像资源名称。
     *
     * @remarks
     * 对应 `AvatarIcon/` 目录中的资源。
     */
    FrontIcon: string;
    /**
     * 侧面头像资源名称。
     *
     * @remarks
     * 对应 `AvatarIcon/` 目录中的资源。
     */
    SideIcon: string;
  };

  /**
   * 角色名片信息。
   *
   * @since 2.4.0
   */
  type NameCard = {
    /** 名片名称。 */
    Name: string;
    /** 名片描述。 */
    Description: string;
    /**
     * 名片图标资源名称。
     *
     * @remarks
     * 对应 `NameCardPic/` 目录中的资源。
     */
    Icon: string;
    /** 名片图片资源名称前缀。 */
    PicturePrefix: string;
  };

  /**
   * 角色游迹信息。
   *
   * @since 2.6.0
   */
  type TraceEffect = {
    /** 游迹 ID。 */
    Id: number;
    /** 游迹名称。 */
    Name: string;
    /** 游迹描述。 */
    Description: string;
    /** 游迹图标资源名称。 */
    Icon: string;
  };
}
