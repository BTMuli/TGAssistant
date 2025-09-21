/**
 * @file core/plugins/hutao/utils.ts
 * @description 一些关于胡桃的工具函数
 * @since 2.4.0
 */

import fs from "fs-extra";
import path from "node:path";
import { HutaoGithubFileEnum } from "./enum.ts";
import { jsonDir } from "./constant.ts";
import { fileCheck } from "@utils/fileCheck.ts";

/**
 * @description 获取JSON下载路径
 * @since 2.4.0
 * @param {TGACore.Plugins.Hutao.Base.GithubFileTypeEnum} fileType 文件类型
 * @param {string} [param] 参数，仅当 fileType 为 Avatar 时需要传入角色 ID
 * @return {string} 下载 url
 */
export function getJsonDownloadUrl(fileType: TGACore.Plugins.Hutao.Base.SingleFileType): string;
export function getJsonDownloadUrl(
  fileType: TGACore.Plugins.Hutao.Base.AvatarFileType,
  param: string,
): string;
export function getJsonDownloadUrl(
  fileType: TGACore.Plugins.Hutao.Base.GithubFileTypeEnum,
  param?: string,
): string {
  const rawPath = "https://raw.github.com/DGP-Studio/Snap.Metadata/main/Genshin/CHS/";
  if (fileType !== HutaoGithubFileEnum.Avatar) return `${rawPath}${fileType}`;
  else return `${rawPath}${fileType}${param}.json`;
}

/**
 * @description 下载JSON数据
 * @since 2.4.0
 * @param {TGACore.Plugins.Hutao.Base.GithubFileTypeEnum} fileType 文件类型
 * @param {string} [param] 参数，仅当 fileType 为 Avatar 时需要传入角色 ID
 * @return {Promise<void>} JSON数据
 */
export async function downloadJson(
  fileType: TGACore.Plugins.Hutao.Base.SingleFileType,
): Promise<void>;
export async function downloadJson(
  fileType: TGACore.Plugins.Hutao.Base.AvatarFileType,
  param: string,
): Promise<void>;
export async function downloadJson(
  fileType: TGACore.Plugins.Hutao.Base.GithubFileTypeEnum,
  param?: string,
): Promise<void> {
  const downloadLink = getJsonDownloadUrl(fileType, param);
  const resp = await fetch(downloadLink);
  const json = await resp.json();
  let savePath: Array<string>;
  if (fileType !== HutaoGithubFileEnum.Avatar) savePath = [fileType];
  else savePath = [fileType, `${param}.json`];
  const fullPath = path.join(jsonDir, ...savePath);
  await fs.writeJson(fullPath, json, { spaces: 2 });
}

/**
 * @description 读取JSON数据
 * @since 2.4.0
 * @template T
 * @param {TGACore.Plugins.Hutao.Base.GithubFileTypeEnum} fileType 文件类型
 * @param {string} [param] 参数，仅当 fileType 为 Avatar 时需要传入角色 ID
 * @return {Promise<T>} JSON数据
 */
export async function readRawJson<T>(
  fileType: TGACore.Plugins.Hutao.Base.SingleFileType,
): Promise<T>;
export async function readRawJson<T>(
  fileType: TGACore.Plugins.Hutao.Base.AvatarFileType,
  param: string,
): Promise<T>;
export async function readRawJson<T>(
  fileType: TGACore.Plugins.Hutao.Base.GithubFileTypeEnum,
  param?: string,
): Promise<T> {
  let localPath: Array<string>;
  if (fileType !== HutaoGithubFileEnum.Avatar) localPath = [fileType];
  else localPath = [fileType, `${param}.json`];
  const fullPath = path.join(jsonDir, ...localPath);
  const check = await fileCheck(fullPath, false);
  if (!check) throw new Error(`Hutao JSON文件不存在: ${fullPath}`);
  return await fs.readJson(fullPath);
}
