/**
 * @file core tools counter
 * @description 计数器
 * @since 2.0.1
 */

import chalk from "chalk";

import logger from "./logger.ts";

/**
 * @description 计数器 class
 * @since 2.0.1
 * @class Counter
 */
class Counter {
  protected prefix: string = "";
  protected total: number = 0;
  protected fail: number = 0;
  protected success: number = 0;
  protected skip: number = 0;
  protected time: number = 0;
  protected cost: number = 0; // 总耗时

  constructor() {
    this.prefix = "";
    this.total = 0;
    this.fail = 0;
    this.success = 0;
    this.skip = 0;
    this.time = 0;
    this.cost = 0;
  }

  /**
   * @description 初始化-设置前缀
   * @since 2.0.1
   * @param {string} prefix 前缀
   * @return {void} 无返回值
   */
  public Init(prefix: string): void {
    this.prefix = prefix;
    this.cost = 0;
    this.time = new Date().getTime();
  }

  /**
   * @description 增加计数器总数
   * @since 2.0.0
   * @param {number} addNum 增加的数量
   * @return {void} 无返回值
   */
  public addTotal(addNum?: number): void {
    this.total += addNum ?? 1;
  }

  /**
   * @description 计数器失败
   * @since 2.4.0
   * @param {number} failNum 失败的数量，默认为 1
   * @return {void} 无返回值
   */
  public Fail(failNum?: number): void {
    this.fail += failNum ?? 1;
  }

  /**
   * @description 计数器成功
   * @since 2.0.0
   * @return {void} 无返回值
   */
  public Success(): void {
    this.success++;
  }

  /**
   * @description 计数器跳过
   * @since 2.0.0
   * @param {[number]} skipNum 跳过的数量，默认为 1
   * @return {void} 无返回值
   */
  public Skip(skipNum?: number): void {
    this.skip += skipNum ?? 1;
  }

  /**
   * @description 结束
   * @since 2.0.0
   * @return {void} 无返回值
   */
  public End(): void {
    const endTime = new Date().getTime();
    this.time = endTime - this.time;
    this.cost += this.time;
  }

  /**
   * @description 全部结束
   * @since 2.0.1
   * @param {boolean} write 是否输出
   * @return {void} 无返回值
   */
  public EndAll(write: boolean = true): void {
    const str = `${this.prefix} 总计耗时 ${(this.cost / 1000).toFixed(2)}s`;
    if (write !== undefined && !write) logger.console.info(str);
    else logger.default.info(str);
  }

  /**
   * @description 重置计数器
   * @since 2.0.0
   * @param {number} total 总数
   * @return {void} 无返回值
   */
  public Reset(total?: number): void {
    this.total = total ?? 0;
    this.fail = 0;
    this.success = 0;
    this.skip = 0;
    this.time = new Date().getTime();
  }

  /**
   * @description 获取 Total
   * @since 2.0.0
   * @param {boolean} isOutput 是否输出
   * @return {string} Total
   */
  public getTotal(isOutput: boolean = true): string | number {
    if (isOutput) return chalk.blue(this.total.toString());
    return this.total;
  }

  /**
   * @description 获取 Fail
   * @since 2.0.0
   * @param {boolean} isOutput 是否输出
   * @return {string} Fail
   */
  public getFail(isOutput: boolean = true): string | number {
    if (isOutput) return chalk.red(this.fail.toString());
    return this.fail;
  }

  /**
   * @description 获取 Success
   * @since 2.0.0
   * @param {boolean} isOutput 是否输出
   * @return {string} Success
   */
  public getSuccess(isOutput: boolean = true): string | number {
    if (isOutput) return chalk.green(this.success.toString());
    return this.success;
  }

  /**
   * @description 获取 Skip
   * @since 2.0.0
   * @param {boolean} isOutput 是否输出
   * @return {string} Skip
   */
  public getSkip(isOutput: boolean = true): string | number {
    if (isOutput) return chalk.yellow(this.skip.toString());
    return this.skip;
  }

  /**
   * @description 获取 Time
   * @since 2.0.0
   * @description isOutput 为 false 时返回秒数
   * @return {string} Time
   */
  public getTime(): string;
  public getTime(isOutput: false): number;
  public getTime(isOutput?: boolean): unknown {
    if (isOutput !== undefined && !isOutput) return this.time;
    return (this.time / 1000).toFixed(2) + "s";
  }

  /**
   * @description 输出
   * @since 2.0.0
   * @return {void} 无返回值
   */
  public Output(): void {
    logger.console.info(`${this.prefix} 总计: ${this.getTotal()}`);
    logger.console.info(`${this.prefix} 成功: ${this.getSuccess()}`);
    logger.console.info(`${this.prefix} 跳过: ${this.getSkip()}`);
    logger.console.info(`${this.prefix} 失败: ${this.getFail()}`);
  }
}

export default new Counter();
