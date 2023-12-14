/**
 * @file web/types/response.d.ts
 * @description 响应类型定义文件
 * @since 2.0.0
 */

/**
 * @description 响应类型 namespace
 * @since 2.0.0
 * @namespace TGWeb.Response
 * @memberof TGWeb
 */
declare namespace TGWeb.Response {
  /**
   * @description 通用响应类型
   * @since 2.0.0
   * @interface Common
   * @memberof TGWeb.Response
   */
  type Common = Base | BaseSuccess;

  /**
   * @description 通用响应类型-泛型
   * @since 2.0.0
   * @interface CommonT
   * @template T
   * @return CommonT
   */
  type CommonT<T> = Base | Success<T>;

  /**
   * @description 基础响应类型
   * @since 2.0.0
   * @interface Base
   * @memberof TGWeb.Response
   * @property {number} retcode - 响应码
   * @property {string} message - 响应信息
   * @property {never} data - 响应数据
   * @return Base
   */
  interface Base {
    retcode: number;
    message: string;
    data: never;
  }

  /**
   * @description 基础成功响应类型
   * @interface BaseSuccess
   * @since 2.0.0
   * @memberof TGWeb.Response
   * @property {0} retcode - 响应码
   * @property {string} message - 响应信息
   * @property {unknown} data - 响应数据
   * @return BaseSuccess
   */
  interface BaseSuccess {
    retcode: 0;
    message: string;
    data: unknown;
  }

  /**
   * @description 基础成功响应类型-泛型
   * @interface Success
   * @extends BaseSuccess
   * @template T
   * @property {T} data - 响应数据
   * @return Success
   */
  interface Success<T> extends BaseSuccess {
    data: T;
  }
}
