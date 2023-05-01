/**
 * @file namecard 获取原始数据
 * @description 获取原始数据
 * @author BTMuli<bt-muli@outlook.com>
 * @version 1.0.0
 */

// Node
import request from "request";
import { load } from "cheerio";
import fs from "fs";
import path from "path";
// TGAssistant
import { ORI_DATA_PATH } from "../root.js";

// paths
const savePath = path.resolve(ORI_DATA_PATH, "namecard", "namecard.json");
// urls
const urlPast = "https://genshin.honeyhunterworld.com/img/i_7";
const urlNow = "https://genshin.honeyhunterworld.com/img/i_n210";

// data
let nameCardsData = JSON.parse(fs.readFileSync(savePath, "utf-8"));
// 首先 type 升序，然后名字排序
nameCardsData.sort((a, b) => {
  if (a.type === b.type) {
    return a.name.localeCompare(b.name);
  }
  return a.type - b.type;
});
fs.writeFileSync(savePath, JSON.stringify(nameCardsData, null, 2));
// const idSet = new Set();
// await nameCardsData.forEach((item) => {
//   idSet.add(Number(item.id));
// });

// async function pushCard(url, i) {
//   if (idSet.has(Number(i))) {
//     return;
//   }
//   let nameCard = {
//     name: "",
//     description: "",
//     icon: "",
//     bg: "",
//     profile: "",
//     type: 0,
//     source: "",
//   };
//   request(url, (err, res, body) => {
//     if (err) {
//       console.log(url);
//       return;
//     }
//     const dom = load(body);
//     const table = dom(
//       "body > div.wp-site-blocks > div.wp-block-columns > div:nth-child(3) > div.entry-content.wp-block-post-content > table"
//     );
//     const trs = dom(table).find("tr");
//     trs.each((index, tr) => {
//       // 获取 tr 下的所有 <td>
//       const tds = dom(tr).find("td");
//       let name;
//       // 如果 tds 长度为 3，输出
//       if (tds.length === 3) {
//         name = dom(tds[1]).text();
//       } else {
//         name = dom(tds[0]).text();
//       }
//       // nameCard.id = i;
//       if (name === "Item Source (Ingame)") {
//         nameCard.source = dom(tds[1]).text();
//       } else if (name === "Description") {
//         nameCard.description = dom(tds[1]).text();
//       } else if (name === "Name") {
//         nameCard.name = dom(tds[2]).text();
//       }
//     });
//     if (nameCard.source.includes("成就")) {
//       nameCard.type = 1;
//     } else if (nameCard.source.includes("纪行")) {
//       nameCard.type = 3;
//     } else if (nameCard.source.includes("活动") || nameCard.name.includes("庆典")) {
//       nameCard.type = 4;
//     } else if (nameCard.source.includes("好感")) {
//       nameCard.type = 2;
//     } else {
//       nameCard.type = 0;
//     }
//     nameCard.icon = `/source/nameCard/icon/${nameCard.name}.webp`;
//     nameCard.bg = `/source/nameCard/bg/${nameCard.name}.webp`;
//     nameCard.profile = `/source/nameCard/profile/${nameCard.name}.webp`;
//     nameCardsData.push(nameCard);
//     console.log(`id: ${i} ${nameCard.name} 获取成功`);
//     fs.writeFileSync(savePath, JSON.stringify(nameCardsData, null, 2));
//   });
// }

// function getUrl(i, type) {
//   const iStr = i.toString().padStart(3, "0");
//   if (type === "past") {
//     return `${urlPast}${iStr}/?lang=CHS`;
//   } else if (type === "now") {
//     return `${urlNow}${iStr}/?lang=CHS`;
//   }
// }

// for (let i = 1; i <= 161; i++) {
//   if (i <= 117) {
//     await pushCard(getUrl(i, "past"), i);
//   } else if (i >= 122 && i <= 161) {
//     await pushCard(getUrl(i, "now"), i);
//   }
// }
