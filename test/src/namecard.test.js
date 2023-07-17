/**
 * @file test src namecard.test.js
 * @description 测试 cheerio 解析 html 的功能是否正常工作
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import assert from "assert";
import axios from "axios";
import { load } from "cheerio";
import { before, describe, it } from "mocha";

describe("测试名片数据获取", async () => {
  let html;
  before(async () => {
    const testUrl = "https://genshin.honeyhunterworld.com/i_n210163/?lang=CHS";
    html = (await axios.get(testUrl)).data;
  });
  it("测试 html 内容获取", async () => {
    assert.strictEqual(html.startsWith("<!DOCTYPE html>"), true);
  });
  it("测试名片 table 内容获取", async () => {
    const tbSelector =
      "body > div.wp-site-blocks > div.wp-block-columns > div:nth-child(3) > div.entry-content.wp-block-post-content > table";
    const loadDom = load(html);
    const trs = loadDom(tbSelector).find("tr");
    const nameCard = {
      name: "",
      description: "",
      source: "",
    };
    trs.each((index, tr) => {
      const tds = loadDom(tr).find("td");
      if (tds.length === 3) {
        if (loadDom(tds[1]).text().trim() === "Name") {
          nameCard.name = loadDom(tds[2]).text().trim();
        }
      }
      if (tds.length === 2) {
        const tdsFirst = loadDom(tds[0]).text().trim();
        if (tdsFirst.startsWith("Description")) {
          nameCard.description = loadDom(tds[1]).text().trim();
        }
        if (tdsFirst.startsWith("Item Source")) {
          nameCard.source = loadDom(tds[1]).text().trim();
        }
      }
    });
    assert.strictEqual(nameCard.name, "纪行·秘典");
    assert.strictEqual(
      nameCard.description,
      "名片纹饰。勿忘那些与友人相伴游戏的岁月，勿忘那些不必忧虑未来的时光。",
    );
    assert.strictEqual(nameCard.source, "纪行系统奖励获取。");
  });
});
