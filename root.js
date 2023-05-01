/**
 * @file root.js
 * @description 项目根目录
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.0.0
 */

import path from "path";

// 跟目录
const ROOT_PATH = path.resolve("./");

// 元数据
export const ORI_DATA_PATH = path.resolve(ROOT_PATH, "oriData");

// 生成的数据
export const DATA_PATH = path.resolve(ROOT_PATH, "data");

// 临时文件
export const TEMP_PATH = path.resolve(ROOT_PATH, "temp");

// 生成的文件
export const OUT_PATH = path.resolve(ROOT_PATH, "out");

// 原资源
export const ORI_SRC_PATH = path.resolve(ROOT_PATH, "oriSource");

// 生成的资源
export const SRC_PATH = path.resolve(ROOT_PATH, "source");
