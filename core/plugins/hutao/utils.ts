/**
 * @file core/plugins/hutao/utils.ts
 * @description 一些关于胡桃的工具函数
 * @since 2.4.0
 */

import path from "node:path";

import logger from "@tools/logger.ts";
import { fileCheck } from "@utils/fileCheck.ts";
import fs from "fs-extra";

import { AREA_LIST, avatarDir, jsonDir } from "./constant.ts";
import { HutaoGithubFileEnum } from "./enum.ts";

/**
 * @description 获取JSON下载路径
 * @since 2.4.0
 * @function getJsonDownloadUrl
 * @param {TGACore.Plugins.Hutao.Base.GithubFileTypeEnum} fileType 文件类型
 * @param {string} [param] 参数，仅当 fileType 为 Avatar 时需要传入角色 ID
 * @return {string} 下载 url
 */
function getJsonDownloadUrl(
  fileType: TGACore.Plugins.Hutao.Base.GithubFileTypeEnum,
  param?: string,
): string {
  const rawPath = "https://raw.github.com/DGP-Studio/Snap.Metadata/main/Genshin/CHS/";
  if (fileType !== HutaoGithubFileEnum.Avatar) return `${rawPath}${fileType}`;
  else return `${rawPath}${fileType}${param}.json`;
}

/**
 * @description 获取JSON保存路径
 * @since 2.4.0
 * @function getSavePath
 * @param {TGACore.Plugins.Hutao.Base.GithubFileTypeEnum} fileType 文件类型
 * @param {string} [param] 参数，仅当 fileType 为 Avatar 时需要传入角色 ID
 * @return {string} 保存路径
 */
function getSavePath(
  fileType: TGACore.Plugins.Hutao.Base.GithubFileTypeEnum,
  param?: string,
): string {
  let savePath: Array<string>;
  if (fileType !== HutaoGithubFileEnum.Avatar) savePath = [fileType];
  else savePath = [fileType, `${param}.json`];
  return path.join(jsonDir, ...savePath);
}

/**
 * @description 下载JSON数据
 * @since 2.4.0
 * @function downloadJson
 * @param {TGACore.Plugins.Hutao.Base.GithubFileTypeEnum} fileType 文件类型
 * @param {string} [param] 参数，仅当 fileType 为 Avatar 时需要传入角色 ID
 * @return {Promise<void>} JSON数据
 */
async function downloadJson(
  fileType: TGACore.Plugins.Hutao.Base.GithubFileTypeEnum,
  param?: string,
): Promise<void> {
  const downloadLink = getJsonDownloadUrl(fileType, param);
  const resp = await fetch(downloadLink);
  const json = await resp.json();
  const savePath = getSavePath(fileType, param);
  await fs.writeJson(savePath, json, { spaces: 2 });
}

/**
 * @description 获取远程Meta数据
 * @function fetchMeta
 * @since 2.4.0
 * @returns {Promise<Record<string,string>>} Meta数据
 */
export async function fetchMeta(): Promise<Record<string, string>> {
  const downloadLink = getJsonDownloadUrl(HutaoGithubFileEnum.Meta);
  const resp = await fetch(downloadLink);
  return <Record<string, string>>await resp.json();
}

/**
 * @description 检测文件是否存在
 * @since 2.4.0
 * @function checkLocalJson
 * @param {TGACore.Plugins.Hutao.Base.GithubFileTypeEnum} fileType 文件类型
 * @param {string} [param] 参数，仅当 fileType 为 Avatar 时需要传入角色 ID
 * @return {boolean} true表示存在，false表示不存在
 */
export function checkLocalJson(
  fileType: TGACore.Plugins.Hutao.Base.GithubFileTypeEnum,
  param?: string,
): boolean {
  const savePath = getSavePath(fileType, param);
  return fileCheck(savePath, false);
}

