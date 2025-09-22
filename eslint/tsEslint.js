/**
 * @file eslint/tsEslint.js
 * @description TypeScript Eslint配置
 * @since 2.4.0
 */
import pluginImport from "eslint-plugin-import";
import pluginPrettier from "eslint-plugin-prettier";
import eslintTs from "typescript-eslint";
import appRootPath from "app-root-path";

const eslintConfigTs = {
  files: ["*.ts", "*.d.ts", "**/*.ts", "**/*.d.ts"],
  plugins: { typescript: eslintTs, import: pluginImport, prettier: pluginPrettier },
  languageOptions: {
    parser: eslintTs.parser,
    parserOptions: { project: "tsconfig.json", tsconfigRootDir: appRootPath.path },
  },
  rules: {
    "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "angle-bracket" }],
    "@typescript-eslint/no-import-type-side-effects": "error",
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-expressions": ["error", { allowShortCircuit: false }],
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "unknown"],
        "newlines-between": "always",
        "alphabetize": { order: "asc", caseInsensitive: true },
      },
    ],
    "prettier/prettier": "error",
  },
};

export default eslintConfigTs;
