/**
 * @file calendar merge.js
 * @description 合并旧 json 与新 json
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.0.0
 */

// Node
import fs from "fs";
import path from "path";
// TGAssistant
import { ORI_DATA_PATH, DATA_PATH } from "../root.js";

// paths
const oriDataDir = path.join(ORI_DATA_PATH, "calendar");
const oldJson = JSON.parse(fs.readFileSync(path.join(oriDataDir, "calendar.json")));
const characterJson = JSON.parse(fs.readFileSync(path.join(DATA_PATH, "character.json")));
const weaponJson = JSON.parse(fs.readFileSync(path.join(DATA_PATH, "weapon.json")));
let newJson = {};

// find character
function findCharacter(id) {
  return characterJson.find((item) => item.id === id);
}

// find weapon
function findWeapon(id) {
  return weaponJson.find((item) => item.id === id);
}

// merge
Object.keys(oldJson).forEach((key1) => {
  const item = oldJson[key1];
  newJson[key1] = {
    characters: {},
    weapons: {},
  };
  Object.keys(item.characters).forEach((key2) => {
    const day = item.characters[key2];
    newJson[key1].characters[key2] = {
      title: day.title,
      materials: day.materials,
      contents: [],
    };
    day.contents.forEach((content) => {
      const character = findCharacter(content.id);
      if (character) {
        newJson[key1].characters[key2].contents.push(character);
      }
    });
  });
  Object.keys(item.weapons).forEach((key2) => {
    const day = item.weapons[key2];
    newJson[key1].weapons[key2] = {
      title: day.title,
      materials: day.materials,
      contents: [],
    };
    day.contents.forEach((content) => {
      const weapon = findWeapon(content.id);
      if (weapon) {
        newJson[key1].weapons[key2].contents.push(weapon);
      }
    });
  });
});

// write
fs.writeFileSync(path.join(oriDataDir, "merge.json"), JSON.stringify(newJson, null, 4));
