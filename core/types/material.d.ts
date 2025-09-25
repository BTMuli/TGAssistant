/**
 * @file core/types/material.d.ts
 * @description 材料组件类型定义
 * @since 2.4.0
 */

declare namespace TGACore.Components.Material {
  /**
   * @description 转换后的材料数据
   * @since 2.4.0
   * @interface WikiItem
   * @property {number} id 材料ID
   * @property {string} name 材料名称
   * @property {string} description 材料描述
   * @property {string} type 材料类型
   * @property {string} star 材料星级
   * @property {Array<Source>} source 材料来源
   * @property {Array<Convert>} change 材料转换
   */
  type WikiItem = {
    id: number;
    name: string;
    description: string;
    type: string;
    star: number;
    source: Array<Source>;
    convert: Array<Convert>;
  };

  /**
   * @description 材料来源
   * @since 2.4.0
   * @interface Source
   * @property {string} name 来源名称
   * @property {string} type 来源类型
   * @property {Array<number>} days 来源日期
   */
  type Source = { name: string; type: string; days?: Array<number> };

  /**
   * @description 材料转换
   * @since 2.4.0
   * @interface Convert
   * @property {string} id 转换ID
   * @property {string} source.name 材料名称
   * @property {string} source.id 材料id
   * @property {string} source.type 材料类型
   * @property {number} source.star 材料星级
   * @property {number} source.count 材料数量
   */
  type Convert = { id: string; source: Array<ConvertSource> };

  /**
   * @description 材料转换来源
   * @since 2.4.0
   * @interface ConvertSource
   * @property {string} name 材料名称
   * @property {string} id 材料id
   * @property {string} type 材料类型
   * @property {number} star 材料星级
   * @property {number} count 材料数量
   */
  type ConvertSource = {
    name: string;
    id: string;
    type: string;
    star: number;
    count: number;
  };
}
