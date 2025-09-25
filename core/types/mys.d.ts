/**
 * @file core/types/mys.d.ts
 * @description 米游社类型定义
 * @since 2.4.0
 */

declare namespace TGACore.Plugins.Mys {
  /**
   * @description 通用 api 返回
   * @since 2.4.0
   * @interface Response
   * @template T 返回数据类型
   * @property {number} retcode 返回码
   * @property {string} message 返回信息
   * @property {T} data 返回数据
   */
  type Response<T> = { retcode: number; message: string; data: T };

  /**
   * @description 获取图鉴数据返回
   * @since 2.4.0
   * @interface WikiResponse
   * @extends Response
   */
  type WikiResponse = Response<WikiRes>;

  /**
   * @description 帖子列表数据返回
   * @since 2.4.0
   * @interface PostListResponse
   * @extends Response
   */
  type PostListResponse = Response<PostListRes>;

  /**
   * @description 帖子列表数据
   * @since 2.4.0
   * @interface PostListRes
   * @property {Array<PostRaw>} list 帖子列表
   * @property {boolean} is_last 是否为最后一页
   * @property {string} last_id 用于翻页的 last_id
   */
  type PostListRes = { list: Array<PostRaw>; is_last: boolean; last_id: string };

  /**
   * @description 帖子项包装
   * @since 2.4.0
   * @interface PostRaw
   * @property {PostItem} post 帖子项
   */
  type PostRaw = { post: PostItem };

  /**
   * @description 帖子项
   * @since 2.4.0
   * @interface PostItem
   * @todo 只写了需要的字段
   * @property {string} post_id 帖子 id
   * @property {string} subject 帖子标题
   * @property {string} created_at 帖子创建时间
   */
  type PostItem = { post_id: string; subject: string; created_at: string };

  /**
   * @description 图鉴数据返回
   * @since 2.4.0
   * @interface WikiRes
   * @property {Array<WikiData>} list 图鉴数据
   */
  type WikiRes = { list: Array<WikiData> };

  /**
   * @description 图鉴数据
   * @since 2.4.0
   * @interface WikiData
   * @property {number} id 频道 id
   * @property {string} name 频道名称
   * @property {number} parent_id 父频道 id
   * @property {number} depth 所在层级
   * @property {string} ch_ext 反序列化后的 ch_ext
   * @property {Array<WikiChildren>} children 子频道
   * @property {Array<unknown>} list 未知
   * @property {unknown} layout 未知
   * @property {number} entry_limit 获取数量限制，0 为无限制
   * @property {boolean} hidden 是否隐藏
   */
  type WikiData = {
    id: number;
    name: string;
    parent_id: number;
    depth: 1;
    ch_ext: string;
    children: Array<WikiChildren>;
    list: Array<unknown>;
    layout: unknown;
    entry_limit: number;
    hidden: boolean;
  };

  /**
   * @description 子频道
   * @since 2.4.0
   * @interface WikiChildren
   * @property {number} id 频道 id
   * @property {string} name 频道名称
   * @property {number} parent_id 父频道 id
   * @property {number} depth 所在层级
   * @property {string} ch_ext 反序列化后的 ch_ext
   * @property {Array<unknown>} children 子频道
   * @property {Array<WikiItem>} list 数据。这边可拓展
   * @property {unknown} layout 未知
   * @property {number} entry_limit 获取数量限制，0 为无限制
   * @property {boolean} hidden 是否隐藏
   */
  type WikiChildren = {
    id: number;
    name: string;
    parent_id: number;
    depth: 2;
    ch_ext: string;
    children: Array<unknown>;
    list: Array<WikiItem>;
    layout: unknown;
    entry_limit: number;
    hidden: boolean;
  };

  /**
   * @description 图鉴项
   * @since 2.4.0
   * @interface WikiItem
   * @property {number} content_id 观测枢 contentId
   * @property {string} title 角色名称
   * @property {string} ext 反序列化后的角色标签
   * @property {string} icon 角色头像
   * @property {string} bbs_url 未知
   * @property {string} article_user_name 未知
   * @property {string} article_time 未知
   * @property {string} summary 角色简介
   */
  type WikiItem = {
    content_id: number;
    title: string;
    ext: string;
    icon: string;
    bbs_url: string;
    article_user_name: string;
    article_time: string;
    summary: string;
  };
}
