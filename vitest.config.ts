/**
 * @file vitest.config.ts
 * @description vitest 配置文件
 * @since 2.0.0
 */

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/*.test.ts"],
  },
});
