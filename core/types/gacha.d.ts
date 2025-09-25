/**
 * @file core/types/gacha.d.ts
 * @description 祈愿类型声明文件
 * @since 2.4.0
 */

declare namespace TGACore.Components.Gacha {
  /**
   * @description 暂存于本地的米游社帖子数据
   * @since 2.4.0
   * @interface MysPosts
   */
  type MysPosts = Array<MysPost>;

  /**
   * @description 米游社帖子项
   * @since 2.4.0
   * @interface MysPost
   * @property {string} postId 帖子 id
   * @property {string} title 帖子标题
   * @property {string} time 帖子创建时间
   */
  type MysPost = { postId: string; title: string; time: string };

  /**
   * @description 转换后的祈愿数据
   * @since 2.4.0
   * @interface Pool
   * @property {string} name 卡池名称
   * @property {string} version 卡池版本
   * @property {number} order 卡池排序
   * @property {string} banner 卡池横幅
   * @property {string} from 卡池开始时间 yyyy-MM-ddTHH:mm:ss+08:00
   * @property {string} to 卡池结束时间 yyyy-MM-ddTHH:mm:ss+08:00
   * @property {string} type 卡池类型
   * @property {string} postId 米游社帖子 id
   * @property {Array<number>} up5List up五星
   * @property {Array<number>} up4List up四星
   */
  type Pool = {
    name: string;
    version: string;
    order: number;
    banner: string;
    from: string;
    to: string;
    type: number;
    postId: string;
    up5List: Array<number>;
    up4List: Array<number>;
  };
}
