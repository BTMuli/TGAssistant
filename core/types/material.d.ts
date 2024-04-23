/**
 * @file core/types/material.d.ts
 * @description 材料组件类型定义
 * @since 2.2.0
 */

/**
 * @description 材料类型 namespace
 * @since 2.2.0
 * @namespace TGACore.Components.Material
 * @memberof TGACore.Components
 */
declare namespace TGACore.Components.Material {
  /**
   * @description 元数据响应-amber
   * @since 2.0.1
   * @memberof TGACore.Components.Material
   * @interface Response
   * @property {number} response 返回状态码
   * @property {RawAmber} data 返回数据
   * @return ResponseMaterial
   */
  interface Response {
    response: number;
    data: RawAmber;
  }

  /**
   * @description 材料数据
   * @since 2.2.0
   * @memberof TGACore.Plugins.Amber
   * @interface RawAmber
   * @property {string} name 材料名称
   * @property {string} description 材料描述
   * @property {string} type 材料类型
   * @property {false|MaterialRecipe} recipe 是否有配方
   * @property {boolean} mapMark 是否有地图标记
   * @property {null|Array<{name:string,type:string,days?:string[]}>} source 材料来源
   * @property {string} icon 图标
   * @property {string} rank 星级
   * @property {string} route 路由
   * @return RawAmber
   */
  interface RawAmber {
    name: string;
    description: string;
    type: string;
    recipe: false | MaterialRecipe | null;
    mapMark: boolean;
    source: null | Array<{
      name: string;
      type: string;
      days?: string[];
    }>;
    icon: string;
    rank: number;
    route: string;
  }

  /**
   * @description 材料配方
   * @since 2.0.1
   * @memberof TGACore.Plugins.Amber
   * @interface MaterialRecipe
   * @property {Record<string,Record<string,{icon:string,count:number}>>} recipe 配方
   * @return MaterialRecipe
   */
  type MaterialRecipe = Record<
    string,
    Record<
      string,
      {
        icon: string;
        count: number;
      }
    >
  >;

  /**
   * @description 转换后的材料数据
   * @since 2.0.1
   * @memberof TGACore.Components.Material
   * @interface WikiItem
   * @property {number} id 材料ID
   * @property {string} name 材料名称
   * @property {string} description 材料描述
   * @property {string} type 材料类型
   * @property {string} star 材料星级
   * @property {Source[]} source 材料来源
   * @property {Convert[]} change 材料转换
   * @return WikiItem
   */
  interface WikiItem {
    id: number;
    name: string;
    description: string;
    type: string;
    star: number;
    source: Source[];
    convert: Convert[];
  }

  /**
   * @description 材料来源
   * @since 2.0.1
   * @memberof TGACore.Components.Material
   * @interface Source
   * @property {string} name 来源名称
   * @property {string} type 来源类型
   * @property {string[]} days 来源日期
   * @return Source
   */
  interface Source {
    name: string;
    type: string;
    days?: number[];
  }

  /**
   * @description 材料转换
   * @since 2.0.1
   * @memberof TGACore.Components.Material
   * @interface Convert
   * @property {string} id 转换ID
   * @property {string} source.name 材料名称
   * @property {string} source.id 材料id
   * @property {string} source.type 材料类型
   * @property {number} source.star 材料星级
   * @property {number} source.count 材料数量
   * @return Convert
   */
  interface Convert {
    id: string;
    source: Array<{
      name: string;
      id: string;
      type: string;
      star: number;
      count: number;
    }>;
  }
}
