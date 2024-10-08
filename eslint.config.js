import { jsonEslintConfig } from "./eslint/config_json.js";
import ymlEslintConfig from "./eslint/config_yml.js";
import { tsEslintConfig } from "./eslint/config_ts.js";

export default [
  ...jsonEslintConfig,
  ...tsEslintConfig,
  ymlEslintConfig,
  {
    ignores: [
      "node_modules",
      "logs",
      "source/assets",
      "source/temp",
      "source/data/http",
      "source/data/src",
      "web/**/*.js",
      "pnpm-lock.yaml",
      "qodana.yaml",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
];
