/**
 * @file eslint/jsonEslint.js
 * @description JSON Eslint配置
 * @since 2.4.0
 */

import pluginJsonc from "eslint-plugin-jsonc";
import parserJsonc from "jsonc-eslint-parser";

const pkgJsonConfig = {
  files: ["package.json"],
  plugins: { jsonc: pluginJsonc },
  languageOptions: { parser: parserJsonc },
  rules: {
    "jsonc/comma-dangle": ["error", "never"],
    "jsonc/sort-keys": [
      "error",
      {
        pathPattern: "^$",
        order: [
          "name",
          "version",
          "description",
          "type",
          "packageManager",
          "scripts",
          "engine",
          "lint-staged",
          "keywords",
          "author",
          "license",
          "respository",
          "homepage",
          "bugs",
          "dependencies",
          "devDependencies",
        ],
      },
    ],
  },
};

const tscJsonConfig = {
  files: ["tsconfig.json"],
  plugins: { jsonc: pluginJsonc },
  languageOptions: { parser: parserJsonc },
  rules: {
    "jsonc/comma-dangle": ["error", "never"],
    "jsonc/sort-keys": [
      "error",
      {
        pathPattern: "^$",
        order: [
          "compilerOptions",
          "include",
          "exclude",
          "extends",
          "files",
          "references",
          "typeAcquisition",
        ],
      },
    ],
  },
};

const jsoncConfig = {
  files: ["source/data/out/**/*.json", "core/**/*.json"],
  plugins: { jsonc: pluginJsonc },
  languageOptions: { parser: parserJsonc },
  rules: {
    "jsonc/comma-dangle": ["error", "never"],
    "jsonc/sort-keys": ["error", { pathPattern: "^$", order: { type: "asc" } }],
  },
};

const eslintConfigJson = [pkgJsonConfig, tscJsonConfig, jsoncConfig];

export default eslintConfigJson;
