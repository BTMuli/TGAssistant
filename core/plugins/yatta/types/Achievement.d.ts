/**
 * @file core/plugins/yatta/types/Achievement.d.ts
 * @description Yatta 插件成就类型声明文件
 * @since 2.4.0
 */

declare namespace TGACore.Plugins.Yatta.Achievement {
  /**
   * @description 接口返回响应
   * @since 2.4.0
   * @interface AchiResp
   * @extends TGACore.Plugins.Yatta.Base.Response<AchiRes>
   */
  type AchiResp = TGACore.Plugins.Yatta.Base.Response<AchiRes>;

  /**
   * @description 接口返回数据
   * @since 2.4.0
   * @interface AchiSeries
   */
  type AchiRes = Record<string, AchiSeries>;

  /**
   * @description 成就系列
   * @since 2.4.0
   * @interface AchiSeries
   * @property {number} id 编号
   * @property {string} name 名称
   * @property {number} order 排序
   * @property {string} icon 图标
   * @property {Record<string,AchiList>} achievementList 成就列表
   * @property {Record<string,AchiReward>} finishReward 完成奖励
   */
  type AchiSeries = {
    id: number;
    name: string;
    order: number;
    icon: string;
    achievementList: Record<string, AchiList>;
    finishReward: Record<string, AchiReward> | null;
  };

  /**
   * @description 成就列表
   * @since 2.4.0
   * @property {number} id 编号
   * @property {number} order 排序
   * @property {string} version 版本
   * @property {Array<AchiItem>} details 详情
   * @property {Array<AchiTask>} tasks 任务
   */
  type AchiList = {
    id: number;
    order: number;
    version: string;
    details: Array<AchiItem>;
    tasks: Array<AchiTask>;
  };

  /**
   * @description 成就详情
   * @since 2.4.0
   * @interface AchiItem
   * @property {number} id 编号
   * @property {string} title 标题
   * @property {string} description 描述
   * @property {number} progress 进度
   * @property {Record<string,AchiReward>} rewards 奖励
   */
  type AchiItem = {
    id: number;
    title: string;
    description: string;
    progress: number;
    rewards: Record<string, AchiReward>;
  };

  /**
   * @description 成就任务
   * @since 2.4.0
   * @interface AchiTask
   * @property {string} type 类型
   * @property {Array<AchiQuest>} questList 任务列表
   */
  type AchiTask = { type: string; questList: Array<AchiQuest> };

  /**
   * @description 成就任务
   * @since 2.4.0
   * @interface AchiQuest
   * @property {number} id 编号
   * @property {string} questTitle 任务标题
   * @property {number} chapterId 章节编号
   * @property {string} chapterTitle 章节标题
   */
  type AchiQuest = { id: number; questTitle?: string; chapterId: number; chapterTitle: string };

  /**
   * @description 奖励，成就系列的key是名片ID，成就详情的key是材料ID
   * @since 2.4.0
   * @interface AchiReward
   * @property {number} rank 星级
   * @property {number} count 数量
   * @property {string} icon 图标
   */
  type AchiReward = { rank: number; count: number; icon: string };
}
