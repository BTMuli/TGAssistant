/**
 * @file core/utils/parseNamecard.ts
 * @description 名片描述解析器
 * @since 2.2.0
 */

import * as fs from "fs-extra";

import { getAppDirPath } from "./getBasePaths.ts";
import * as console from "node:console";

/**
 * @description 解析名片描述
 * @since 2.2.0
 * @param {string} desc 名片描述
 * @param {number} index 名片索引
 * @return {string} 解析后的描述
 */
export function parseNamecard(desc: string, index: number): string {
  const array = [];
  if (desc.startsWith("名片纹饰。「") && desc.endsWith("」")) {
    array.push("名片纹饰。");
    const reg = /「.+?」/g;
    const match = desc.match(reg);
    console.log(match);
    if (match !== null) {
      for (const item of match) {
        if (item.length <= 34) {
          array.push(item);
        } else {
          array.push("「");
          array.push(...parseDesc(item.slice(1, -1), index, true));
          const maxLength = Math.max(...array.map((item) => item.length));
          array.push("  ".repeat(maxLength - 4) + "」");
        }
      }
    }
  } else {
    array.push("名片纹饰。");
    const content = desc.slice(5);
    if (content.length <= 32) {
      array.push(content);
    } else {
      array.push(...parseDesc(content, index));
    }
  }
  const res = array.join("\n");
  if (!res.endsWith("\n")) return res + "\n";
  return res;
}

/**
 * @function parseDesc
 * @description 解析名片描述
 * @since 2.2.0
 * @param {string} desc 名片描述
 * @param {number} index 名片索引
 * @param {boolean} inQuote 是否在引号内
 * @return {string[]} 解析后的描述
 */
function parseDesc(desc: string, index: number, inQuote: boolean = false): string[] {
  let res = desc.replace(/。/g, "。\n");
  res = res.replace(/；/g, "；\n");
  if (index !== 187) {
    res = res.replace(/：/g, "：\n");
    res = res.replace(/？/g, "？\n");
  } else {
    res = res.replace("时候，", "时候，\n");
    res = res.replace("。\n」", "。」");
  }
  if (!desc.includes("！」")) {
    res = res.replace(/！/g, "！\n");
  }
  res = res.replace(/…/g, "…\n");
  const match = res.split("\n");
  let array: string[] = [];
  for (const item of match) {
    if (item.length > 0 && item.length <= 32) {
      array.push(item);
    } else {
      const match2 = item.replace(/，/g, "，\n").split("\n");
      for (const item2 of match2) {
        if (item2.length > 0) array.push(item2);
      }
    }
  }
  if (inQuote) array = array.map((item) => `  ${item}`);
  return array;
}

/**
 * @description 根据名称获取名片数据
 * @since 2.2.0
 * @param {string} name 名片名称
 * @return {TGACore.Components.Namecard.ConvertData|false} 名片数据
 */
export function getNamecardByName(name: string): TGACore.Components.Namecard.ConvertData | false {
  const file = getAppDirPath("data", "namecard").out;
  const data: TGACore.Components.Namecard.ConvertData[] = fs.readJsonSync(
    `${file}/app/namecard.json`,
  );
  const namecard = data.find((item) => item.name === name);
  if (namecard === undefined) return false;
  return namecard;
}
