/**
 * @file calendar writeJson.js
 * @description 添加缺少的信息
 * @author BTMuli<bt-muli@outlook.com>
 * @version 1.0.0
 */

import fs from "node:fs";
import path from "node:path";

// 读取数据
const dataDir = "./calendar/data";
const readDataC = fs.readFileSync(path.join(dataDir, "charactorData.json"), "utf-8");
const readDataW = fs.readFileSync(path.join(dataDir, "weaponData.json"), "utf-8");
// 解析数据
const charactorData = JSON.parse(readDataC);
const weaponData = JSON.parse(readDataW);
// 对照数据
const weekDay = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
// index-区域对照表
const areaList = ["Mondstadt", "Liyue", "Inazuma", "Sumeru", "Unknown"];
const areaListCN = ["蒙德", "璃月", "稻妻", "须弥", "未知"];
// 获取 index-source 对照表
const sourceC = ["忘却之峡", "太山府", "菫色之庭", "昏识塔"];
const sourceW = ["塞西莉亚苗圃", "震雷连山密宫", "砂流之庭", "有顶塔"];
const weaponM = [
  ["高塔孤王", "凛风奔狼", "狮牙斗士"], // 蒙德
  ["孤云寒林", "雾海云间", "漆黑陨铁"], // 璃月
  ["远海夷地", "鸣神御灵", "今昔剧画"], // 稻妻
  ["谧林涓露", "绿洲花园", "烈日威权"], // 须弥
];
const talentM = [
  ["自由", "抗争", "诗文"], // 蒙德
  ["繁荣", "黄金", "勤劳"], // 璃月
  ["浮世", "风雅", "天光"], // 稻妻
  ["诤言", "巧思", "笃行"], // 须弥
];
// 开始添加
const transData = {};
// 添加 source
for (let i = 0; i < 7; i++) {
  console.log("正在处理", weekDay[i], "的数据");
  // 顶层基本信息
  transData[i] = {
    weekDay: weekDay[i],
    characters: {},
    weapons: {},
  };
  let weekData = transData[i];
  // 获取区域
  for (let j = 0; j < 5; j++) {
    const area = areaList[j];
    // 角色信息
    weekData.characters[area] = {
      area: areaListCN[j],
      source: sourceC[j],
      materials: [],
      contents: [],
    };
    // 武器信息
    weekData.weapons[area] = {
      area: areaListCN[j],
      source: sourceW[j],
      materials: [],
      contents: [],
    };
  }
  // 添加角色
  charactorData.map((item) => {
    // 判断是否是当天的角色
    if (item.days.includes((i + 1).toString())) {
      // 获取材料去掉第一个和最后四个字符
      const materialTest = item.materialList[0].slice(1, -4);
      // 是否是蒙德的角色
      if (talentM[0].includes(materialTest)) {
        // 补充当天的材料，是数组
        const areaM = weekData.characters[areaList[0]].materials;
        if (areaM.length === 0 || !areaM.includes(item.materialList[0])) {
          weekData.characters[areaList[0]].materials = areaM.concat(item.materialList);
        }
        // 补充当天的来源，是字符串
        if (weekData.characters[areaList[0]].source === "") {
          weekData.characters[areaList[0]].source = item.source;
        }
        // 将角色加到当天的内容中
        if (!weekData.characters[areaList[0]].contents.includes(item.name)) {
          weekData.characters[areaList[0]].contents.push(item.name);
        }
      }
      // 是否是璃月的角色
      else if (talentM[1].includes(materialTest)) {
        // 补充当天的材料，是数组
        try {
          const areaM = weekData.characters[areaList[1]].materials;
        } catch (error) {
          console.log(weekData.characters[areaList[1]]);
        }
        const areaM = weekData.characters[areaList[1]].materials;
        if (areaM.length === 0 || !areaM.includes(item.materialList[0])) {
          weekData.characters[areaList[1]].materials = areaM.concat(item.materialList);
        }
        // 补充当天的来源，是字符串
        if (weekData.characters[areaList[1]].source === "") {
          weekData.characters[areaList[1]].source = item.source;
        }
        // 将角色加到当天的内容中
        if (!weekData.characters[areaList[1]].contents.includes(item.name)) {
          weekData.characters[areaList[1]].contents.push(item.name);
        }
      }
      // 是否是稻妻的角色
      else if (talentM[2].includes(materialTest)) {
        // 补充当天的材料，是数组
        const areaM = weekData.characters[areaList[2]].materials;
        if (areaM.length === 0 || !areaM.includes(item.materialList[0])) {
          weekData.characters[areaList[2]].materials = areaM.concat(item.materialList);
        }
        // 补充当天的来源，是字符串
        if (weekData.characters[areaList[2]].source === "") {
          weekData.characters[areaList[2]].source = item.source;
        }
        // 将角色加到当天的内容中
        if (!weekData.characters[areaList[2]].contents.includes(item.name)) {
          weekData.characters[areaList[2]].contents.push(item.name);
        }
      }
      // 是否是须弥的角色
      else if (talentM[3].includes(materialTest)) {
        // 补充当天的材料，是数组
        const areaM = weekData.characters[areaList[3]].materials;
        if (areaM.length === 0 || !areaM.includes(item.materialList[0])) {
          weekData.characters[areaList[3]].materials = areaM.concat(item.materialList);
        }
        // 补充当天的来源，是字符串
        if (weekData.characters[areaList[3]].source === "") {
          weekData.characters[areaList[3]].source = item.source;
        }
        // 将角色加到当天的内容中
        if (!weekData.characters[areaList[3]].contents.includes(item.name)) {
          weekData.characters[areaList[3]].contents.push(item.name);
        }
      }
      // 放到 unknow 中
      else {
        console.log("未知的角色", item.name);
      }
    }
  });
  // 添加武器
  weaponData.map((item) => {
    // 判断是否是当天的武器
    if (item.days.includes((i + 1).toString())) {
      // 获取材料去掉第一个和最后四个字符
      const materialTest = item.materialList[0].slice(0, -3);
      // 是否是蒙德的武器
      if (weaponM[0].includes(materialTest)) {
        // 补充当天的材料，是数组
        const areaM = weekData.weapons[areaList[0]].materials;
        if (areaM.length === 0 || !areaM.includes(item.materialList[0])) {
          weekData.weapons[areaList[0]].materials = areaM.concat(item.materialList);
        }
        // 补充当天的来源，是字符串
        if (weekData.weapons[areaList[0]].source === "") {
          weekData.weapons[areaList[0]].source = item.source;
        }
        // 将武器加到当天的内容中
        if (!weekData.weapons[areaList[0]].contents.includes(item.name)) {
          weekData.weapons[areaList[0]].contents.push(item.name);
        }
      }
      // 是否是璃月的武器
      else if (weaponM[1].includes(materialTest)) {
        // 补充当天的材料，是数组
        const areaM = weekData.weapons[areaList[1]].materials;
        if (areaM.length === 0 || !areaM.includes(item.materialList[0])) {
          weekData.weapons[areaList[1]].materials = areaM.concat(item.materialList);
        }
        // 补充当天的来源，是字符串
        if (weekData.weapons[areaList[1]].source === "") {
          weekData.weapons[areaList[1]].source = item.source;
        }
        // 将武器加到当天的内容中
        if (!weekData.weapons[areaList[1]].contents.includes(item.name)) {
          weekData.weapons[areaList[1]].contents.push(item.name);
        }
      }
      // 是否是稻妻的武器
      else if (weaponM[2].includes(materialTest)) {
        // 补充当天的材料，是数组
        const areaM = weekData.weapons[areaList[2]].materials;
        if (areaM.length === 0 || !areaM.includes(item.materialList[0])) {
          weekData.weapons[areaList[2]].materials = areaM.concat(item.materialList);
        }
        // 补充当天的来源，是字符串
        if (weekData.weapons[areaList[2]].source === "") {
          weekData.weapons[areaList[2]].source = item.source;
        }
        // 将武器加到当天的内容中
        if (!weekData.weapons[areaList[2]].contents.includes(item.name)) {
          weekData.weapons[areaList[2]].contents.push(item.name);
        }
      }
      // 是否是须弥的武器
      else if (weaponM[3].includes(materialTest)) {
        // 补充当天的材料，是数组
        const areaM = weekData.weapons[areaList[3]].materials;
        if (areaM.length === 0 || !areaM.includes(item.materialList[0])) {
          weekData.weapons[areaList[3]].materials = areaM.concat(item.materialList);
        }
        // 补充当天的来源，是字符串
        if (weekData.weapons[areaList[3]].source === "") {
          weekData.weapons[areaList[3]].source = item.source;
        }
        // 将武器加到当天的内容中
        if (!weekData.weapons[areaList[3]].contents.includes(item.name)) {
          weekData.weapons[areaList[3]].contents.push(item.name);
        }
      }
      // 放到 unknow 中
      else {
        console.log("未知的武器", item.name);
      }
    }
  });
}
// 写入数据
fs.writeFileSync(path.join(dataDir, "transData.json"), JSON.stringify(transData, null, 2), "utf-8");
