/**
 * @file eslint/ymlEslint.js
 * @description Yaml Eslint配置
 * @since 2.4.0
 */
import pluginYml from "eslint-plugin-yml";
import parserYml from "yaml-eslint-parser";

const eslintConfigYml = {
  files: ["**/*.yml", "**/*.yaml"],
  plugins: { yml: pluginYml },
  languageOptions: {
    parser: parserYml,
    parserOptions: { defaultYAMLVersion: "1.2", extraFileExtensions: [".yaml", ".yml"] },
  },
  rules: {
    "yml/indent": ["error", 2],
    "yml/key-spacing": ["error"],
    "yml/quotes": ["error", { prefer: "double", avoidEscape: true }],
    "yml/sort-keys": ["error", "asc"],
  },
};

export default eslintConfigYml;
