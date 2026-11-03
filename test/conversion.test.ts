/**
 * 离线验证材料索引、祈愿匹配、日历归属和业务时区。
 * @since 2.7.0
 */

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { formatUtc8 } from "../core/utils/getDate.ts";

const mocks = vi.hoisted(() => ({
  read: vi.fn<(file: string) => unknown>(),
  readJson: vi.fn<(file: string) => Promise<unknown>>(),
  writeJson: vi.fn(),
}));
vi.mock("@hutao/hutao.ts", () => ({
  default: {
    read: mocks.read,
    check: () => true,
    enum: {
      file: {
        Material: "Material",
        Gacha: "Gacha",
        Avatar: "Avatar/",
        Weapon: "Weapon",
        Meta: "Meta",
      },
      transW: () => "单手剑",
    },
  },
}));
vi.mock("@yatta/yatta.ts", () => ({
  default: { enum: { week: { monday: 1 } }, nation: () => "地区" },
}));
vi.mock("@tools/logger.ts", () => {
  const log = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), mark: vi.fn() };
  return { default: { init: vi.fn(), default: log, console: log } };
});
vi.mock("@tools/counter.ts", () => ({
  default: {
    Init: vi.fn(),
    Reset: vi.fn(),
    addTotal: vi.fn(),
    Success: vi.fn(),
    Fail: vi.fn(),
    End: vi.fn(),
    EndAll: vi.fn(),
    Output: vi.fn(),
    getTime: () => "0",
  },
}));
vi.mock("@utils/fileCheck.ts", () => ({ fileCheckObj: vi.fn(), fileCheck: () => true }));
vi.mock("fs-extra", () => ({
  default: {
    readJson: mocks.readJson,
    readJSON: mocks.readJson,
    writeJson: mocks.writeJson,
    writeJSON: mocks.writeJson,
  },
}));

beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
  mocks.readJson.mockResolvedValue([]);
});
afterEach(() => vi.unstubAllEnvs());

test("材料表读取一次，重复查询保留 ID 顺序并跳过缺失项", async () => {
  mocks.read.mockReturnValue([
    { Id: 1, Name: "甲", RankLevel: 2 },
    { Id: 2, Name: "乙", RankLevel: 3 },
  ]);
  const { default: createMaterialMatcher } = await import("../core/utils/matchMaterials.ts");
  const match = createMaterialMatcher();
  expect(match([2, 1, 2, 99])).toEqual([
    { id: 2, name: "乙", star: 3 },
    { id: 1, name: "甲", star: 2 },
    { id: 2, name: "乙", star: 3 },
  ]);
  expect(match([])).toEqual([]);
  expect(match([1])).toEqual([{ id: 1, name: "甲", star: 2 }]);
  expect(mocks.read).toHaveBeenCalledTimes(1);
});

describe.each(["UTC", "America/New_York"])("业务时区，主机设置为 %s", (timezone) => {
  test.each([
    ["2026-01-01T00:00:00Z", "2026-01-01 08:00:00"],
    ["2026-01-01T08:00:00+08:00", "2026-01-01 08:00:00"],
    ["2026-01-01T08:00:00", "2026-01-01 08:00:00"],
  ])("转换 %s", async (input, expected) => {
    vi.stubEnv("TZ", timezone);
    expect(formatUtc8(input)).toBe(expected);
  });
});

test("祈愿按点分版本排序，最新版本优先匹配帖子", async () => {
  mocks.read.mockReturnValue(
    ["6.10", "6.9.1", "6.9"].map((Version) => ({
      Name: "测试祈愿",
      Version,
      Order: 1,
      Banner: "",
      UpOrangeList: [],
      UpPurpleList: [],
    })),
  );
  mocks.readJson.mockResolvedValue([{ postId: "latest", title: "「测试祈愿」祈愿" }]);
  await import("../core/components/gacha/convert.ts");
  expect(mocks.writeJson).toHaveBeenCalledWith(expect.any(String), [
    expect.objectContaining({ version: "6.9", postId: "" }),
    expect.objectContaining({ version: "6.9.1", postId: "" }),
    expect.objectContaining({ version: "6.10", postId: "latest" }),
  ]);
});

test.each([false, true])("待匹配祈愿为空时正常结束，已有固定匹配：%s", async (hasMatched) => {
  mocks.read.mockReturnValue(
    hasMatched ? [{ Name: "测试祈愿", Version: "6.5", Order: 2, Banner: "" }] : [],
  );
  mocks.readJson.mockResolvedValue([{ postId: "extra", title: "额外帖子" }]);
  await import("../core/components/gacha/convert.ts");
  expect(mocks.writeJson).toHaveBeenCalledWith(
    expect.any(String),
    hasMatched ? [expect.objectContaining({ postId: "74965073" })] : [],
  );
});

test("日历用完整材料 ID 匹配秘境，角色时间按东八区输出", async () => {
  mocks.read.mockImplementation((file) => {
    if (file === "Material") {
      return [
        { Id: 100001, Name: "材料一", RankLevel: 2 },
        { Id: 1000010, Name: "材料二", RankLevel: 3 },
      ];
    }
    if (file === "Weapon") {
      return [{ Id: 11501, Name: "武器", WeaponType: 1, RankLevel: 5, CultivationItems: [100001] }];
    }
    if (file === "Meta") return { "Avatar/1": "hash" };
    return {
      Id: 1,
      Name: "角色",
      CultivationItems: [100001],
      Weapon: 1,
      Quality: 5,
      FetterInfo: { VisionBefore: "风" },
      BeginTime: "2026-01-01T00:00:00Z",
    };
  });
  mocks.readJson.mockImplementation(async (file) => {
    if (file.endsWith("domain.json")) {
      return {
        monday: {
          first: { name: "精通秘境：霜凝祭坛", reward: [100001] },
          second: { name: "精通秘境：炽炎祭场", reward: [1000010] },
        },
        tuesday: {},
        wednesday: {},
        thursday: {},
        friday: {},
        saturday: {},
        sunday: {},
      };
    }
    return [
      { name: "角色", list: [{ title: "角色", content_id: 1 }] },
      { name: "武器", list: [{ title: "武器", content_id: 2 }] },
    ];
  });
  vi.stubEnv("TZ", "America/New_York");
  await import("../core/components/calendar/convert.ts");
  expect(mocks.writeJson).toHaveBeenCalledWith(expect.any(String), [
    expect.objectContaining({
      id: 1,
      release: "2026-01-01 08:00:00",
      source: expect.objectContaining({ name: "霜凝祭坛" }),
    }),
    expect.objectContaining({ id: 11501, source: expect.objectContaining({ name: "霜凝祭坛" }) }),
  ]);
});
