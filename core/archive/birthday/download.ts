/**
 * @file core/archive/birthday/download.ts
 * @description 存档-留影叙佳期
 * @since 2.1.0
 */
import * as console from "console";
import path from "node:path";

import fs from "fs-extra";

import { ArcBirDir } from "./constant.ts";
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
fs.writeJSONSync(path.join(ArcBirDir, "raw_draw.json"), drawData, { spaces: 2 });
console.log("画片数据处理完成,共计：" + drawData.length);
// 再处理日历数据
isFinishTask = false;
const roleSet = new Set<number>();
const calendarData: Record<string, TGACore.Archive.Birthday.CalendarRole[]> = {};
while (!isFinishTask) {
  const res = await getCalendar();
  Object.keys(res.data.calendar_role_infos).forEach((month) => {
    const val = res.data.calendar_role_infos[month];
    val.calendar_role.forEach((role) => {
      roleSet.add(role.role_id);
    });
    calendarData[month] = val.calendar_role;
  });
  isFinishTask = true;
}
fs.writeJSONSync(path.join(ArcBirDir, "raw_calendar.json"), calendarData, { spaces: 2 });
console.log("日历数据处理完成, 共计：" + roleSet.size);
// 最后处理角色数据
const roleData: TGACore.Archive.Birthday.InfoData[] = [];
for (const role of roleSet) {
  const res = await getCharacter(role);
  roleData.push(res.data);
}
fs.writeJSONSync(path.join(ArcBirDir, "raw_role.json"), roleData, { spaces: 2 });
console.log("角色数据处理完成, 共计：" + roleData.length);
