/**
 * @file core/plugins/yatta/types/DailyDungeon.d.ts
 * @description yatta 每日副本类型声明文件
 * @since 2.4.0
 */
declare namespace TGACore.Plugins.Yatta.DailyDungeon {
  /**
   * @description 每日副本数据返回响应
   * @since 2.4.0
   * @interface DailyResponse
   * @extends TGACore.Plugins.Yatta.Base.Response<DailyRes>
   */
  type DailyResponse = TGACore.Plugins.Yatta.Base.Response<DailyRes>;

  /**
   * @description 每日副本数据
   * @since 2.4.0
   * @interface DailyRes
   */
  type DailyRes = Record<WeekKey, DailyDomain>;

  /**
   * @description 一周
   * @since 2.4.0
   * @interface WeekKey
   * @property {string} monday 周一
   * @property {string} tuesday 周二
   * @property {string} wednesday 周三
   * @property {string} thursday 周四
   * @property {string} friday 周五
   * @property {string} saturday 周六
   * @property {string} sunday 周日
   */
  const WeekDay = <const>{
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
  };

  /**
   * @description 一周类型枚举键
   * @since 2.4.0
   * @interface WeekKey
   */
  type WeekKey = keyof typeof WeekDay;

  /**
   * @description 一周类型枚举值
   * @since 2.4.0
   * @interface WeekDayEnum
   */
  type WeekDayEnum = (typeof WeekDay)[keyof typeof WeekDay];

  /**
   * @description 每日副本
   * @since 2.4.0
   * @interface DailyDomain
   */
  type DailyDomain = Record<string, DomainItem>;

  /**
   * @description 每日副本项
   * @since 2.4.0
   * @interface DomainItem
   * @property {number} id 副本 id
   * @property {string} name 副本名称
   * @property {Array<number>} reward 掉落物品 id 列表
   * @property {number} city 所在城市 id
   */
  type DomainItem = { id: number; name: string; reward: Array<number>; city: number };
}
