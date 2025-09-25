/**
 * @file core/plugins/hutao/hutao.ts
 * @description 胡桃插件主文件
 * @since 2.4.0
 */

import { getWeaponTypeString, HutaoGithubFileEnum, HutaoWeaponTypeEnum } from "./enum.ts";
import {
  readRawJson,
  updateJson,
  fetchMeta,
  checkLocalJson,
  getAreaName,
  getAllAvatarId,
} from "./utils.ts";

const hutaoTool = {
  sync: fetchMeta,
  check: checkLocalJson,
  update: updateJson,
  read: readRawJson,
  readIds: getAllAvatarId,
  enum: {
    file: HutaoGithubFileEnum,
    weapon: HutaoWeaponTypeEnum,
    area: getAreaName,
    transW: getWeaponTypeString,
  },
};

export default hutaoTool;
