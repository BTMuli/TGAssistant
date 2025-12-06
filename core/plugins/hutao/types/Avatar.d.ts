/**
 * @file core/plugins/hutao/types/Avatar.d.ts
 * @description 胡桃角色类型声明文件
 * @since 2.4.0
 */

declare namespace TGACore.Plugins.Hutao.Avatar {
  /**
   * @description 单角色文件类型
   * @since 2.4.0
   * @interface RawAvatar
   * @property {number} Id 角色编号
   * @property {number} PromoteId 角色突破编号
   * @property {number} Sort 角色排序
   * @property {number} Body 角色身体类型
   * @property {string} Icon 角色头像
   * @property {string} SideIcon 角色侧面头像
   * @property {string} Name 角色名称
   * @property {string} Description 角色描述
   * @property {string} BeginTime 角色上线时间
   * @property {number} Quality 角色品质
   * @property {TGACore.Plugins.Hutao.Weapon.WeaponTypeEnum} Weapon 角色武器类型
   * @property {BaseValue} BaseValue 角色基础属性
   * @property {Array<GrowCurve>} GrowCurves 角色成长曲线
   * @property {SkillDepot} SkillDepot 角色技能
   * @property {FetterInfo} FetterInfo 角色好感
   */
  type RawAvatar = {
    Id: number;
    PromoteId: number;
    Sort: number;
    Body: number;
    Icon: string;
    SideIcon: string;
    Name: string;
    Description: string;
    BeginTime: string;
    Quality: number;
    Weapon: TGACore.Plugins.Hutao.Weapon.WeaponTypeEnum;
    BaseValue: BaseValue;
    GrowCurves: Array<GrowCurve>;
    SkillDepot: SkillDepot;
    FetterInfo: FetterInfo;
    Costumes: Array<Costume>;
    CultivationItems: Array<number>;
    NameCard: NameCard;
  };

  /**
   * @description 角色基础属性
   * @since 2.4.0
   * @interface BaseValue
   * @property {number} HpBase 生命值
   * @property {number} AttackBase 攻击力
   * @property {number} DefenseBase 防御力
   */
  type BaseValue = { HpBase: number; AttackBase: number; DefenseBase: number };

  /**
   * @description 角色成长曲线
   * @since 2.4.0
   * @interface GrowCurve
   * @property {number} Type 未知
   * @property {number} Value 未知
   */
  type GrowCurve = { Type: number; Value: number };

  /**
   * @description 角色技能
   * @since 2.4.0
   * @interface SkillDepot
   * @property {number} Arkhe 未知
   * @property {Array<Skill>} Skills 角色技能
   * @property {Skill} EnergySkill 角色元素爆发
   * @property {Array<Skill>} Inherents 角色天赋
   * @property {Array<Talent>} Talents 角色天赋
   */
  type SkillDepot = {
    Arkhe: number;
    Skills: Array<Skill>;
    SpecialSkills?: Array<Skill>;
    EnergySkill: Skill;
    Inherents: Array<Skill>;
    Talents: Array<Talent>;
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
    GroupId: number;
    Proud: Proud;
    Id: number;
    Name: string;
    Description: string;
    Icon: string;
  };

  /**
   * @description 技能参数
   * @since 2.4.0
   * @interface Proud
   * @property {Array<string>} Description 技能描述
   * @property {Array<Parameter>} Parameters 技能参数
   * @return Proud
   */
  type Proud = { Description: Array<string>; Parameters: Array<Parameter> };

  /**
   * @description 技能参数
   * @since 2.4.0
   * @interface Parameter
   * @property {number} Level 技能等级
   * @property {Array<number>} Parameters 技能参数
   * @return Parameter
   */
  type Parameter = { Level: number; Parameters: Array<number> };

  /**
   * @description 角色天赋
   * @since 2.4.0
   * @interface Talent
   * @property {number} Id 天赋编号
   * @property {string} Name 天赋名称
   * @property {string} Description 天赋描述
   * @property {string} Icon 天赋图标
   * @property {TalentExtraLevel} [ExtraLevel] 天赋升级信息
   * @return Talent
   */
  type Talent = {
    Id: number;
    Name: string;
    Description: string;
    Icon: string;
    ExtraLevel?: TalentExtraLevel;
  };

