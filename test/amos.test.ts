/**
 * 验证 amos 可选包的缺失回退和已有成就信息解析。
 * @since 2.7.0
 */

import { beforeEach, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  resolve: vi.fn<(specifier: string) => string>(),
  readJson: vi.fn<(file: string) => unknown>(),
  warn: vi.fn(),
}));
vi.mock("node:module", () => ({ createRequire: () => ({ resolve: mocks.resolve }) }));
vi.mock("fs-extra", () => ({ default: { readJsonSync: mocks.readJson } }));
vi.mock("@tools/logger.ts", () => ({ default: { default: { warn: mocks.warn } } }));

beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
  mocks.resolve.mockImplementation((specifier) => specifier);
  mocks.readJson.mockImplementation((file) => {
    if (file.endsWith("index.json")) {
      return [
        {
          id: 0,
          key: "wonders_of_the_world",
          achievements: [
            {
              id: 100,
              categoryId: 0,
              total: 1,
              hidden: false,
              trigger: {
                type: "FINISH_QUEST",
                task: [{ taskId: 10, questId: 20, type: "quest", name: 123 }],
              },
            },
          ],
        },
      ];
    }
    if (file.endsWith("partial.json")) return { 100: [{ id: 30, type: "task", name: [124] }] };
    return { 123: "触发任务", 124: "分步项" };
  });
});

test("未安装 amos-data 时可以加载插件并返回空补充列表", async () => {
  mocks.resolve.mockImplementation(() => {
    throw Object.assign(new Error("Cannot find module"), { code: "MODULE_NOT_FOUND" });
  });
  const { default: amosTool } = await import("../core/plugins/amos/amos.ts");
  expect(amosTool.supplement()).toEqual([]);
  expect(mocks.readJson).not.toHaveBeenCalled();
});

test("可选数据文件缺失时由其他来源补充", async () => {
  mocks.readJson.mockImplementation(() => {
    throw Object.assign(new Error("Missing data file"), { code: "ENOENT" });
  });
  const { default: amosTool } = await import("../core/plugins/amos/amos.ts");
  expect(amosTool.supplement()).toEqual([]);
});

test("已安装时继续解析已有任务和分步项", async () => {
  const { default: amosTool } = await import("../core/plugins/amos/amos.ts");
  expect(amosTool.supplement()).toMatchObject([
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
  ]);
});

test("格式损坏的数据保留明确错误，不误判为未安装", async () => {
  mocks.readJson.mockImplementation(() => {
    throw new SyntaxError("Invalid JSON");
  });
  await expect(import("../core/plugins/amos/amos.ts")).rejects.toThrow("Invalid JSON");
});
