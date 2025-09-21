/**
 * @file utils getBasePaths.ts
 * @description 获取项目一些路径
 * @since 2.4.0
 */

import path from "node:path";

import appRootPath from "app-root-path";

/**
 * @description 获取项目根路径
 * @since 2.0.0
 * @returns {string} 项目根路径
 */
export function getProjRootPath(): string {
  return appRootPath.path;
}

/**
 * @description 获取项目配置文件路径
 * @since 2.0.0
 * @returns {string} 项目配置文件路径
 */
export function getProjConfigPath(): string {
  return path.join(getProjRootPath(), "config");
}

/**
 * @description 获取项目日志文件路径
 * @since 2.0.0
 * @returns {string} 项目日志文件路径
 */
export function getProjLogPath(): string {
  return path.join(getProjRootPath(), "logs");
}

/**
 * @description 获取项目数据文件路径
 * @since 2.4.0
 * @param {TGACore.Config.AppDirType} dirType 目录类型
 * @param {Array<string>} [args] 其他路径参数
 * @returns {string} 项目数据文件路径
 */
export function getProjDataPath(dirType: TGACore.Config.AppDirType): string;
export function getProjDataPath(dirType: TGACore.Config.AppDirType, ...args: string[]): string;
export function getProjDataPath(
  dirType: TGACore.Config.AppDirType,
  ...args: Array<string> | undefined
): string {
  if (!args || args.length === 0) return path.join(getProjRootPath(), "source", dirType);
  return path.join(getProjRootPath(), "source", dirType, ...args);
}

/**
 * @description 获取特定目录路径
 * @since 2.0.0
 * @param {TGACore.Config.AppDirType} dirType 目录类型
 * @param {TGACore.Config.AppDataDirType} dirName 数据目录类型
 * @return {TGACore.Config.BaseDirType} 目录路径
 */
export function getAppDirPath(
  dirType: TGACore.Config.AppDirType,
  dirName?: TGACore.Config.AppDataDirType,
): TGACore.Config.BaseDirType {
  const baseDir = getProjDataPath(dirType);
  switch (dirType) {
    case "data":
      return {
        src: path.join(baseDir, "src", dirName ?? ""),
        out: path.join(baseDir, "out"),
      };
    case "temp":
      return {
        src: path.join(baseDir, "src"),
        out: path.join(baseDir, "out"),
      };
    default:
      return {
        src: path.join(baseDir, "src", dirName ?? ""),
        out: path.join(baseDir, "out", dirName ?? ""),
      };
  }
}
