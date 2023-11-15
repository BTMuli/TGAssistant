/**
 * @file web types header.d.ts
 * @description 请求头类型定义文件
 * @since 2.0.0
 */

/**
 * @description 请求头类型 namespace
 * @since 2.0.0
 * @namespace TGWeb.Header
 * @memberof TGWeb
 */
declare namespace TGWeb.Header {
  /**
   * @description 请求头-用于获取设备指纹
   * @since 2.0.0
   * @interface DeviceFP
   * @memberof TGWeb.Header
   * @property {string} cpuType - CPU 类型
   * @property {string} romCapacity - ROM 容量
   * @property {string} productName - 产品名称
   * @property {string} romRemain - ROM 剩余容量
   * @property {string} manufacturer - 制造商
   * @property {string} appMemory - APP 内存
   * @property {string} hostname - 主机名
   * @property {string} screenSize - 屏幕尺寸
   * @property {string} osVersion - 操作系统版本
   * @property {string} aaid - AAID
   * @property {string} vendor - 厂商
   * @property {string} accelerometer - 加速度计
   * @property {string} buildTags - 构建标签
   * @property {string} model - 型号
   * @property {string} brand - 品牌
   * @property {string} oaid - OAID
   * @property {string} hardware - 硬件
   * @property {string} deviceType - 设备类型
   * @property {string} devId - 设备 ID
   * @property {string} serialNumber - 序列号
   * @property {string} buildTime - 构建时间
   * @property {string} buildUser - 构建用户
   * @property {string} ramCapacity - RAM 容量
   * @property {string} magnetometer - 磁力计
   * @property {string} display - 显示器
   * @property {string} ramRemain - RAM 剩余容量
   * @property {string} deviceInfo - 设备信息
   * @property {string} gyroscope - 陀螺仪
   * @property {string} vaid - VAID
   * @property {string} buildType - 构建类型
   * @property {string} sdkVersion - SDK 版本
   * @property {string} board - 主板
   * @return DeviceFP
   */
  interface DeviceFP {
    cpuType: string;
    romCapacity: string;
    productName: string;
    romRemain: string;
    manufacturer: string;
    appMemory: string;
    hostname: string;
    screenSize: string;
    osVersion: string;
    aaid: string;
    vendor: string;
    accelerometer: string;
    buildTags: string;
    model: string;
    brand: string;
    oaid: string;
    hardware: string;
    deviceType: string;
    devId: string;
    serialNumber: string;
    buildTime: string;
    buildUser: string;
    ramCapacity: string;
    magnetometer: string;
    display: string;
    ramRemain: string;
    deviceInfo: string;
    gyroscope: string;
    vaid: string;
    buildType: string;
    sdkVersion: string;
    board: string;
  }
}
