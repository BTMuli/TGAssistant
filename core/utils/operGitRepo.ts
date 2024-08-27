/**
 * @file core/utils/operGitRepo.ts
 * @description 处理 Github 仓库
 * @since 2.2.0
 */

import { readConfig } from "./readConfig.ts";

const configAll = readConfig(TGACore.Config.ConfigFileEnum.Github);
const snapConfig = configAll.snap;

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
