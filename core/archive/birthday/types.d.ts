/**
 * @file core/archive/birthday/types.d.ts
 * @description 存档-留影叙佳期-类型定义文件
 * @since 2.1.0
 */

/**
 * @description 留影叙佳期画片数据
 * @since 2.1.0
 * @namespace TGACore.Archive.Birthday
 * @memberof TGACore
 */
declare namespace TGACore.Archive.Birthday {
  /**
   * @description 画片数据响应
   * @since 2.1.0
   * @interface DrawResponse
   * @extends TGWeb.Response.BaseSuccess
   * @property {DrawData[]} data.my_draws - 画片数据
   * @property {number} data.current_page - 当前页
   * @property {number} data.total_page - 总页数
   * @property {boolean} data.draw_notice - 画片通知
   * @property {boolean} data.is_finish_task - 是否完成任务
   * @property {boolean} data.guide_task - 引导任务
   * @property {boolean} data.guide_compensate - 引导补偿
   * @property {boolean} data.guide_draw - 引导画片
   * @property {number} data.current_compensate_num - 当前补偿数量
   * @property {boolean} data.is_compensate_num - 是否补偿数量
   * @property {number} data.year_compensate_num - 年份补偿数量
   * @returns DrawResponse
   */
  interface DrawResponse extends TGWeb.Response.BaseSuccess {
    data: {
      my_draws: DrawData[];
      current_page: number;
      total_page: number;
      draw_notice: boolean;
      is_finish_task: boolean;
      guide_task: boolean;
      guide_compensate: boolean;
      guide_draw: boolean;
      current_compensate_num: number;
      is_compensate_num: boolean;
      year_compensate_num: number;
    };
  }

  /**
   * @description 画片数据
   * @since 2.1.0
   * @interface DrawData
   * @property {string} draw_status - 画片状态
   * @property {string} take_picture - 画片地址
   * @property {string} unread_picture - 未读画片地址
   * @property {string} word_text - 留言
   * @property {number} year - 年份
   * @property {string} birthday - 生日 m/d
   * @property {boolean} is_new - 是否新画片
   * @property {number} role_id - 角色 id
   * @property {string} gal_xml - 画片 xml
   * @property {string} gal_resource - 画片资源
   * @property {boolean} is_collected - 是否收藏
   * @property {number} op_id - 操作 id
   * @property {boolean} is_compensate - 是否补偿
   * @property {string} role_name - 角色名
   * @returns DrawData
   */
  interface DrawData {
    draw_status: string;
    take_picture: string;
    unread_picture: string;
    word_text: string;
    year: number;
    birthday: string;
    is_new: boolean;
    role_id: number;
    gal_xml: string;
    gal_resource: string;
    is_collected: boolean;
    op_id: number;
    is_compensate: boolean;
    role_name: string;
  }

  /**
   * @description 角色信息响应
   * @since 2.1.0
   * @interface CharacterResponse
   * @extends TGWeb.Response.BaseSuccess
   * @property {InfoData} data - 角色信息
   * @returns CharacterResponse
   */
  interface CharacterResponse extends TGWeb.Response.BaseSuccess {
    data: InfoData;
  }

  /**
   * @description 角色信息
   * @since 2.1.0
   * @interface InfoData
   * @property {number} role_id - 角色 id
   * @property {string} name - 角色名
   * @property {string} belong - 所属
   * @property {string} divine_type - 神力类型
   * @property {boolean} is_god - 是否是神
   * @property {string} seat_life - 命座
   * @property {string} element - 元素
   * @property {string} text - 介绍
   * @property {string} role_birthday - 生日 m/d
   * @property {string} head_icon - 头像
   * @property {string} head_image - 头像
   * @property {string} introduce - 介绍
   * @property {boolean} is_subscribe - 是否订阅
   * @property {boolean} is_finish_task - 是否完成任务
   * @property {number} current_compensate_num - 当前补偿数量
   * @property {boolean} is_compensate_num - 是否补偿数量
   * @property {number} year_compensate_num - 年份补偿数量
   * @returns InfoData
   */
  interface InfoData {
    role_id: number;
    name: string;
    belong: string;
    divine_type: string;
    is_god: boolean;
    seat_life: string;
    element: string;
    text: string;
    role_birthday: string;
    head_icon: string;
    head_image: string;
    introduce: string;
    is_subscribe: boolean;
    is_finish_task: boolean;
    current_compensate_num: number;
    is_compensate_num: boolean;
    year_compensate_num: number;
  }

  /**
   * @description 日历数据响应
   * @since 2.1.0
   * @interface CalendarResponse
   * @extends TGWeb.Response.BaseSuccess
   * @property {CalendarRoleInfos} data.calendar_role_infos - 日历角色信息
   * @property {boolean} data.is_next - 是否有下一页
   * @property {boolean} data.is_pre - 是否有上一页
   * @property {boolean} data.is_year_subscribe - 是否年订阅
   * @returns CalendarResponse
   */
  interface CalendarResponse extends TGWeb.Response.BaseSuccess {
    data: {
      calendar_role_infos: CalendarRoleInfos;
      is_next: boolean;
      is_pre: boolean;
      is_year_subscribe: boolean;
    };
  }

  /**
   * @description 日历角色信息
   * @since 2.1.0
   */
  type CalendarRoleInfos = Record<string, { calendar_role: CalendarRole[] }>;

  /**
   * @description 日历角色
   * @since 2.1.0
   * @interface CalendarRole
   * @property {number} role_id - 角色 id
   * @property {string} name - 角色名
   * @property {string} head_icon - 头像
   * @property {boolean} is_subscribe - 是否订阅
   * @property {string} role_birthday - 生日 m/d
   * @returns CalendarRole
   */
  interface CalendarRole {
    role_id: number;
    name: string;
    head_icon: string;
    is_subscribe: boolean;
    role_birthday: string;
  }
}
