/**
 * 计数器
 * @since 2.5.0
 */

import chalk from "chalk";

import logger from "./logger.ts";

class Counter {
  /** 输出前缀 */
  protected prefix: string = "";
  /** 总计数 */
  protected total: number = 0;
  /** 失败计数 */
  protected fail: number = 0;
  /** 成功计数 */
  protected success: number = 0;
  /** 跳过计数 */
  protected skip: number = 0;
  /** 开始时间 */
  protected startTime: number = 0;
  /** 总耗时 */
  protected cost: number = 0;

  constructor() {
    this.prefix = "";
    this.total = 0;
    this.fail = 0;
    this.success = 0;
    this.skip = 0;
    this.startTime = new Date().getTime();
    this.cost = 0;
  }

  /**
   * 初始化-设置前缀
   * @since 2.0.1
   * @param {string} prefix 前缀
   * @return {void} 无返回值
   */
  public Init(prefix: string): void {
    this.prefix = prefix;
    this.cost = 0;
    this.startTime = new Date().getTime();
  }

  /**
   * 增加计数器总数
   * @since 2.0.0
   * @param {number} addNum 增加的数量
   * @return {void} 无返回值
   */
  public addTotal(addNum?: number): void {
    this.total += addNum ?? 1;
  }

  /**
   * 计数器失败
   * @since 2.4.0
   * @param {number} failNum 失败的数量，默认为 1
   * @return {void} 无返回值
   */
  public Fail(failNum?: number): void {
    this.fail += failNum ?? 1;
  }

  /**
   * 计数器成功
   * @since 2.0.0
   * @return {void} 无返回值
   */
  public Success(): void {
    this.success++;
  }

  /**
   * 计数器跳过
   * @since 2.0.0
   * @param {number} [skipNum] 跳过的数量，默认为 1
   * @return {void} 无返回值
   */
  public Skip(skipNum?: number): void {
    this.skip += skipNum ?? 1;
  }

  /**
   * 结束
   * @since 2.0.0
   * @return {void} 无返回值
   */
  public End(): void {
    const endTime = new Date().getTime();
    this.cost += endTime - this.startTime;
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
   * 重置计数器
   * @since 2.0.0
   * @param {number} total 总数
   * @return {void} 无返回值
   */
  public Reset(total?: number): void {
    this.total = total ?? 0;
    this.fail = 0;
    this.success = 0;
    this.skip = 0;
    this.startTime = new Date().getTime();
  }

  /**
   * 获取 Total
   * @since 2.0.0
   * @param {boolean} isOutput 是否输出
   * @return {string} Total
   */
  public getTotal(isOutput: boolean = true): string | number {
    if (isOutput) return chalk.blue(this.total.toString());
    return this.total;
  }

  /**
   * 获取 Fail
   * @since 2.0.0
   * @param {boolean} isOutput 是否输出
   * @return {string} Fail
   */
  public getFail(isOutput: boolean = true): string | number {
    if (isOutput) return chalk.red(this.fail.toString());
    return this.fail;
  }

  /**
   * 获取 Success
   * @since 2.0.0
   * @param {boolean} isOutput 是否输出
   * @return {string} Success
   */
  public getSuccess(isOutput: boolean = true): string | number {
    if (isOutput) return chalk.green(this.success.toString());
    return this.success;
  }

  /**
   * 获取 Skip
   * @since 2.0.0
   * @param {boolean} isOutput 是否输出
   * @return {string} Skip
   */
  public getSkip(isOutput: boolean = true): string | number {
    if (isOutput) return chalk.yellow(this.skip.toString());
    return this.skip;
  }

  /**
   * 获取 Time
   * @since 2.0.0
   * @description isOutput 为 false 时返回秒数
   * @return {string} Time
   */
  public getTime(): string;
  public getTime(isOutput: false): number;
  public getTime(isOutput?: boolean): unknown {
    if (isOutput !== undefined && !isOutput) return this.cost;
    return (this.cost / 1000).toFixed(2) + "s";
  }

  /**
   * 输出
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
