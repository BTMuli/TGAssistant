/**
 * @file core/utils/parseNamecard.ts
 * @description 名片描述解析器
 * @since 2.0.0
 */

import * as fs from "fs-extra";

import { getAppDirPath } from "./getBasePaths.ts";

/**
 * @description 解析名片描述
 * @since 2.0.0
 * @param {string} desc 名片描述
 * @return {string} 解析后的描述
 */
export function parseNamecard(desc: string): string {
  let array = [];
  if (desc.startsWith("名片纹饰。「")) {
    array.push("名片纹饰。");
    const reg = /「.+?」/g;
    const match = desc.match(reg);
    if (match !== null) {
      for (const item of match) {
        if (item.length <= 32) {
          array.push(item);
        } else {
          array.push("「");
          array.push(...parseDesc(item.slice(1, -1)));
          array.push("」");
        }
      }
    }
  } else {
    array = parseDesc(desc);
  }
  const res = array.join("\n");
  if (!res.endsWith("\n")) return res + "\n";
  return res;
}

/**
 * @function parseDesc
 * @description 解析名片描述
 * @since 2.0.0
 * @param {string} desc 名片描述
 * @return {string[]} 解析后的描述
 */
function parseDesc(desc: string): string[] {
  let res = desc.replace(/。/g, "。\n");
  res = res.replace(/；/g, "；\n");
  res = res.replace(/：/g, "：\n");
  res = res.replace(/？/g, "？\n");
  res = res.replace(/！/g, "！\n");
  res = res.replace(/…/g, "…\n");
  const match = res.split("\n");
  const array: string[] = [];
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
  return array;
}

/**
 * @description 根据名称获取名片数据
 * @since 2.0.0
 * @param {string} name 名片名称
 * @return {TGACore.Components.Namecard.ConvertData|false} 名片数据
 */
export function getNamecardByName(name: string): TGACore.Components.Namecard.ConvertData | false {
  const file = getAppDirPath("data", "namecard").out;
  const data: TGACore.Components.Namecard.ConvertData[] = fs.readJsonSync(`${file}/namecard.json`);
  const namecard = data.find((item) => item.name === name);
  if (namecard === undefined) return false;
  return namecard;
}
