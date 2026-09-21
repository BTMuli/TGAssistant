/**
 * Nanoka 插件主文件
 */

export const NANOKA_VER = "7.1";
const NANOKA_API_URL = "https://static.nanoka.cc/gi/";
const NANOKA_ASSETS_URL = "https://static.nanoka.cc/assets/gi/";

/** 获取 Nanoka JSON 数据，路径相对于当前原神中文数据目录。 */
async function fetchJson<T>(relPath: string, version: string = NANOKA_VER): Promise<T> {
  const baseUrl = new URL(`${encodeURIComponent(version)}/zh/`, NANOKA_API_URL);
  const response = await fetch(new URL(relPath, baseUrl));
  if (!response.ok) {
    throw new Error(
      `Nanoka 请求失败：${relPath}（HTTP ${response.status} ${response.statusText}）`,
    );
  }
  return <T>await response.json();
}

/** 获取全部物品，以物品 ID 为键。 */
function fetchItems(version: string = NANOKA_VER): Promise<TGACore.Plugins.Nanoka.Item.All> {
  return fetchJson<TGACore.Plugins.Nanoka.Item.All>("item_all.json", version);
}

/** 获取角色详情，ID 可包含旅行者的元素变体后缀（如 10000007-4）。 */
function fetchCharacter(
  id: number | string,
  version: string = NANOKA_VER,
): Promise<TGACore.Plugins.Nanoka.Character.Detail> {
  const characterId = String(id);
  if (!/^\d+(?:-\d+)?$/.test(characterId)) {
    throw new Error(`Nanoka 角色 ID 无效：${characterId}`);
  }
  return fetchJson<TGACore.Plugins.Nanoka.Character.Detail>(
    `character/${characterId}.json`,
    version,
  );
}

/** 按完整 icon 名获取 Nanoka 的 WebP 图片数据。 */
async function fetchIcon(icon: string): Promise<Buffer> {
  const response = await fetch(new URL(`${encodeURIComponent(icon)}.webp`, NANOKA_ASSETS_URL));
  if (!response.ok) {
    throw new Error(
      `Nanoka 图标下载失败：${icon}（HTTP ${response.status} ${response.statusText}）`,
    );
  }
  return Buffer.from(await response.arrayBuffer());
}

const nanokaTool = { fetchJson, fetchItems, fetchCharacter, fetchIcon };

export default nanokaTool;
