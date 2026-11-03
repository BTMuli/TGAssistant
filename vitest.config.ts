/**
 * 配置默认离线测试及 TypeScript 路径别名。
 * @since 2.7.0
 */

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: { include: ["test/*.test.ts"] },
});
