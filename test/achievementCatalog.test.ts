/**
 * 验证成就可选来源合并时保留 v2 格式、分类键和阶段关系。
 * @since 2.7.0
 */

import { readFileSync } from "node:fs";

import { describe, expect, test } from "vitest";

import { buildAchievementCatalog } from "../core/components/achievements/utils.ts";

/**
 * 创建离线成就来源，Snap 与 Nanoka 的展示字段故意不同。
 * @since 2.7.0
 * @returns 可独立修改的来源样例
 */
function createSources(): TGACore.Components.Achievement.CatalogSources {
  return {
    achievements: [
      {
        Id: 100,
        Goal: 0,
        Order: 1,
        Title: "Snap 名称",
        Description: "Snap 描述",
        FinishReward: { Id: 201, Count: 5 },
        IsDeleteWatcherAfterFinish: false,
        Progress: 1,
        Version: "6.9",
      },
    ],
    categories: [{ Id: 0, Order: 0, Name: "天地万象", Icon: "AchievementIcon" }],
    namecards: [
      {
        Id: 210001,
        RankLevel: 4,
        ItemType: "ITEM_NAMECARD",
        Name: "名片",
        Description: "名片描述",
        Icon: "NamecardIcon",
        Pictures: ["", "", ""],
      },
    ],
    yatta: {
      0: {
        id: 0,
        name: "分类",
        order: 0,
        icon: "AchievementIcon",
        achievementList: {},
        finishReward: { 210001: { rank: 4, count: 1, icon: "NamecardIcon" } },
      },
    },
    nanoka: {
      0: {
        id: 0,
        priority: 0,
        name: "分类",
        icon: "AchievementIcon",
        list: [createNanokaItem(100)],
      },
    },
    nanokaVersion: "7.2",
  };
}

/**
 * 创建包含隐藏状态和触发类型的 Nanoka 成就。
 * @since 2.7.0
 * @param id - 成就 ID
 * @returns Nanoka 成就样例
 */
function createNanokaItem(id: number): TGACore.Plugins.Nanoka.Achievement.Detail {
  return {
    id,
    priority: id,
    name: "Nanoka 名称",
    desc: "Nanoka 描述",
    show_type: "HIDDEN",
    param: 1,
    reward: { item_count: 20, item_id: 201 },
    trigger_config: { param_list: [], trigger_type: "FINISH_QUEST" },
  };
}

