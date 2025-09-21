/**
 * @file core/utils/fileCheck.ts
 * @description 文件检查
 * @since 2.4.0
 */

import fs from "fs-extra";

import logger from "../tools/logger.ts";

/**
 * @description 检查文件/目录是否存在
 * @since 2.4.0
 * @function fileCheck
 * @param {string} checkPath 要检查的路径
 * @param {boolean} isDir 是否为目录
 * @returns {boolean}
 */
export function fileCheck(checkPath: string, isDir: boolean = true): boolean {
  const isExist = fs.pathExistsSync(checkPath);
  if (isDir && !isExist) {
    fs.ensureDirSync(checkPath, { recursive: true });
    logger.default.info(`[utils][fileCheck] 目录 ${checkPath} 不存在，已创建`);
    return true;
  } else return isExist;
}

/**
 * @description 给定 Obj，返回 value 为 string 的 value 数组
 * @since 2.0.0
 * @param {object} obj 要检查的 object
 * @returns {string[]} value 为 string 的 value 数组
 */
function getDeepValue(obj: object): string[] {
  let res: string[] = [];
  for (const val of Object.values(obj)) {
    if (typeof val === "object") {
      res = res.concat(getDeepValue(<object>val));
    } else if (typeof val === "string") {
      res.push(val);
    }
  }
  return res;
}

/**
 * @description 给定 object，检测其最下游的属性对应的文件/目录是否存在
 * @param {object} obj 要检查的 object
 * @param {boolean} isDir 是否为目录
 * @returns {void|boolean}
 */
export function fileCheckObj(obj: object, isDir: false): boolean;
export function fileCheckObj(obj: object, isDir?: true): void;
export function fileCheckObj(obj: object, isDir: boolean = true): boolean | undefined {
  const valueArr = getDeepValue(obj);
  let res;
  for (const value of valueArr) {
    res = fileCheck(value, isDir);
    if (!isDir && !res) return false;
  }
  if (!isDir) return true;
}