  /**
   * @description 角色天赋升级信息
   * @since 2.4.0
   * @interface TalentExtraLevel
   * @property {number} Index 天赋升级索引
   * @property {number} Level 天赋升级等级
   */
  type TalentExtraLevel = { Index: number; Level: number };

  /**
   * @description 好感信息
   * @since 2.4.0
   * @interface FetterInfo
   * @property {string} Title 角色称号
   * @property {string} Detail 角色简介
   * @property {number} Association 角色地区
   * @property {string} Native 角色地区
   * @property {number} BirthMonth 角色生日-月
   * @property {number} BirthDay 角色生日-日
   * @property {string} VisionBefore 角色元素类型
   * @property {string} VisionAfter 未知
   * @property {string} VisionOverrideUnlocked 未知
   * @property {string} ConstellationBefore 角色星座
   * @property {string} ConstellationAfter 未知
   * @property {string} CvChinese 角色声优-中文
   * @property {string} CvJapanese 角色声优-日文
   * @property {string} CvEnglish 角色声优-英文
   * @property {string} CvKorean 角色声优-韩文
   * @property {CookBonus} CookBonus 角色特殊料理
   * @property {Array<Fetter>} Fetters 角色好感语音
   * @property {Array<Fetter>} FetterStories 角色好感故事
   */
  type FetterInfo = {
    Title: string;
    Detail: string;
    Association: number;
    Native: string;
    BirthMonth: number;
    BirthDay: number;
    VisionBefore: string;
    VisionAfter: string;
    VisionOverrideUnlocked: string;
    ConstellationBefore: string;
    ConstellationAfter: string;
    CvChinese: string;
    CvJapanese: string;
    CvEnglish: string;
    CvKorean: string;
    CookBonus: CookBonus;
    Fetters: Array<Fetter>;
    FetterStories: Array<Fetter>;
  };

  /**
   * @description 角色特殊料理信息
   * @since 2.4.0
   * @interface CookBonus
   * @property {number} OriginItemId 角色特殊料理编号
   * @property {number} ItemId 角色特殊料理编号
   * @property {Array<number>} InputList 角色特殊料理材料
   */
  type CookBonus = { OriginItemId: number; ItemId: number; InputList: Array<number> };

  /**
   * @description 好感项
   * @since 2.4.0
   * @interface Fetter
   * @property {string} Title 语音标题
   * @property {string} Context 语音内容
   */
  type Fetter = { Title: string; Context: string };

  /**
   * @description 皮肤基础数据
   * @since 2.4.0
   * @interface CostumeBase
   * @property {number} Id 皮肤编号
   * @property {string} Name 皮肤名称
   * @property {string} Description 皮肤描述
   */
  type CostumeBase = { Id: number; Name: string; Description: string };
  /**
   * @description 默认皮肤
   * @since 2.4.0
   * @interface CostumeDefault
   * @extends CostumeBase
   * @property {true} IsDefault 是否默认皮肤
   */
  type CostumeDefault = CostumeBase & { IsDefault: true };

  /**
   * @description 非默认皮肤
   * @since 2.4.0
   * @interface CostumeExtra
   * @extends CostumeBase
   * @property {false} IsDefault 是否默认皮肤
   * @property {string} FrontIcon 非默认皮肤头像
   * @property {string} SideIcon 非默认皮肤侧面头像
   */
  type CostumeExtra = CostumeBase & { IsDefault: false; FrontIcon: string; SideIcon: string };

  /**
   * @description 皮肤数据
   * @since 2.4.0
   * @interface Costume
   * @property {number} Id 皮肤编号
   * @property {string} Name 皮肤名称
   * @property {string} Description 皮肤描述
   * @property {boolean} IsDefault 是否默认皮肤
   * @property {string} [FrontIcon] 非默认皮肤头像
   * @property {string} [SideIcon] 非默认皮肤侧面头像
   */
  type Costume = CostumeDefault | CostumeExtra;

  /**
   * @description 角色名片
   * @since 2.4.0
   * @interface NameCard
   * @property {string} Name 名称
   * @property {string} Description 描述
   * @property {string} Icon 图标
   * @property {string} PicturePrefix 前缀
   */
  type NameCard = { Name: string; Description: string; Icon: string; PicturePrefix: string };
}
