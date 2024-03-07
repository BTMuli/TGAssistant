/**
 * @file core/archive/birthday/download.ts
 * @description 存档-留影叙佳期
 * @since 2.1.0
 */
import * as console from "console"; // 先处理画片数据

import fs from "fs-extra"; // 先处理画片数据

import { getCalendar, getCharacter, getDraw } from "./request.ts";

// 先处理画片数据
let curPage = 1;
let totalPage = 1;
let drawData: TGACore.Archive.Birthday.DrawData[] = [];
let isFinishTask = false;
while (!isFinishTask) {
  const res = await getDraw(curPage.toString());
  curPage = res.data.current_page;
  totalPage = res.data.total_page;
  console.log(`当前页：${curPage}，总页数：${totalPage}`);
  drawData = drawData.concat(res.data.my_draws);
  if (curPage >= totalPage) {
    isFinishTask = true;
  } else {
    curPage++;
  }
}
fs.writeJSONSync("raw_draw.json", drawData, { spaces: 2 });
console.log("画片数据处理完成,共计：" + drawData.length);
// 再处理日历数据
isFinishTask = false;
let year = 2022;
const roleList: Array<{ id: number; year: number }> = [];
const calendarData: Record<number, TGACore.Archive.Birthday.CalendarRoleInfos> = {};
while (!isFinishTask) {
  const res = await getCalendar(year.toString());
  console.log(res.data);
  calendarData[year] = res.data.calendar_role_infos;
  Object.keys(res.data.calendar_role_infos).forEach((month) => {
    const val = res.data.calendar_role_infos[month];
    val.calendar_role.forEach((role) => {
      roleList.push({ id: role.role_id, year });
    });
    if (year >= 2024) {
      isFinishTask = true;
    } else {
      year++;
    }
  });
}
fs.writeJSONSync("raw_calendar.json", calendarData, { spaces: 2 });
console.log("日历数据处理完成, 共计：" + roleList.length);
// 最后处理角色数据
const roleData: TGACore.Archive.Birthday.InfoData[] = [];
for (const role of roleList) {
  const res = await getCharacter(role.id, role.year);
  roleData.push(res.data);
}
fs.writeJSONSync("raw_role.json", roleData, { spaces: 2 });
console.log("角色数据处理完成, 共计：" + roleData.length);
