/**
 * 材料组件工具
 * @since 2.6.0
 */

import path from "node:path";

import fetchIconBuffer from "@utils/fetchIconBuffer.ts";
import { getProjRootPath } from "@utils/getBasePaths.ts";
import fs from "fs-extra";

const MATERIAL_ICON_DIRECTORIES: ReadonlyArray<string> = ["ItemIcon-Minimum", "ItemIcon"];

/** 本地静态资源新增图标时，允许立即重试此前返回 404 的图标。 */
export function hasLocalMaterialIcon(filename: string): boolean {
  return MATERIAL_ICON_DIRECTORIES.some((directory) =>
    fs.pathExistsSync(path.join(getProjRootPath(), "repos", "Snap.Static", directory, filename)),
  );
}

/**
 * 获取材料图标，按目录优先级依次尝试
 * @since 2.6.0
 * @param {string} filename 图标文件名
 * @return {Promise<Buffer>} 图标数据
 */
export async function fetchMaterialIcon(filename: string): Promise<Buffer> {
  return fetchIconBuffer(MATERIAL_ICON_DIRECTORIES, filename);
}

/** 将 Nanoka 物品数据转换为材料组件使用的详情格式。 */
export function toMaterialDetail(
  item: TGACore.Plugins.Nanoka.Item.Detail,
): TGACore.Plugins.Yatta.Material.MaterialDetail {
  return {
    name: item.name,
    description: item.desc,
    type: item.type,
    recipe: null,
    storyId: null,
    mapMark: false,
    source: item.source_list.map((name) => ({ name, type: "single" })),
    additions: null,
    icon: item.icon,
    rank: item.rank,
    route: "",
  };
}
