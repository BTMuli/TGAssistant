/**
 * Yatta 食物数据类型声明文件
 * @since 2.6.0
 */

declare namespace TGACore.Plugins.Yatta.Food {
  /** 食物列表响应。 */
  type FoodResponse = TGACore.Plugins.Yatta.Base.Response2<FoodItem, Record<string, string>>;

  /** 食物详情响应。 */
  type DetailResponse = TGACore.Plugins.Yatta.Base.Response<FoodDetail>;

  /** 食物列表项。 */
  type FoodItem = {
    id: number;
    name: string;
    type: string;
    recipe: boolean | null;
    mapMark: boolean;
    icon: string;
    rank: number;
    route: string;
    effectIcon: string;
  };

  /** 食物详情。 */
  type FoodDetail = {
    name: string;
    description: string;
    type: string;
    recipe: FoodRecipe | null;
    storyId: null;
    mapMark: boolean;
    source: null | Array<Source>;
    additions: null | unknown;
    icon: string;
    rank: number;
    route: string;
  };

  /** 食物配方与效果。 */
  type FoodRecipe = {
    effect: Record<string, string>;
    input: Record<string, FoodInput>;
    effectIcon: string;
  };

  /** 食物配方中的单项食材。 */
  type FoodInput = {
    name: string;
    icon: string;
    count: number;
  };

  /** 食物来源。 */
  type Source = {
    name: string;
    type: string;
    days?: Array<TGACore.Plugins.Yatta.DailyDungeon.WeekKey>;
  };
}
