/**
 * @file core utils readConfig
 * @description 读取配置
 * @since 2.0.0
 */

import { join } from "node:path";
import process from "node:process";

import YAML from "yamljs";

import { fileCheck } from "./fileCheck.ts";
import { getProjConfigPath } from "./getBasePaths.ts";
import logger from "../tools/logger.ts";

// 读取配置文件类型-函数重载
export function readConfig(fileType: "constant"): TGACore.Config.ConstantConfig;
export function readConfig(fileType: "github"): TGACore.Config.GithubConfig;

/**
 * @description 配置读取中转
 * @since 2.0.0
 * @param {TGACore.Config.ConfigFileEnum} fileType 配置文件类型
 * @return {unknown} 配置文件内容
 */
export function readConfig(fileType: "github" | "constant"): unknown {
  const configDir = getProjConfigPath();
  const filePath = join(configDir, `${fileType}.yml`);
  if (!fileCheck(filePath, false)) {
    logger.default.error(`[utils][readConfig] 读取 ${fileType} 配置文件失败`);
    process.exit(1);
  }
  return YAML.load(filePath);
}
