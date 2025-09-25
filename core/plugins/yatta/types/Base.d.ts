/**
 * @file core/plugins/yatta/types/Base.d.ts
 * @description Yatta 插件基础类型声明文件
 * @since 2.4.0
 */

declare namespace TGACore.Plugins.Yatta.Base {
  /**
   * @description 通用返回响应
   * @since 2.4.0
   * @template T
   * @property {number} response 返回状态码
   * @property {T} data 返回数据
   */
  type Response<T> = { response: number; data: T };

  /**
   * @description 通用返回响应，data包含items字段
   * @since 2.4.0
   * @template T,U,V
   * @extends Response<Res<T, U, V>>
   */
  type Response2<T, U, V> = Response<Res<T, U, V>>;

  /**
   * @description 通用返回数据，包含types和items字段
   * @since 2.4.0
   * @interface Res
   * @template T,U,V
   * @property {Record<string,T>} items 返回数据项
   * @property {U} types 返回数据类型
   * @property {V} props 返回数据属性
   */
  type Res<T, U = never, V = never> = {
    items: Record<string, T>;
    types: U;
    props: V;
  };

  /**
   * @description 通用数据类型，data.items 的类型
   * @since 2.4.0
   * @interface Item
   * @property {number} id 编号
   * @property {string} name 名称
   * @property {string} icon 图标
   * @property {string} route 路由
   */
  type ResItem = { id: string; name: string; icon: string; route: string };
}
