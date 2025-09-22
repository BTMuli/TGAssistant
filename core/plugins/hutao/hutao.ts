/**
 * @file core/plugins/hutao/hutao.ts
 * @description 胡桃插件主文件
 * @since 2.4.0
 */

import { HutaoGithubFileEnum } from "./enum.ts";
import { readRawJson, updateJson, fetchMeta, checkLocalJson } from "./utils.ts";

const hutaoTool = {
  sync: fetchMeta,
  check: checkLocalJson,
  update: updateJson,
  read: readRawJson,
  enum: { file: HutaoGithubFileEnum },
};

export default hutaoTool;
