/**
 * 胡桃插件主文件
 * @since 2.6.0
 */

import { getWeaponTypeString, HutaoGithubFileEnum, HutaoWeaponTypeEnum } from "./enum.ts";
import {
  readRawJson,
  updateJson,
  fetchMeta,
  checkLocalJson,
  getAreaName,
  getAllAvatarId,
  getSavePath,
} from "./utils.ts";

const hutaoTool = {
  sync: fetchMeta,
  check: checkLocalJson,
  update: updateJson,
  read: readRawJson,
  readIds: getAllAvatarId,
  path: getSavePath,
  enum: {
    file: HutaoGithubFileEnum,
    weapon: HutaoWeaponTypeEnum,
    area: getAreaName,
    transW: getWeaponTypeString,
  },
};

export default hutaoTool;
