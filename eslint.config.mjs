/**
 * @file eslint.config.mjs
 * @description Eslint配置文件
 * @since 2.4.0
 */
import eslintPluginJsonc from "eslint-plugin-jsonc";
import eslintPluginJs from "@eslint/js";
import eslintPluginTs from "typescript-eslint";

import eslintConfigJson from "./eslint/jsonEslint.js";
import eslintConfigYml from "./eslint/ymlEslint.js";
import eslintConfigTs from "./eslint/tsEslint.js";

export default [
  eslintPluginJs.configs.recommended,
  ...eslintPluginJsonc.configs["flat/recommended-with-jsonc"],
  ...eslintPluginTs.configs.recommended,
  ...eslintConfigJson,
  eslintConfigYml,
  eslintConfigTs,
  {
    ignores: [
      ".github",
      "node_modules",
      "logs",
      "source/assets",
      "source/temp",
      "source/data/http",
      "source/data/src",
      "web/**/*.js",
      "core/archive/birthday/*.json",
      "pnpm-lock.yaml",
      "qodana.yaml",
      "repos",
    ],
  },
];
