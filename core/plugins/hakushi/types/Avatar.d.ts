/**
 * Hakushi插件角色数据
 * @since 2.5.0
 */

declare namespace TGACore.Plugins.Hakushi.Avatar {
  /**
   * 角色JSON返回
   * @since 2.5.0
   * @remarks https://api.hakush.in/gi/data/character.json
   */
  type BriefResp = Record<string, AvatarBrief>;

  /**
   * 角色信息
   * @since 2.5.0
   */
  type AvatarBrief = {
    /** 生日 */
    birth: Array<number> & { length: 2 };
    /** 图标 */
    icon: string;
    /** 稀有度 */
    rank: number;
    /**
     * 武器类型
     * @remarks 枚举
     * - WEAPON_BOW 弓
     */
    weapon: string;
    /** 上线时间 */
    release: string;
    /** 元素 */
    element: string;
    /** 英文译名 */
    EN: string;
    /** 描述（英文） */
    desc: string;
    /** 韩文译名 */
    KR: string;
    /** 中文译名 */
    CHS: string;
    /** 日文译名 */
    JP: string;
  };
}
