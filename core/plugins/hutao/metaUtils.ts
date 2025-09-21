/**
 * @file core/plugins/hutao/metaUtils.ts
 * @description 一些关于胡桃Meta数据的工具函数
 * @since 2.4.0
 */

import fs from "fs-extra";
import { fileCheck } from "@utils/fileCheck.ts";
import { jsonDir, jsonMeta } from "./constant.ts";
import { downloadJson, getJsonDownloadUrl } from "./utils.ts";
import { HutaoGithubFileEnum } from "./enum.ts";
import logger from "@tools/logger.ts";

/**
 * @description 获取远程Meta数据
 * @function fetchMeta
 * @since 2.4.0
 * @returns {Promise<Record<string,string>>} Meta数据
 */
export async function fetchMeta(): Promise<Record<string, string>> {
  const downloadLink = getJsonDownloadUrl(HutaoGithubFileEnum.Meta);
  const resp = await fetch(downloadLink);
  return await resp.json();
}

/**
 * @description 传入Meta数据跟比对数据，自动更新Meta数据
 * @function updateJson
 * @since 2.4.0
 * @param {Record<string,string>} metaData 胡桃Meta数据
 * @param {TGACore.Plugins.Hutao.Base.GithubFileTypeEnum} fileType 文件类型
 * @param {string} [param] 参数，仅当 fileType 为 Avatar 时需要传入角色 ID
 * @returns {Promise<void>} 无返回值
 */
export async function updateJson(
  metaData: Record<string, string>,
  fileType: TGACore.Plugins.Hutao.Base.SingleFileType,
): Promise<void>;
export async function updateJson(
  metaData: Record<string, string>,
  fileType: TGACore.Plugins.Hutao.Base.AvatarFileType,
  param: string,
): Promise<void>;
export async function updateJson(
  metaData: Record<string, string>,
  fileType: TGACore.Plugins.Hutao.Base.GithubFileTypeEnum,
  param?: string,
): Promise<void> {
  await fileCheck(jsonDir);
  const metaCheck = await fileCheck(jsonMeta, false);
  let key: string;
  if (fileType !== HutaoGithubFileEnum.Avatar) key = fileType;
  else key = `${fileType}${param}.json`;
  key = key.replace(".json", "");
  const localMeta = metaCheck ? await fs.readJSON(jsonMeta) : {};
  let needUpdate = true;
  if (localMeta[key] && localMeta[key] === metaData[key]) needUpdate = false;
  if (!needUpdate) {
    logger.console.info(`[Hutao][metaUtils] ${key} 数据无需更新，保持 ${localMeta[key]}`);
    return;
  }
  logger.default.info(
    `[Hutao][metaUtils] ${key} 数据需要更新，${localMeta[key] ?? "undefined"} → ${metaData[key]}`,
  );
  await downloadJson(fileType, param);
  localMeta[key] = metaData[key];
  await fs.writeJSON(jsonMeta, localMeta, { spaces: 2 });
  logger.default.info(`[Hutao][metaUtils] ${key} 数据更新完成 ${localMeta[key]}`);
}
