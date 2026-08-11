/**
 * JSON 文件的 Eslint 配置
 * @since 2.6.0
 */

import pluginJsonc from "eslint-plugin-jsonc";
import * as parserJsonc from "jsonc-eslint-parser";

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

const characterJsonConfig = {
  files: ["source/data/out/WIKI/character/**/*.json"],
  plugins: { jsonc: pluginJsonc },
  languageOptions: { parser: parserJsonc },
  rules: {
    "jsonc/comma-dangle": ["error", "never"],
    "jsonc/sort-keys": [
      "error",
      {
        pathPattern: "^$",
        order: [
          "id",
          "name",
          "title",
          "description",
          "area",
          "brief",
          "star",
          "elePrefix",
          "element",
          "weapon",
          "materials",
          "constellation",
          "skills",
          "food",
          "talks",
          "stories",
          "team",
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
    "no-irregular-whitespace": "warn",
    "jsonc/comma-dangle": ["error", "never"],
    "jsonc/sort-keys": ["error", { pathPattern: "^$", order: { type: "asc" } }],
  },
};

const eslintConfigJson = [pkgJsonConfig, tscJsonConfig, jsoncConfig, characterJsonConfig];

export default eslintConfigJson;
