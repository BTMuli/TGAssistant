/**
 * 角色类型声明文件
 * @remarks Avatar/[id].json
 * @since 2.4.0
 */

declare namespace TGACore.Plugins.Hutao.Avatar {
  /**
   * 单角色文件类型
   *
   * @since 2.4.0
   */
  type FullInfo = {
    /** ID */
    Id: number;
    /**
     * 突破 ID
     * @remarks 该数据与 {@link TGACore.Plugins.Hutao.AvatarPromote.FullInfo} 有关
     */
    PromoteId: number;
    /** 排序 */
    Sort: number;
    /**
     * 身体类型
     * @remarks 枚举值
     */
    Body: number;
    /**
     * 头像
     * @remarks AvatarIcon/
     */
    Icon: string;
    /**
     * 侧面头像
     * @remarks AvatarIcon/
     */
    SideIcon: string;
    /** 姓名 */
    Name: string;
    /** 描述 */
    Description: string;
    /** 上线时间 */
    BeginTime: string;
    /** 星级 */
    Quality: number;
    /** 武器类型 */
    Weapon: TGACore.Plugins.Hutao.Weapon.WeaponTypeEnum;
    /** 基础属性 */
    BaseValue: BaseValue;
    /** 成长曲线 */
    GrowCurves: Array<TGACore.Plugins.Hutao.Base.Prop>;
    /** 技能 */
    SkillDepot: SkillDepot;
    /** 好感信息 */
    FetterInfo: FetterInfo;
    /** 衣装 */
    Costumes: Array<Costume>;
    /** 养成材料 ID 列表 */
    CultivationItems: Array<number>;
    /** 名片信息 */
    NameCard: NameCard;
  };

  /**
   * 基础属性
   * @since 2.4.0
   */
  type BaseValue = {
    /** 生命值 */
    HpBase: number;
    /** 攻击力 */
    AttackBase: number;
    /** 防御力 */
    DefenseBase: number;
  };

  /**
   * @description 角色技能
   * @since 2.4.0
   * @interface SkillDepot
   * @property {number} Arkhe 未知
   * @property {Array<Skill>} Skills 角色技能
   * @property {Skill} EnergySkill 角色元素爆发
   * @property {Array<Skill>} Inherents 角色天赋
   * @property {Array<Constellation>} Talents 角色天赋
   */
  type SkillDepot = {
    /**
     * 荒芒属性
     * @example
     * 0 - 不具有
     * 1 - 荒
     * 2 - 芒
     */
    Arkhe: number;
    /** 普通攻击&元素技能 */
    Skills: Array<Skill>;
    /**
     * 特殊技能
     * @example 魔女的前夜礼
     */
    SpecialSkills?: Array<Skill>;
    /** 元素爆发 */
    EnergySkill: Skill;
    /** 天赋 */
    Inherents: Array<Skill>;
    /** 命座 */
    Talents: Array<Constellation>;
  };

  /**
   * @description 技能
   * @since 2.0.0
   * @interface Skill
   * @property {number} GroupId 技能组编号
   * @property {Proud} Proud 技能参数
   * @property {number} Id 技能编号
   * @property {string} Name 技能名称
   * @property {string} Description 技能描述
   * @property {string} Icon 技能图标
   */
  type Skill = {
    /** Group ID */
    GroupId: number;
    /** 参数 */
    Proud: Proud;
    /** ID */
    Id: number;
    /** 名称 */
    Name: string;
    /**
     * 描述
     * @remarks htmlText
     */
    Description: string;
    /**
     * 图标
     * @remarks Skill/
     */
    Icon: string;
  };

  /**
   * 技能参数
   * @since 2.4.0
   */
  type Proud = {
    /**
     * 描述列表
     * @example
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
     */
    Description: Array<string>;
    /**
     * 参数
     * @example
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
     *   },
     * ]
     */
    Parameters: Array<Parameter>;
    /**
     * 展示
     * @remarks 未知用途
     */
    Display?: number;
  };

