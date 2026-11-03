/**
 * 验证更新入口的参数、阶段失败和独立领域续跑行为。
 * @since 2.7.0
 */

import { ChildProcess, spawn } from "node:child_process";
import { basename, dirname } from "node:path";

import { beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  readFiles: vi.fn<() => Promise<Array<string>>>(),
  info: vi.fn(),
  error: vi.fn(),
}));
vi.mock("node:child_process", async (importOriginal) => ({
  ...(await importOriginal<typeof import("node:child_process")>()),
  spawn: vi.fn(),
}));
vi.mock("fs-extra", () => ({ default: { readdir: mocks.readFiles } }));
vi.mock("@tools/logger.ts", () => ({
  default: {
    init: vi.fn(),
    console: { info: mocks.info, error: mocks.error, warn: vi.fn() },
    default: { error: mocks.error },
  },
}));

import { runUpdates } from "../scripts/updateAll.ts";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.readFiles.mockResolvedValue(["update.ts", "convert.ts", "download.ts", "utils.ts"]);
  vi.mocked(spawn).mockImplementation(() => {
    const child = new ChildProcess();
    queueMicrotask(() => child.emit("close", 0, null));
    return child;
  });
});

describe("更新入口", () => {
  test.each([["materail"], ["--help"], ["all", "material"], ["material", "weapon"]])(
    "非法参数不启动任务：%j",
    async (...args) => {
      expect(await runUpdates(args)).toBe(1);
      expect(mocks.readFiles).not.toHaveBeenCalled();
      expect(spawn).not.toHaveBeenCalled();
    },
  );

  test("单领域按 download、convert、update 顺序执行且不启动格式化", async () => {
    expect(await runUpdates(["material"])).toBe(0);
    expect(mocks.readFiles).toHaveBeenCalledTimes(1);
    const calls = vi.mocked(spawn).mock.calls;
    expect(calls.map((call) => basename(String(call[1]?.at(-1))))).toEqual([
      "download.ts",
      "convert.ts",
      "update.ts",
    ]);
    expect(calls.every((call) => call[0] === process.execPath)).toBe(true);
    expect(calls[0][1]).toContain("--import=tsx");
    expect(calls[0][2]).toMatchObject({ stdio: "inherit" });
    expect(calls[0][2]?.shell).toBeUndefined();
  });

  test.each([[], ["all"]])("全量入口覆盖全部领域：%j", async (...args) => {
    expect(await runUpdates(args)).toBe(0);
    expect(mocks.readFiles).toHaveBeenCalledTimes(12);
    expect(spawn).toHaveBeenCalledTimes(36);
  });

  test("阶段失败跳过同领域后续步骤，其他领域继续且返回失败", async () => {
    vi.mocked(spawn).mockImplementationOnce(() => {
      const child = new ChildProcess();
      queueMicrotask(() => child.emit("close", 2, null));
      return child;
    });
    expect(await runUpdates(["all"])).toBe(1);
    const scripts = vi.mocked(spawn).mock.calls.map((call) => String(call[1]?.at(-1)));
    expect(scripts.filter((file) => basename(dirname(file)) === "material")).toHaveLength(1);
    expect(scripts.some((file) => basename(dirname(file)) === "wikiRelic")).toBe(true);
    expect(mocks.error).toHaveBeenCalledWith(expect.stringContaining("material/download.ts"));
  });

  test("启动错误返回失败，不等待不存在的退出事件", async () => {
    vi.mocked(spawn).mockImplementationOnce(() => {
      const child = new ChildProcess();
      queueMicrotask(() => child.emit("error", new Error("spawn ENOENT")));
      return child;
    });
    expect(await runUpdates(["material"])).toBe(1);
    expect(spawn).toHaveBeenCalledTimes(1);
  });

  test("目录不可读时记录失败并继续其他领域", async () => {
    mocks.readFiles.mockRejectedValueOnce(new Error("ENOENT"));
    expect(await runUpdates(["all"])).toBe(1);
    expect(mocks.readFiles).toHaveBeenCalledTimes(12);
    expect(spawn).toHaveBeenCalledTimes(33);
  });

  test("同步启动错误也会汇总，后续领域继续执行", async () => {
    vi.mocked(spawn).mockImplementationOnce(() => {
      throw new Error("spawn EINVAL");
    });
    expect(await runUpdates(["all"])).toBe(1);
    expect(mocks.readFiles).toHaveBeenCalledTimes(12);
    expect(spawn).toHaveBeenCalledTimes(34);
  });
});
