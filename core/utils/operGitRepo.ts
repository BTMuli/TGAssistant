/**
 * @file core utils operGitRepo.ts
 * @description 处理 Github 仓库
 * @since 2.0.0
 */

import path from "node:path";

import axios from "axios";
import fs from "fs-extra";

import { fileCheck } from "./fileCheck.ts";
import { getProjDataPath } from "./getBasePaths.ts";
import { readConfig } from "./readConfig.ts";

const configAll = readConfig(TGACore.Config.ConfigFileEnum.Github);
const metaDir = path.join(getProjDataPath("data"), "http");
const snapConfig = configAll.snap;

type MetaJson = Record<TGACore.Config.GithubFile, string>;

/**
 * @description 获取下载 url
 * @since 2.0.0
 * @param {TGACore.Config.GithubRepoConfig} config Github 仓库配置
 * @param {TGACore.Config.GithubFile} fileType Snap.Metadata 数据类型
 * @return {string} 下载 url
 */
function getDownloadUrl(
  config: TGACore.Config.GithubRepoConfig,
  fileType: TGACore.Config.GithubFile,
): string {
  const filename = config.include[fileType];
  return `https://raw.gitmirror.com/${config.repo}/${config.branch}/${config.base}/${filename}`;
}

// 函数重载
export function getSnapDownloadUrl(fileType: TGACore.Config.GithubFile): string;
export function getSnapDownloadUrl(
  fileType: TGACore.Config.GithubFile,
  ...args: TGACore.Config.GithubFile[]
): Array<[TGACore.Config.GithubFile, string]>;

/**
 * @description 获取下载 url-Snap.Metadata
 * @since 2.0.0
 * @param {TGACore.Config.GithubFile} fileType Snap.Metadata 数据类型
 * @param {TGACore.Config.GithubFile} args Snap.Metadata 数据类型
 * @return {string | [TGACore.Config.GithubFile, string][]} 下载 url
 */
export function getSnapDownloadUrl(
  fileType: TGACore.Config.GithubFile,
  ...args: TGACore.Config.GithubFile[]
): string | Array<[TGACore.Config.GithubFile, string]> {
  if (args.length === 0) {
    return getDownloadUrl(snapConfig, fileType);
  } else {
    const urls: Array<[TGACore.Config.GithubFile, string]> = [];
    let item: [TGACore.Config.GithubFile, string] = [
      fileType,
      getDownloadUrl(snapConfig, fileType),
    ];
    urls.push(item);
    for (const arg of args) {
      item = [arg, getDownloadUrl(snapConfig, arg)];
      urls.push(item);
    }
    return urls;
  }
}

/**
 * @description 获取下载 url-Paimon.moe
 * @since 2.0.0
 * @param {TGACore.Config.GithubFile} fileType Snap.Metadata 数据类型
 * @return {string} 下载 url
 */
export function getPaimonDownloadUrl(fileType: TGACore.Config.GithubFile): string {
  const paimonConfig = configAll.paimon;
  return getDownloadUrl(paimonConfig, fileType);
}

/**
 * @description 下载 Snap.Metadata 元数据
 * @since 2.0.0
 * @return {Promise<MetaJson>} Snap.Metadata 元数据
 */
export async function getMetadata(): Promise<MetaJson> {
  const url = getSnapDownloadUrl("Meta");
  const res = await axios.get(url);
  return res.data;
}

/**
 * @description Snap.Metadata 元数据校验
 * @since 2.0.0
 * @param {TGACore.Config.GithubFile} metadata Snap.Metadata 元数据
 * @param {MetaJson} remoteMeta 远程元数据
 * @return {Promise<boolean>} 元数据校验结果
 */
export function checkMetadata(metadata: TGACore.Config.GithubFile, remoteMeta: MetaJson): boolean {
  fileCheck(metaDir);
  const metaPath = path.join(metaDir, "snapMetadata.json");
  if (!fileCheck(metaPath, false)) {
    return false;
  }
  const localMeta: MetaJson = fs.readJSONSync(metaPath);
  return localMeta[metadata] === remoteMeta[metadata];
}

/**
 * @description Snap.Metadata 元数据更新
 * @since 2.0.0
 * @param {TGACore.Config.GithubFile} metadata Snap.Metadata 元数据
 * @param {MetaJson} remoteMeta 远程元数据
 * @return {Promise<void>} 元数据更新结果
 */
export async function updateMetadata(
  metadata: TGACore.Config.GithubFile,
  remoteMeta: MetaJson,
): Promise<void> {
  const filePath = path.join(metaDir, "snapMetadata.json");
  if (!fileCheck(filePath, false)) {
    await fs.writeJSON(filePath, {}, { spaces: 2 });
  }
  const localMeta: MetaJson = fs.readJSONSync(filePath);
  localMeta[metadata] = remoteMeta[metadata];
  await fs.writeJSON(filePath, localMeta, { spaces: 2 });
}
