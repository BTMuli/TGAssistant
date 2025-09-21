/**
 * @file core/plugins/hutao/hutao.ts
 * @description 胡桃插件主文件
 * @since 2.4.0
 */

import { readRawJson } from "./utils.ts";
import { updateJson, fetchMeta } from "./metaUtils.ts";
import { HutaoGithubFileEnum } from "./enum.ts";

const hutaoTool = {
  sync: fetchMeta,
  update: updateJson,
  read: readRawJson,
  enum: { file: HutaoGithubFileEnum },
};

export default hutaoTool;
