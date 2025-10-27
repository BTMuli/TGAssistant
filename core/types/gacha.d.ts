/**
 * 祈愿类型声明文件
 * @since 2.5.0
 */

declare namespace TGACore.Components.Gacha {
  /**
   * 暂存于本地的米游社帖子数据
   * @since 2.4.0
   */
  type MysPosts = Array<MysPost>;

  /**
   * 米游社帖子项
   * @since 2.4.0
   */
  type MysPost = {
    /** 帖子ID */
    postId: string;
    /** 帖子标题 */
    title: string;
    /** 帖子创建时间 */
    time: string;
  };

  /**
   * 转换后的卡池数据
   * @since 2.4.0
   */
  type Pool = {
    /** 卡池名称 */
    name: string;
    /** 卡池版本 */
    version: string;
    /** 卡池排序 */
    order: number;
    /** 卡池横幅 */
    banner: string;
    /** 卡池开始时间 yyyy-MM-ddTHH:mm:ss+08:00 */
    from: string;
    /** 卡池结束时间 yyyy-MM-ddTHH:mm:ss+08:00 */
    to: string;
    /** 卡池类型 */
    type: number;
    /** 米游社帖子 id */
    postId: string;
    /** up 五星 */
    up5List: Array<number>;
    /** up 四星 */
    up4List: Array<number>;
  };

  /**
   * 转换后的千星奇域数据
   * @since 2.5.0
   */
  type GachBMeta = {
    id: string;
    type: string;
    rank: number;
    name: string;
    icon: string;
  };
}
