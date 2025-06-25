/**
 * @file namecard/utils.ts
 * @description 名片组件工具函数
 * @since 2.4.0
 */

/**
 * @description 传入图片类型&名称，返回图片文件名
 * @param {string} type 图片类型
 * @param {string} name 名称
 * @return {string} 图片文件名
 */
export function getImageFileName(type: string, name: string): string {
  const typeList = ["icon", "bg", "profile"];
  if (!typeList.includes(type)) {
    throw new Error(`Unknown image type: ${type}`);
  }
  if (type === "icon") {
    const misList = ["Ly1", "Ly2", "Md1", "Md2", "Xinyan"];
    if (misList.includes(name)) return `UI_NameCardPic_${name}`;
    return `UI_NameCardIcon_${name}`;
  }
  if (type === "bg") {
    const misList = [
      "Bp12",
      "Bp13",
      "Bp14",
      "Bp15",
      "Bp16",
      "Bp17",
      "Bp18",
      "Bp21",
      "Bp22",
      "Bp3",
      "Xssdlk",
    ];
    if (misList.includes(name)) return `UI_NameCardPic_${name}_P_Alpha`;
    return `UI_NameCardPic_${name}_Alpha`;
  }
  return `UI_NameCardPic_${name}_P`;
}
