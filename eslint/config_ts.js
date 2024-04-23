import eslint_ts from "typescript-eslint";
import eslint_import from "eslint-plugin-import";

const tsConfig = {
  files: ["*.ts"],
  plugins: {
    typescript: eslint_ts,
    import: eslint_import,
  },
  languageOptions: {
    parserOptions: {
      project: "tsconfig.json",
    },
  },
  rules: {
    "@typescript-eslint/consistent-type-assertions": [
      "error",
      {
        assertionStyle: "angle-bracket",
      },
    ],
    "@typescript-eslint/no-import-type-side-effects": "error",
    "@typescript-eslint/strict-boolean-expressions": "error",
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "unknown"],
        "newlines-between": "always",
        "alphabetize": {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
};

export const tsEslintConfig = [...eslint_ts.configs.recommended, tsConfig];
