import eslint_jsonc from "eslint-plugin-jsonc";
import eslint_jsonc_parser from "jsonc-eslint-parser";

const pkgJsonConfig = {
  files: ["package.json"],
  plugins: {
    jsonc: eslint_jsonc,
  },
  languageOptions: {
    parser: eslint_jsonc_parser,
  },
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

const jsoncConfig = {
  files: ["source/data/out/**/*.json"],
  plugins: {
    jsonc: eslint_jsonc,
  },
  languageOptions: {
    parser: eslint_jsonc_parser,
  },
  rules: {
    "jsonc/comma-dangle": ["error", "never"],
    "jsonc/sort-keys": [
      "error",
      {
        pathPattern: "^$",
        order: {
          type: "asc",
        },
      },
    ],
  },
};

export const jsonEslintConfig = [
  ...eslint_jsonc.configs["flat/recommended-with-json"],
  pkgJsonConfig,
  jsoncConfig,
];
