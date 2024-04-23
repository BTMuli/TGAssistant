import eslint_yml from "eslint-plugin-yml";
import eslint_yml_parser from "yaml-eslint-parser";

const ymlConfig = {
  files: ["*.yaml", "*.yml"],
  plugins: {
    yml: eslint_yml,
  },
  languageOptions: {
    parser: eslint_yml_parser,
    parserOptions: {
      defaultYAMLVersion: "1.2",
    },
  },
  rules: {
    "yml/indent": ["error", 2],
    "yml/key-spacing": ["error"],
    "yml/quotes": [
      "error",
      {
        prefer: "double",
        avoidEscape: true,
      },
    ],
    "yml/sort-keys": ["error", "asc"],
  },
};

export const ymlEslintConfig = [...eslint_yml.configs["flat/recommended"], ymlConfig];
