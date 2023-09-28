/**
 * @file core utils fileCheck
 * @description 文件检查
 * @since 2.0.0
 */

import fs from "fs-extra";

import logger from "../tools/logger.ts";

/**
 * @description 检查文件/目录是否存在
 * @param {string} checkPath 要检查的路径
 * @param {boolean} isDir 是否为目录
 * @returns {boolean}
 */
export function fileCheck(checkPath: string, isDir: boolean = true): boolean {
  if (isDir) {
    if (!fs.existsSync(checkPath)) {
      fs.mkdirSync(checkPath, { recursive: true });
      logger.default.info(`[utils][fileCheck] 目录 ${checkPath} 不存在，已创建`);
    }
    return true;
  } else {
    return fs.existsSync(checkPath);
  }
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
      res = res.concat(getDeepValue(val));
    } else if (typeof val === "string") {
      res.push(val);
    }
  }
  return res;
}

/**
 * @description 给定 object，检测其最下游的属性对应的文件/目录是否存在
 * @todo 与 fileCheck 重载
 * @param {object} obj 要检查的 object
 * @param {boolean} isDir 是否为目录
 * @returns {void}
 */
export function fileCheckObj(obj: object, isDir: boolean = true): void {
  const valueArr = getDeepValue(obj);
  for (const value of valueArr) {
    fileCheck(value, isDir);
  }
}