  /**
   * 技能参数
   * @since 2.4.0
   */
  type Parameter = {
    /** ID */
    Id: number;
    /** 等级 */
    Level: number;
    /** 参数 */
    Parameters: Array<number>;
  };

  /**
   * 命之座
   * @since 2.4.0
   */
  type Constellation = {
    /** ID */
    Id: number;
    /** 名称 */
    Name: string;
    /**
     * 描述
     * @remarks htmlText
     */
    Description: string;
    /**
     * 图标
     * @remarks Talent/
     */
    Icon: string;
    /** 额外等级加成 */
    ExtraLevel?: ConstExtraLevel;
  };

  /**
   * 命座提供天赋加成
   * @since 2.4.0
   */
  type ConstExtraLevel = {
    /** 索引 */
    Index: number;
    /** 提升等级 */
    Level: number;
  };

  /**
   * 好感信息
   * @since 2.4.0
   */
  type FetterInfo = {
    /** 称号 */
    Title: string;
    /**
     * 描述
     * @remarks 与 {@link FullInfo.Description} 一致
     */
    Detail: string;
    /**
     * 地区
     * @remarks 枚举值
     */
    Association: number;
    /** 阵营 */
    Native: string;
    /** 生日-月 */
    BirthMonth: number;
    /** 生日-日 */
    BirthDay: number;
    /** 神之眼 */
    VisionBefore: string;
    /**
     * 神之眼-后
     * @remarks 存在时使用此字段
     */
    VisionAfter?: string;
    /** 神之眼描述（未解锁） */
    VisionOverrideLocked?: string;
    /** 神之眼描述 */
    VisionOverrideUnlocked: string;
    /** 命之座 */
    ConstellationBefore: string;
    /**
     * 命之座
     * @remarks 存在时使用此字段
     */
    ConstellationAfter?: string;
    /** 角色声优-中文 */
    CvChinese: string;
    /** 角色声优-日文 */
    CvJapanese: string;
    /** 角色声优-英文 */
    CvEnglish: string;
    /** 角色声优-韩文 */
    CvKorean: string;
    /** 特殊料理 */
    CookBonus?: CookBonus;
    /** 角色好感语音 */
    Fetters: Array<Text>;
    /** 角色好感故事 */
    FetterStories: Array<Text>;
  };

  /**
   * 特殊料理
   * @since 2.4.0
   */
  type CookBonus = {
    /**
     * 原料理 ID
     * @remarks 见 {@link TGACore.Plugins.Hutao.MaterialItem}
     */
    OriginItemId: number;
    /**
     * 特殊料理 ID
     * @remarks 见 {@link TGACore.Plugins.Hutao.MaterialItem}
     */
    ItemId: number;
    /** 原料 ID 列表 */
    InputList: Array<number>;
  };

  /**
   * 文本
   * @since 2.4.0
   */
  type Text = {
    /** 标题 */
    Title: string;
    /** 内容 */
    Context: string;
  };

  /**
   * 皮肤
   * @since 2.4.0
   */
  type Costume = CostumeDefault | CostumeExtra;

  /**
   * 皮肤基础数据
   * @since 2.4.0
   */
  type CostumeBase = {
    /** ID */
    Id: number;
    /** 名称 */
    Name: string;
    /** 描述 */
    Description: string;
  };

  /**
   * 默认皮肤
   * @since 2.4.0
   */
  type CostumeDefault = CostumeBase & {
    /** 是默认皮肤 */
    IsDefault: true;
  };

  /**
   * 非默认皮肤
   * @since 2.4.0
   */
  type CostumeExtra = CostumeBase & {
    /** 不是默认皮肤 */
    IsDefault: false;
    /**
     * 图标
     * @remarks AvatarIcon/
     */
    FrontIcon: string;
    /**
     * 侧边图标
     * @remarks AvatarIcon/
     */
    SideIcon: string;
  };

  /**
   * 角色名片
   * @since 2.4.0
   */
  type NameCard = {
    /** 名称 */
    Name: string;
    /** 描述 */
    Description: string;
    /**
     * 图标
     * @remarks NameCardPic
     */
    Icon: string;
    /** 前缀 */
    PicturePrefix: string;
  };
}
