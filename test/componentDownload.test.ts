/**
 * 离线验证下载入口的 Metadata 准备顺序和武器缓存行为。
 * @since 2.7.0
 */

import { beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  sync: vi.fn<() => Promise<Record<string, string>>>(),
  update: vi.fn<() => Promise<boolean>>(),
  read: vi.fn<(file: string) => unknown>(),
  readIds: vi.fn<() => Array<string>>(),
  fetchJson: vi.fn(),
  writeJson: vi.fn(),
  exists: vi.fn(),
  readJson: vi.fn(),
}));
vi.mock("@hutao/hutao.ts", () => ({
  default: {
    sync: mocks.sync,
    update: mocks.update,
    read: mocks.read,
    readIds: mocks.readIds,
    enum: {
      file: {
        Meta: "Meta.json",
        Material: "Material.json",
        Avatar: "Avatar/",
        Weapon: "Weapon.json",
        WeaponPromote: "WeaponPromote.json",
        WeaponCurve: "WeaponCurve.json",
      },
    },
  },
}));
vi.mock("@yatta/yatta.ts", () => ({ default: { fetchJson: mocks.fetchJson } }));
vi.mock("@nanoka/nanoka.ts", () => ({ default: {} }));
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
    Skip: vi.fn(),
    Fail: vi.fn(),
    End: vi.fn(),
    EndAll: vi.fn(),
    Output: vi.fn(),
    getTime: () => "0",
  },
}));
vi.mock("@utils/fileCheck.ts", () => ({ fileCheckObj: vi.fn(), fileCheck: () => false }));
vi.mock("../core/components/material/utils.ts", () => ({}));
vi.mock("sharp", () => ({ default: vi.fn() }));
vi.mock("fs-extra", () => ({
  default: {
    writeJson: mocks.writeJson,
    writeJSON: mocks.writeJson,
    existsSync: mocks.exists,
    readJsonSync: mocks.readJson,
  },
}));

beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
  mocks.sync.mockResolvedValue({ "Material": "new", "Avatar/10000001": "new" });
  mocks.update.mockResolvedValue(false);
  mocks.read.mockReturnValue([]);
  mocks.readIds.mockReturnValue(["10000001"]);
  mocks.fetchJson.mockResolvedValue({ response: 200, data: { items: {} } });
});

describe("材料输入准备", () => {
  test("单独运行时先同步材料和角色，再获取可选来源", async () => {
    await import("../core/components/material/download.ts");
    expect(mocks.update.mock.calls).toEqual([
      [await mocks.sync.mock.results[0].value, "Material.json"],
      [await mocks.sync.mock.results[0].value, "Avatar/", "10000001"],
    ]);
    expect(mocks.update.mock.invocationCallOrder[1]).toBeLessThan(
      mocks.fetchJson.mock.invocationCallOrder[0],
    );
  });

  test("必需材料读取失败时停止，不启动可选来源请求", async () => {
    mocks.update.mockRejectedValueOnce(new Error("Metadata unavailable"));
    mocks.read.mockImplementation(() => {
      throw new Error("ENOENT Material.json");
    });
    await expect(import("../core/components/material/download.ts")).rejects.toThrow(
      "ENOENT Material.json",
    );
    expect(mocks.fetchJson).not.toHaveBeenCalled();
  });

  test("索引同步失败时使用已有 Metadata 缓存", async () => {
    mocks.sync.mockRejectedValueOnce(new Error("Metadata unavailable"));
    mocks.read.mockImplementation((file) => (file === "Meta.json" ? { Material: "old" } : []));
    await import("../core/components/material/download.ts");
    expect(mocks.update).toHaveBeenCalledWith({ Material: "old" }, "Material.json");
    expect(mocks.fetchJson).toHaveBeenCalled();
  });
});

describe("武器 Wiki 缓存", () => {
  test("缓存命中不请求详情和故事，仍汇总已有数据", async () => {
    const cached = { id: 11501, story: ["cached story"] };
    mocks.read.mockReturnValue([{ Id: 11501, Name: "测试武器" }]);
    mocks.exists.mockReturnValue(true);
    mocks.readJson.mockReturnValue(cached);
    await import("../core/components/wikiWeapon/download.ts");
    expect(mocks.fetchJson).not.toHaveBeenCalled();
    expect(mocks.writeJson).toHaveBeenCalledWith(expect.any(String), [cached], { spaces: 2 });
  });

  test("缓存缺失时下载详情和故事并汇总", async () => {
    mocks.read.mockReturnValue([{ Id: 11501, Name: "测试武器" }]);
    mocks.exists.mockReturnValueOnce(false).mockReturnValue(true);
    mocks.fetchJson
      .mockResolvedValueOnce({ response: 200, data: { id: 11501, storyId: ["123"] } })
      .mockResolvedValueOnce({ response: 200, data: "downloaded story" });
    const downloaded = { id: 11501, storyId: ["123"], story: ["downloaded story"] };
    mocks.readJson.mockReturnValue(downloaded);
    await import("../core/components/wikiWeapon/download.ts");
    expect(mocks.fetchJson.mock.calls).toEqual([["CHS/weapon/11501"], ["CHS/readable/Weapon123"]]);
    expect(mocks.writeJson).toHaveBeenCalledWith(expect.any(String), downloaded);
    expect(mocks.writeJson).toHaveBeenCalledWith(expect.any(String), [downloaded], { spaces: 2 });
  });
});