describe("成就目录兼容性", () => {
  test("保留完整 v2 格式，使用 Snap 基础字段和 Nanoka 补充字段", () => {
    expect(buildAchievementCatalog(createSources())).toEqual({
      schemaVersion: 2,
      gameVersion: "6.9",
      categories: [
        {
          id: 0,
          key: "wonders_of_the_world",
          order: 0,
          name: "天地万象",
          version: "6.9",
          totalReward: 5,
          namecardId: 210001,
          icon: "AchievementIcon",
          achievements: [
            {
              id: 100,
              categoryId: 0,
              order: 1,
              name: "Snap 名称",
              description: "Snap 描述",
              reward: 5,
              version: "6.9",
              hidden: true,
              target: 1,
              trigger: { type: "FINISH_QUEST", tasks: [] },
              partials: [],
            },
          ],
        },
      ],
    });
  });

  test("全部现有分类键与已跟踪产物一致", () => {
    const previous: TGACore.Components.Achievement.AchievementCatalog = JSON.parse(
      readFileSync(new URL("../source/data/out/app/achievements.json", import.meta.url), "utf8"),
    );
    const sources = createSources();
    const base = sources.achievements[0];
    sources.categories = previous.categories.map((category) => ({
      Id: category.id,
      Order: category.order,
      Name: category.name,
      Icon: category.icon,
    }));
    sources.achievements = previous.categories.map((category) => ({
      ...base,
      Id: category.id + 10000,
      Goal: category.id,
    }));
    sources.nanoka = Object.fromEntries(
      previous.categories.map((category) => [
        category.id,
        { ...sources.nanoka[0], id: category.id, list: [createNanokaItem(category.id + 10000)] },
      ]),
    );
    sources.yatta = Object.fromEntries(
      previous.categories.map((category) => [
        category.id,
        { ...sources.yatta[0], id: category.id },
      ]),
    );
    const actual = buildAchievementCatalog(sources);
    expect(actual.categories.map(({ id, key }) => ({ id, key }))).toEqual(
      previous.categories.map(({ id, key }) => ({ id, key })),
    );
  });

  test("新分类使用稳定的编号键，并支持没有名片奖励", () => {
    const sources = createSources();
    sources.categories[0].Id = 99;
    sources.achievements[0].Goal = 99;
    sources.nanoka[0].id = 99;
    sources.yatta[0].id = 99;
    sources.yatta[0].finishReward = null;
    expect(buildAchievementCatalog(sources).categories[0]).toMatchObject({
      id: 99,
      key: "category_99",
      namecardId: null,
    });
  });

  test("补充 Nanoka 独有成就，跨来源补齐三阶段并按点分版本汇总", () => {
    const sources = createSources();
    sources.achievements.push({ ...sources.achievements[0], Id: 101, Order: 2, Version: "6.10" });
    sources.nanoka[0].list = [
      { ...createNanokaItem(102), prev: 101 },
      { ...createNanokaItem(101), prev: 100 },
      createNanokaItem(100),
    ];
    const result = buildAchievementCatalog(sources);
    expect(result.gameVersion).toBe("7.2");
    expect(result.categories[0]).toMatchObject({ version: "7.2", totalReward: 30 });
    expect(result.categories[0].achievements).toMatchObject([
      { id: 100, postStageId: 101 },
      { id: 101, preStageId: 100, postStageId: 102, version: "6.10" },
      { id: 102, preStageId: 101, version: "7.2", name: "Nanoka 名称", reward: 20 },
    ]);
    for (const item of result.categories[0].achievements) {
      expect(item.trigger.tasks).toEqual([]);
      expect(item.partials).toEqual([]);
    }
  });

  test("已有 amos 条目继续提供隐藏状态、任务详情和分步项", () => {
    const sources = createSources();
    sources.amos = [
      {
        id: 100,
        categoryId: 0,
        total: 1,
        hidden: false,
        trigger: {
          type: "FINISH_QUEST",
          tasks: [{ taskId: 10, questId: 20, type: "quest", name: "触发任务" }],
        },
        partials: [{ id: 30, type: "task", name: "分步项" }],
      },
    ];
    // 该条目已由 amos 覆盖，不要求 Nanoka 重复提供它。
    sources.nanoka[0].list = [];
    const achievement = buildAchievementCatalog(sources).categories[0].achievements[0];
    expect(achievement).toMatchObject({
      hidden: false,
      trigger: sources.amos[0].trigger,
      partials: sources.amos[0].partials,
      name: "Snap 名称",
    });
  });

  test("amos 未覆盖的新成就由 Nanoka 补充，阶段链可以连接两个来源", () => {
    const sources = createSources();
    sources.amos = [
      {
        id: 100,
        categoryId: 0,
        total: 1,
        hidden: false,
        postStage: 101,
        trigger: { type: "FINISH_QUEST", tasks: [] },
        partials: [{ id: 30, type: "task", name: "分步项" }],
      },
    ];
    sources.nanoka[0].list.push({ ...createNanokaItem(101), prev: 100 });
    const achievements = buildAchievementCatalog(sources).categories[0].achievements;
    expect(achievements).toMatchObject([
      { id: 100, hidden: false, postStageId: 101, partials: sources.amos[0].partials },
      { id: 101, hidden: true, preStageId: 100, partials: [], trigger: { tasks: [] } },
    ]);
  });

  test("amos 中未出现在当前来源的旧条目不阻塞转换", () => {
    const sources = createSources();
    sources.amos = [
      {
        id: 999,
        categoryId: 999,
        total: 1,
        hidden: false,
        trigger: { type: "FINISH_QUEST", tasks: [] },
        partials: [],
      },
    ];
    expect(buildAchievementCatalog(sources).categories[0].achievements).toHaveLength(1);
  });
});

describe("成就领域约束", () => {
  test("缺少 Nanoka 时不伪造隐藏状态和触发类型", () => {
    const sources = createSources();
    sources.nanoka[0].list = [];
    expect(() => buildAchievementCatalog(sources)).toThrow("成就 100 缺少 amos 或 Nanoka 补充数据");
  });

  test.each(["目标", "分类"])("拒绝来源%s不一致", (field) => {
    const sources = createSources();
    if (field === "目标") sources.nanoka[0].list[0].param = 2;
    else sources.nanoka[0].id = 99;
    expect(() => buildAchievementCatalog(sources)).toThrow(`成就 100 的${field}与补充来源不一致`);
  });

  test.each(["Snap", "Nanoka"])("拒绝 %s 成就 ID 重复", (source) => {
    const sources = createSources();
    if (source === "Snap") sources.achievements.push({ ...sources.achievements[0] });
    else sources.nanoka[0].list.push(createNanokaItem(100));
    expect(() => buildAchievementCatalog(sources)).toThrow(`${source} 成就 ID 100 重复`);
  });

  test("拒绝不存在的前置阶段", () => {
    const sources = createSources();
    sources.nanoka[0].list[0].prev = 999;
    expect(() => buildAchievementCatalog(sources)).toThrow("成就 100 的前置阶段 999 无效");
  });

  test("拒绝一条阶段链分叉", () => {
    const sources = createSources();
    sources.nanoka[0].list.push(
      { ...createNanokaItem(101), prev: 100 },
      { ...createNanokaItem(102), prev: 100 },
    );
    expect(() => buildAchievementCatalog(sources)).toThrow("成就 102 的前置阶段 100 无效");
  });

  test("拒绝阶段链形成环", () => {
    const sources = createSources();
    sources.nanoka[0].list[0].prev = 101;
    sources.nanoka[0].list.push({ ...createNanokaItem(101), prev: 100 });
    expect(() => buildAchievementCatalog(sources)).toThrow("形成环");
  });

  test("保持名片奖励的关联校验", () => {
    const sources = createSources();
    sources.namecards[0].Icon = "OtherIcon";
    expect(() => buildAchievementCatalog(sources)).toThrow("名片图标与 Snap.Metadata 不一致");
  });
});
