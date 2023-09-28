/**
 * @file core types observe.d.ts
 * @description 插件 米游社观测枢 类型定义
 * @since 2.0.0
 */

/**
 * @description 米游社观测枢 namespace
 * @since 2.0.0
 * @namespace TGACore.Plugins.Observe
 * @memberof TGACore.Plugins
 */
declare namespace TGACore.Plugins.Observe {
  /**
   * @description 通用 api 返回
   * @since 2.0.0
   * @memberof TGACore.Plugins.Observe
   * @interface Response
   * @property {number} retcode 返回码
   * @property {string} message 返回信息
   * @property {unknown} data 返回数据
   * @return Response
   */
  interface Response {
    retcode: number;
    message: string;
    data: unknown;
  }

  /**
   * @description 获取图鉴数据返回
   * @since 2.0.0
   * @memberof TGACore.Plugins.Observe
   * @interface ResponseWiki
   * @extends Response
   * @property {[WikiData]} data.list 图鉴数据
   * @return ResponseWiki
   */
  interface ResponseWiki extends Response {
    data: {
      list: [WikiData];
    };
  }

  /**
   * @description 图鉴数据
   * @since 2.0.0
   * @memberof TGACore.Plugins.Observe
   * @interface WikiData
   * @property {number} id 频道 id
   * @property {string} name 频道名称
   * @property {number} parent_id 父频道 id
   * @property {number} depth 所在层级
   * @property {string} ch_ext 反序列化后的 ch_ext
   * @property {WikiChildren[]} children 子频道
   * @property {unknown[]} list 未知
   * @property {unknown} layout 未知
   * @property {number} entry_limit 获取数量限制，0 为无限制
   * @property {boolean} hidden 是否隐藏
   * @return WikiData
   */
  interface WikiData {
    id: number;
    name: string;
    parent_id: number;
    depth: 1;
    ch_ext: string;
    children: WikiChildren[];
    list: unknown[];
    layout: unknown;
    entry_limit: number;
    hidden: boolean;
  }

  /**
   * @description 子频道
   * @since 2.0.0
   * @memberof TGACore.Plugins.Observe
   * @interface WikiChildren
   * @property {number} id 频道 id
   * @property {string} name 频道名称
   * @property {number} parent_id 父频道 id
   * @property {number} depth 所在层级
   * @property {string} ch_ext 反序列化后的 ch_ext
   * @property {unknown[]} children 子频道
   * @property {WikiItem[]} list 数据。这边可拓展
   * @property {unknown} layout 未知
   * @property {number} entry_limit 获取数量限制，0 为无限制
   * @property {boolean} hidden 是否隐藏
   * @return WikiChildren
   */
  interface WikiChildren {
    id: number;
    name: string;
    parent_id: number;
    depth: 2;
    ch_ext: string;
    children: unknown[];
    list: WikiItem[];
    layout: unknown;
    entry_limit: number;
    hidden: boolean;
  }

  /**
   * @description 图鉴项
   * @since 2.0.0
   * @memberof TGACore.Plugins.Observe
   * @interface WikiItem
   * @property {number} content_id 观测枢 contentId
   * @property {string} title 角色名称
   * @property {string} ext 反序列化后的角色标签
   * @property {string} icon 角色头像
   * @property {string} bbs_url 未知
   * @property {string} article_user_name 未知
   * @property {string} article_time 未知
   * @property {string} summary 角色简介
   * @return WikiItem
   */
  interface WikiItem {
    content_id: number;
    title: string;
    ext: string;
    icon: string;
    bbs_url: string;
    article_user_name: string;
    article_time: string;
    summary: string;
  }
}