/**
 * @description 读取JSON数据
 * @since 2.4.0
 * @function readRawJson
 * @template T
 * @param {TGACore.Plugins.Hutao.Base.GithubFileTypeEnum} fileType 文件类型
 * @param {string} [param] 参数，仅当 fileType 为 Avatar 时需要传入角色 ID
 * @return {T} JSON数据
 */
export function readRawJson<T>(
  fileType: TGACore.Plugins.Hutao.Base.GithubFileTypeEnum,
  param?: string,
): T {
  let savePath: string;
  if (fileType !== HutaoGithubFileEnum.Avatar) savePath = getSavePath(fileType);
  else if (param) savePath = getSavePath(fileType, param);
  else throw new Error(`[Hutao][metaUtils][readRawJson] 读取 ${fileType} 时缺少参数`);
  return fs.readJsonSync(savePath);
}

/**
 * @description 传入Meta数据跟比对数据，自动更新Meta数据
 * @function updateJson
 * @since 2.4.0
 * @param {Record<string,string>} metaData 胡桃Meta数据
 * @param {TGACore.Plugins.Hutao.Base.GithubFileTypeEnum} fileType 文件类型
 * @param {string} [param] 参数，仅当 fileType 为 Avatar 时需要传入角色 ID
 * @returns {Promise<boolean>} true表示更新，undefined表示无需更新,false表示更新失败
 */
export async function updateJson(
  metaData: Record<string, string>,
  fileType: TGACore.Plugins.Hutao.Base.GithubFileTypeEnum,
  param?: string,
): Promise<boolean> {
  fileCheck(jsonDir);
  if (fileType === HutaoGithubFileEnum.Avatar) fileCheck(avatarDir);
  let key: string;
  if (fileType !== HutaoGithubFileEnum.Avatar) key = fileType;
  else key = `${fileType}${param}.json`;
  key = key.replace(".json", "");
  const remoteMeta = metaData[key] ?? undefined;
  let needUpdate = true;
  let localMeta: Record<string, string> = {};
  if (checkLocalJson(HutaoGithubFileEnum.Meta)) {
    localMeta = readRawJson<Record<string, string>>(HutaoGithubFileEnum.Meta);
    if (localMeta[key] && remoteMeta && localMeta[key] === remoteMeta) {
      const check = checkLocalJson(fileType, param);
      if (check) needUpdate = false;
    }
  }
  if (!needUpdate) {
    logger.console.info(`[Hutao][metaUtils] ${key} 数据无需更新，保持 ${localMeta[key]}`);
    return false;
  }
  const diff = `${localMeta[key] ?? "undefined"} → ${metaData[key]}`;
  logger.default.info(`[Hutao][metaUtils] ${key} 即将更新 ${diff}`);
  await downloadJson(fileType, param);
  localMeta[key] = metaData[key];
  fs.writeJsonSync(getSavePath(HutaoGithubFileEnum.Meta), localMeta, { spaces: 2 });
  logger.default.info(`[Hutao][metaUtils] ${key} 数据更新完成 ${diff}`);
  return true;
}

/**
 * @description 传入地区索引，返回对应的地区名称
 * @since 2.4.0
 * @function getAreaName
 * @param {number} index 地区索引
 * @return {string} 地区名称
 */
export function getAreaName(index: number): string {
  if (index >= AREA_LIST.length || index < 0) return "未知";
  return AREA_LIST[index];
}

/**
 * @description 从本地Meta数据中获取所有角色ID
 * @since 2.4.0
 * @function getAllAvatarId
 * @param {Record<string,string>} meta 胡桃Meta数据
 * @returns {Array<string>}
 */
export function getAllAvatarId(meta: Record<string, string>): Array<string> {
  const ids: Array<string> = [];
  for (const key in meta) {
    if (key.startsWith(HutaoGithubFileEnum.Avatar)) {
      ids.push(key.replace(HutaoGithubFileEnum.Avatar, ""));
    }
  }
  return ids;
}
