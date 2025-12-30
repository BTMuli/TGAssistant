/**
 * 使用到的函数
 * @since 2.5.0
 */
import { tz } from "@date-fns/tz";
import Counter from "@tools/counter.ts";
import logger from "@tools/logger.ts";
import fetchSgBuffer from "@utils/fetchSgBuffer.ts";
import { fileCheck } from "@utils/fileCheck.ts";
import { format, parseISO } from "date-fns";
import sharp from "sharp";

/**
 * 字符串转 utc8 时间
 * @param raw - 字符串
 * @returns 转换后的时间 yyyy-MM-dd HH:mm:ss
 */
export function str2utc8(raw: string): string {
  return format(parseISO(raw), "yyyy-MM-dd HH:mm:ss", {
    in: tz("Asia/Shanghai"),
  });
}

/**
 * 下载角色图标
 * @param avatar - 角色数据
 * @param savePath - 目标路径
 * @returns 无返回值
 */
export async function downloadAvatarIcon(
  avatar: TGACore.Plugins.Yatta.Avatar.AvatarItem,
  savePath: string,
): Promise<void> {
  Counter.addTotal();
  if (fileCheck(savePath, false)) {
    logger.console.mark(`[components][character] ${avatar.id} ${avatar.name} Icon 已存在，跳过`);
    Counter.Skip();
    return;
  }
  try {
    const res = await fetchSgBuffer("AvatarIcon", `${avatar.icon}.png`);
    await sharp(res).toFile(savePath);
    logger.default.info(`[components][character] ${avatar.id} ${avatar.name} Icon 下载完成`);
    Counter.Success();
  } catch (e) {
    logger.default.warn(`[components][character] ${avatar.id} ${avatar.name} Icon 下载失败`);
    logger.default.error(e);
    Counter.Fail();
  }
}

/**
 * 下载角色衣装图标
 * @since 2.5.0
 * @param costume 衣装数据
 * @param savePath 目标路径
 * @returns 无返回值
 */
export async function downloadCostumeIcon(
  costume: TGACore.Plugins.Hutao.Avatar.CostumeExtra,
  savePath: string,
): Promise<void> {
  Counter.addTotal();
  if (fileCheck(savePath, false)) {
    logger.console.mark(`[components][character] ${costume.Id} ${costume.Name} 图标已存在，跳过`);
    Counter.Skip();
    return;
  }
  try {
    const res = await fetchSgBuffer("AvatarIcon", `${costume.FrontIcon}.png`);
    await sharp(res).toFile(savePath);
    logger.default.info(`[components][character] ${costume.Id} ${costume.Name} 图标下载完成`);
    Counter.Success();
  } catch (e) {
    logger.default.warn(`[components][character] ${costume.Id} ${costume.Name} 图标下载失败`);
    logger.default.error(e);
    Counter.Fail();
  }
}

/**
 * 下载角色衣装侧边图
 * @since 2.5.0
 * @param costume 衣装数据
 * @param savePath 目标路径
 * @returns 无返回值
 */
export async function downloadCostumeSide(
  costume: TGACore.Plugins.Hutao.Avatar.CostumeExtra,
  savePath: string,
): Promise<void> {
  Counter.addTotal();
  if (fileCheck(savePath, false)) {
    logger.console.mark(`[components][character] ${costume.Id} ${costume.Name} 侧边图已存在，跳过`);
    Counter.Skip();
    return;
  }
  try {
    const res = await fetchSgBuffer("AvatarIcon", `${costume.SideIcon}.png`);
    await sharp(res).toFile(savePath);
    logger.default.info(`[components][character] ${costume.Id} ${costume.Name} 侧边图下载完成`);
    Counter.Success();
  } catch (e) {
    logger.default.warn(`[components][character] ${costume.Id} ${costume.Name} 侧边图下载失败`);
    logger.default.error(e);
    Counter.Fail();
  }
}

/**
 * 下载角色衣装全身图
 * @since 2.5.0
 * @param costume 衣装数据
 * @param iconName 全身图名称
 * @param savePath 目标路径
 * @returns 无返回值
 */
export async function downloadCostumeFull(
  costume: TGACore.Plugins.Hutao.Avatar.CostumeExtra,
  iconName: string,
  savePath: string,
): Promise<void> {
  Counter.addTotal();
  if (fileCheck(savePath, false)) {
    logger.console.mark(`[components][character] ${costume.Id} ${costume.Name} 全身图已存在，跳过`);
    Counter.Skip();
    return;
  }
  try {
    const res = await fetchSgBuffer("Costume", `${iconName}.png`);
    await sharp(res).toFile(savePath);
    logger.default.info(`[components][character] ${costume.Id} ${costume.Name} 全身图下载完成`);
    Counter.Success();
  } catch (e) {
    logger.default.warn(`[components][character] ${costume.Id} ${costume.Name} 全身图下载失败`);
    logger.default.error(e);
    Counter.Fail();
  }
}

/**
 * 转换角色衣装数据
 * @since 2.5.0
 * @param raw - 原始数据
 * @returns 转换后的数据
 */
export function transHutaoCostume(
  raw: TGACore.Plugins.Hutao.Avatar.Costume,
): TGACore.Components.Character.Costume {
  return {
    id: raw.Id,
    isDefault: raw.IsDefault,
    name: raw.Name,
    desc: raw.Description,
  };
}

/**
 * 转换角色图标数据
 * @since 2.5.0
 * @param oriPath - 原始路径
 * @param outPath - 目标路径
 * @param label - 描述
 * @returns 无返回值
 */
export async function convertIcon(oriPath: string, outPath: string, label: string): Promise<void> {
  Counter.addTotal();
  if (!fileCheck(oriPath, false)) {
    logger.default.warn(`[components][character] ${label} 资源缺失`);
    Counter.Fail();
    return;
  }
  if (fileCheck(outPath, false)) {
    logger.console.mark(`[components][character] ${label} 已转换，跳过`);
    Counter.Skip();
    return;
  }
  await sharp(oriPath).webp().toFile(outPath);
  logger.console.info(`[components][character] ${label} 转换成功`);
  Counter.Success();
}
