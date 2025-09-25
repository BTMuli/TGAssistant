/**
 * @file core/plugins/yatta/types/Material.d.ts
 * @description Yatta材料数据类型声明文件
 * @since 2.4.0
 */

declare namespace TGACore.Plugins.Yatta.Material {
  /**
   * @description 材料数据返回响应
   * @since 2.4.0
   * @interface MaterialResponse
   * @extends TGACore.Plugins.Yatta.Base.Response2
   */
  type MaterialResponse = TGACore.Plugins.Yatta.Base.Response2<
    MaterialItem,
    Record<string, string>
  >;

  /**
   * @description 材料详情数据返回响应
   * @since 2.4.0
   * @interface DetailResponse
   * @extends TGACore.Plugins.Yatta.Base.Response
   */
  type DetailResponse = TGACore.Plugins.Yatta.Base.Response<MaterialDetail>;

  /**
   * @description 材料数据
   * @since 2.4.0
   * @interface MaterialItem
   * @extends TGACore.Plugins.Yatta.Base.ResItem
   * @property {string} type 材料类型
   * @property {unknown} recipe 合成配方
   * @property {boolean} mapMark 地图标记
   * @property {number} rank 材料等级
   */
  type MaterialItem = TGACore.Plugins.Yatta.Base.ResItem & {
    type: string;
    recipe: unknown;
    mapMark: boolean;
    rank: number;
  };

  /**
   * @description 材料详情数据
   * @since 2.4.0
   * @interface MaterialDetail
   * @property {string} name 材料名称
   * @property {string} description 材料描述
   * @property {string} type 材料类型
   * @property {Recipe | null} recipe 合成配方
   * @property {null} storyId 关联的故事 id，暂无
   * @property {boolean} mapMark 地图标记
   * @property {Array<Source> | null} source 材料来源
   * @property {unknown | null} additions 额外信息，暂无用途
   * @property {string} icon 材料图标
   * @property {number} rank 材料等级
   * @property {string} route 路由
   */
  type MaterialDetail = {
    name: string;
    description: string;
    type: string;
    recipe: null | Recipe;
    storyId: null;
    mapMark: boolean;
    source: null | Array<Source>;
    additions: null | unknown;
    icon: string;
    rank: number;
    route: string;
  };

  /**
   * @description 材料合成数据
   * @since 2.4.0
   * @interface Recipe
   */
  type Recipe = Record<string, RecipeItem>;

  /**
   * @description 材料合成配方
   * @since 2.4.0
   * @interface RecipeItem
   */
  type RecipeItem = Record<string, RecipeMaterial>;

  /**
   * @description 材料合成配方材料
   * @since 2.4.0
   * @interface RecipeMaterial
   * @property {string} name 材料名称
   * @property {string} icon 材料图标
   * @property {string} rank 材料等级
   * @property {number} count 材料数量
   */
  type RecipeMaterial = { name: string; icon: string; rank: string; count: number };

  /**
   * @description 材料来源
   * @since 2.4.0
   * @interface Source
   * @property {string} name 来源名称
   * @property {string} type 来源类型
   * @property {Array<TGACore.Plugins.Yatta.DailyDungeon.WeekKey>} [days] 掉落日，仅在 type 为 "domain" 时存在
   */
  type Source = {
    name: string;
    type: string;
    days?: Array<TGACore.Plugins.Yatta.DailyDungeon.WeekKey>;
  };
}
