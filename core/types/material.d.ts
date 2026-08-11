/**
 * 材料组件类型定义
 * @since 2.6.0
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
   * @property {string} cType 材料归并分类
   * @property {string} star 材料星级
   * @property {Array<Source>} source 材料来源
   * @property {Array<Convert>} change 材料转换
   */
  type WikiItem = {
    id: number;
    name: string;
    description: string;
    type: string;
    cType: string;
    star: number;
    source: Array<Source>;
    convert: Array<Convert>;
  };

  /** 独立输出的食物数据。 */
  type WikiFood = {
    /** 食物 ID。 */
    id: number;
    /** 食物效果描述。 */
    effect: Array<string>;
    /** 食物效果图标资源名称。 */
    effectIcon?: string;
    /** 所属配方组 ID，通常为本体料理 ID。 */
    recipeId?: number;
    /** 食物变体类型。 */
    kind?: WikiFoodKind;
  };

  /** 食物变体类型。 */
  type WikiFoodKind = "strange" | "normal" | "delicious" | "special";

  /** 配方组索引数据。 */
  type WikiFoodRecipe = {
    /** 配方组 ID，通常为本体料理 ID。 */
    id: number;
    /** 配方组共用的食材。 */
    input: Array<WikiFoodInput>;
    /** 配方组中的料理变体。 */
    variants: WikiFoodVariants;
  };

  /** 配方组中的料理变体索引。 */
  type WikiFoodVariants = {
    /** 奇怪的料理 ID。 */
    strange?: number;
    /** 本体料理 ID。 */
    normal?: number;
    /** 美味的料理 ID。 */
    delicious?: number;
    /** 角色特殊料理列表。 */
    special: Array<WikiFoodSpecial>;
  };

  /** 角色特殊料理与配方组的关联。 */
  type WikiFoodSpecial = {
    /** 角色 ID。 */
    characterId: number;
    /** 特殊料理 ID。 */
    foodId: number;
  };

  /** 食物制作所需的单项食材。 */
  type WikiFoodInput = {
    /** 食材 ID。 */
    id: number;
    /** 食材名称。 */
    name: string;
    /** 食材图标资源名称。 */
    icon: string;
    /** 食材数量。 */
    count: number;
  };

  /** 独立输出的书籍卷数据。 */
  type WikiBook = {
    /** 书籍卷对应的材料 ID。 */
    id: number;
    /** 书籍卷名称。 */
    name: string;
    /** 所属书籍名称，用于标识同一书籍的不同卷，Yatta 未提供时省略。 */
    vol?: string;
    /** 书籍卷描述。 */
    description: string;
    /** Yatta 可读内容 ID。 */
    storyId: string;
    /** 书籍正文。 */
    story: string;
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
