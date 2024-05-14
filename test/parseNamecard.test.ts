/**
 * @file test/parseNamecard.test.ts
 * @description parseNamecard 测试文件
 * @since 2.2.0
 */

import { describe, expect, test } from "vitest";

import { getNamecardByName, parseNamecard } from "../core/utils/parseNamecard.ts";

describe("parseNamecard 测试", () => {
  test("测试 稻妻·雷电之纹", () => {
    console.log("测试 稻妻·雷电之纹");
    const namecard = getNamecardByName("稻妻·雷电之纹");
    expect(namecard).not.toBe(false);
    if (namecard === false) return;
    const parsed = parseNamecard(namecard.desc, namecard.index);
    console.log("解析结果：", JSON.stringify(parsed));
    const check = "名片纹饰。\n大御所将军的纹样，亦即麾下军势之旗印，「雷之三重巴」。\n";
    console.log("预期结果：", JSON.stringify(check));
    expect.soft(parsed).toStrictEqual(check);
  });
  test("测试 枫丹·奇械", () => {
    console.log("测试 枫丹·奇械");
    const namecard = getNamecardByName("枫丹·奇械");
    expect(namecard).not.toBe(false);
    if (namecard === false) return;
    const parsed = parseNamecard(namecard.desc, namecard.index);
    console.log("解析结果：", JSON.stringify(parsed));
    const check =
      "名片纹饰。\n" +
      "枫丹发条机关通用能源模块的标志。\n" +
      "关于要不要注册为商标曾经有过大讨论。\n" +
      "总之呼吁大家不要随意使用。\n";
    console.log("预期结果：", JSON.stringify(check));
    expect.soft(parsed).toStrictEqual(check);
  });
  test("测试 须弥·大梦", () => {
    console.log("测试 须弥·大梦");
    const namecard = getNamecardByName("须弥·大梦");
    expect(namecard).not.toBe(false);
    if (namecard === false) return;
    const parsed = parseNamecard(namecard.desc, namecard.index);
    console.log("解析结果：", JSON.stringify(parsed));
    const check = "名片纹饰。\n「新芽萌发的时节尚未到来，请小心将我藏起，在草木亦流连的梦境。」\n";
    console.log("预期结果：", JSON.stringify(check));
    expect.soft(parsed).toStrictEqual(check);
  });
  test("测试 成就·轨迹", () => {
    console.log("测试 成就·轨迹");
    const namecard = getNamecardByName("成就·轨迹");
    expect(namecard).not.toBe(false);
    if (namecard === false) return;
    const parsed = parseNamecard(namecard.desc, namecard.index);
    console.log("解析结果：", JSON.stringify(parsed));
    const check =
      "名片纹饰。\n" +
      "「\n" +
      "  至高的王上啊，深秘院为你呈上预测的结果：\n" +
      "  双星早已被大地的引力捕获…\n" +
      "  经历了漫长的归回周期，如今它们的轨迹将要再度交错。\n" +
      "                                              」\n";
    console.log("预期结果：", JSON.stringify(check));
    expect.soft(parsed).toStrictEqual(check);
  });
  test("测试 成就·永续", () => {
    console.log("测试 成就·永续");
    const namecard = getNamecardByName("成就·永续");
    expect(namecard).not.toBe(false);
    if (namecard === false) return;
    const parsed = parseNamecard(namecard.desc, namecard.index);
    console.log("解析结果：", JSON.stringify(parsed));
    const check =
      "名片纹饰。\n" +
      "「\n" +
      "  于螺丝与齿轮中断裂的梦已无人听取，\n" +
      "  唯有不知疲倦的机关舞者，\n" +
      "  仍用似轻羽般优雅落下的脚步，\n" +
      "  日以继夜叩问过往的回音。\n" +
      "                              」\n";
    console.log("预期结果：", JSON.stringify(check));
    expect.soft(parsed).toStrictEqual(check);
  });
  test("测试 成就·敲针", () => {
    console.log("测试 成就·敲针");
    const namecard = getNamecardByName("成就·敲针");
    expect(namecard).not.toBe(false);
    if (namecard === false) return;
    const parsed = parseNamecard(namecard.desc, namecard.index);
    console.log("解析结果：", JSON.stringify(parsed));
    const check = "名片纹饰。\n「既然这些鱼都不能吃，何苦敲针做钩呢？」\n「这你就不懂了吧。」\n";
    console.log("预期结果：", JSON.stringify(check));
    expect.soft(parsed).toStrictEqual(check);
  });
  test("测试 香菱·出锅", () => {
    console.log("测试 香菱·出锅");
    const namecard = getNamecardByName("香菱·出锅");
    expect(namecard).not.toBe(false);
    if (namecard === false) return;
    const parsed = parseNamecard(namecard.desc, namecard.index);
    console.log("解析结果：", JSON.stringify(parsed));
    const check =
      "名片纹饰。\n" +
      "快速而且准确地读出下面的话：\n" +
      "「出锅锅巴！」、「锅巴出锅！」、「锅巴出击！」、「出击锅巴！」\n";
    console.log("预期结果：", JSON.stringify(check));
    expect.soft(parsed).toStrictEqual(check);
  });
  test("测试 阿蕾奇诺·法度", () => {
    console.log("测试 阿蕾奇诺·法度");
    const namecard = getNamecardByName("阿蕾奇诺·法度");
    expect(namecard).not.toBe(false);
    if (namecard === false) return;
    const parsed = parseNamecard(namecard.desc, namecard.index);
    console.log("解析结果：", JSON.stringify(parsed));
    const check =
      "名片纹饰。\n" +
      "「父亲」大人为壁炉之家订立了严苛的法度，\n" +
      "当中有些条目甚至有些不近人情。\n" +
      "熟悉她的人，或许能借由这些规则，隐约勾勒出她从不轻言的理想吧。\n";
    console.log("预期结果：", JSON.stringify(check));
    expect.soft(parsed).toStrictEqual(check);
  });
});
