/** Nanoka 原神角色详情数据类型。 */

declare namespace TGACore.Plugins.Nanoka.Character {
  /** character/[id].json 返回的角色详情。 */
  type Detail = {
    name: string;
    desc: string;
    chara_info: Info;
    weapon: string;
    rarity: string;
    element: string;
    icon: string;
    stamina_recovery: number;
    base_hp: number;
    base_atk: number;
    base_def: number;
    crit_rate: number;
    crit_dmg: number;
    elemental_mastery: number;
    level_exp: number[];
    stats_modifier: StatsModifier;
    skills: Skill[];
    passives: Passive[];
    constellations: Constellation[];
    materials: Materials;
    attack: Attack[];
    energy: Energy[];
  };

  type Info = {
    release_date: string;
    birth: [number, number];
    vision: string;
    vision_special_type_before: string;
    vision_special_type_after: string;
    constellation: string;
    region: string;
    title: string;
    native: string;
    detail: string;
    va: Record<"chinese" | "japanese" | "english" | "korean", string>;
    stories: { title: string; text: string; unlock: string[] }[];
    quotes: { title: string; text: string; unlocked: string[] }[];
    special_food: Partial<SpecialFood>;
    namecard: Partial<Namecard>;
    costume: Costume[];
    trace_effect: TraceEffect[];
  };

  /** 角色 Wiki 转换所需的故事和语音解锁条件。 */
  type UnlockInfo = Pick<Info, "stories" | "quotes">;

  type SpecialFood = { id: number; recipe: number; name: string; icon: string; rank: number };
  type Namecard = { id: number; name: string; desc: string; icon: string };
  type Costume = { id: number; name: string; desc: string; icon: string; quality: number };
  type TraceEffect = { id: number; name: string; desc: string; icon: string };

  type StatsModifier = {
    hp: Record<string, number>;
    atk: Record<string, number>;
    def: Record<string, number>;
    ascension: Record<string, number>[];
    prop_grow_curves: { grow_curve: string; type: string }[];
    recommended_props: unknown[];
  };

  type Skill = {
    id: number;
    name: string;
    desc: string;
    promote: Record<string, { level: number; icon: string; desc: string[]; param: number[] }>;
  };
  type Passive = {
    id: number;
    name: string;
    desc: string;
    icon: string;
    unlock: number;
    param_list: number[];
  };
  type Constellation = {
    id: number;
    name: string;
    desc: string;
    icon: string;
    param_list: number[];
  };

  type Material = { name: string; id: number; count: number; rank: number };
  type MaterialStage = { mats: Material[]; cost: number };
  type Materials = { ascensions: MaterialStage[]; talents: MaterialStage[][] };

  type Attack = {
    name: string;
    icd: { tag: string | null; group: string };
    gauge: number | null;
    poise: { level: string; value: number };
    element: string;
    attack_type: string;
    strike_type: string;
    damage_param: string;
  };
  type Energy = {
    name: string;
    skill: string;
    kind: string;
    element: string;
    per_drop: number;
    lifetime: number;
    chance: number;
    cd: number;
    applications: number;
    drop_id: number;
  };
}
