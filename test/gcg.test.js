/**
 * @file test gcg.test.js
 * @description 测试 gcg 数据获取
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import axios from "axios";
import { before, describe, it } from "mocha";
import assert from "node:assert";

describe("米游社数据源", async () => {
	let dataGet;
	before(async () => {
		const url = "https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/home/content/list?app_sn=ys_obc&channel_id=231";
		dataGet = (await axios.get(url)).data;
	});
	describe("数据获取", async () => {
		it("网络请求", async () => {
			assert.strictEqual(dataGet["retcode"], 0);
		});
		it("图鉴数据获取", async () => {
			const listGet = dataGet["data"]["list"];
			assert.strictEqual(listGet.length, 1);
			const itemGet = dataGet["data"]["list"][0];
			assert.strictEqual(itemGet["name"], "卡牌图鉴");
		});
		it("子项检测", async () => {
			const childrenList = dataGet["data"]["list"][0]["children"];
			assert.strictEqual(childrenList.length, 3);
			const nameListGet = childrenList.map(item => item["name"]);
			const nameListTest = ["角色牌", "行动牌", "魔物牌"];
			assert.deepStrictEqual(nameListGet, nameListTest);
		});
	});
	describe("数据解析", async () => {
		let dataList = {
			character: {},
			action: {},
			monster: {}
		};
		before(async () => {
			const childrenList = dataGet["data"]["list"][0]["children"];
			childrenList.map(item => {
				if (item["name"] === "角色牌") {
					dataList.character = item["list"][0];
				} else if (item["name"] === "行动牌") {
					dataList.action = item["list"][0];
				} else if (item["name"] === "魔物牌") {
					dataList.monster = item["list"][0];
				}
			});
		});
		describe("数据分类", async () => {
			let testKey = {
				character: [],
				action: [],
				monster: []
			};
			before(async () => {
				Object.keys(dataList).map(key => {
					const ext = JSON.parse(dataList[key]["ext"]);
					testKey[key].push(...Object.keys(ext));
				});
			});
			it("属性长度测试", async () => {
				assert.strictEqual(testKey.character.length, 1);
				assert.strictEqual(testKey.action.length, 1);
				assert.strictEqual(testKey.monster.length, 1);
			});
			it("属性名称测试", async () => {
				assert.strictEqual(testKey.character[0], "c_233");
				assert.strictEqual(testKey.action[0], "c_234");
				assert.strictEqual(testKey.monster[0], "c_235");
			});
		});
		describe("角色牌解析", async () => {
			let propData;
			before(async () => {
				const extJson = JSON.parse(dataList.character["ext"]);
				propData = JSON.parse(extJson["c_233"]["filter"]["text"]);
			});
			it("属性测试", async () => {
				assert.strictEqual(propData.length, 3);
				const propGet = propData.map(item => {
					return item.split("/")[0];
				});
				const propTest = ["元素", "武器", "阵营"];
				assert.deepStrictEqual(propGet, propTest);
			});
			it("icon 下载", async () => {
				const iconUrl = dataList.character["icon"];
				const iconGet = (await axios.get(iconUrl, { responseType: "arraybuffer" })).data;
				assert.strictEqual(iconGet.length !== 0, true);
			});
		});
		describe("行动牌解析", async () => {
			let propData;
			before(async () => {
				const extJson = JSON.parse(dataList.action["ext"]);
				propData = JSON.parse(extJson["c_234"]["filter"]["text"]);
			});
			it("属性测试", async () => {
				assert.strictEqual(propData.length, 3);
				const propGet = propData.map(item => {
					return item.split("/")[0];
				});
				const propTest = ["标签", "类型", "花费"];
				assert.deepStrictEqual(propGet, propTest);
			});
			it("icon 下载", async () => {
				const iconUrl = dataList.action["icon"];
				const iconGet = (await axios.get(iconUrl, { responseType: "arraybuffer" })).data;
				assert.strictEqual(iconGet.length !== 0, true);
			});
		});
		describe("魔物牌解析", async () => {
			it("属性测试", async () => {
				const extJson = JSON.parse(dataList.monster["ext"]);
				assert.strictEqual(extJson["c_235"]["filter"], undefined);
			});
			it("icon 下载", async () => {
				const iconUrl = dataList.monster["icon"];
				const iconGet = (await axios.get(iconUrl, { responseType: "arraybuffer" })).data;
				assert.strictEqual(iconGet.length !== 0, true);
			});
		});

	});
});

describe("Amber数据源", async () => {
	let dataGet;
	before(async () => {
		const url = "https://api.ambr.top/v2/chs/gcg?vh=37F8";
		dataGet = (await axios.get(url)).data;
	});
	describe("数据获取", async () => {
		it("网络请求", async () => {
			assert.strictEqual(dataGet["response"], 200);
		});
		it("卡牌类型", async () => {
			const typeList = dataGet["data"]["types"];
			const propGet = Object.keys(typeList);
			const propTest = ["characterCard", "actionCard"];
			assert.deepStrictEqual(propGet, propTest);
		});
	});
	describe("数据解析", async () => {
		let itemGet;
		before(async () => {
			const itemsGet = dataGet["data"]["items"];
			itemGet = itemsGet[Object.keys(itemsGet)[0]];
		});
		it("子项检测", async () => {
			const propTest = ["characterCard", "actionCard"];
			assert.strictEqual(propTest.includes(itemGet["type"]), true);
		});
		it("icon 下载", async () => {
			const preUrl = "https://api.ambr.top/assets/UI/gcg/";
			const iconUrl = `${preUrl}${itemGet["icon"]}.png`;
			const iconGet = (await axios.get(iconUrl, { responseType: "arraybuffer" })).data;
			assert.strictEqual(iconGet.length !== 0, true);
		});
	});
});

