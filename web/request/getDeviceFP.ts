/**
 * @file web request getDeviceFP
 * @description 获取设备指纹
 * @since 2.0.0
 */

import axios from "axios";

import { getRandomString } from "../utils/getDS.ts";
import { getMinHeaderMobile } from "../utils/getHeader.ts";

/**
 * @description 获取设备指纹
 * @since 2.0.0
 * @param {string} model 设备型号
 * @param {string} seedID 种子 ID
 * @param {string} seedTime 种子时间
 * @returns {Promise<void>} 无返回值
 */
export async function getDeviceFP(model: string, seedID: string, seedTime: string): Promise<any> {
  const deviceId = getRandomString(16);
  const deviceFPHeader: TGWeb.Header.DeviceFP = {
    cpuType: "arm64-v8a",
    romCapacity: "512",
    productName: model,
    romRemain: "256",
    manufacturer: "Xiaomi",
    appMemory: "512",
    hostname: "dg02-pool03-kvm87",
    screenSize: "1080x1920",
    osVersion: "13",
    aaid: "",
    vendor: "中国移动",
    accelerometer: "true",
    buildTags: "release-keys",
    model,
    brand: "Xiaomi",
    oaid: "",
    hardware: "qcom",
    deviceType: "OP5913L1",
    devId: "unknown",
    serialNumber: "unknown",
    buildTime: "1588876800000", // 2020-05-08
    buildUser: "root",
    ramCapacity: "2048",
    magnetometer: "true",
    display: `OP5913L1-user ${model} 10 QKQ1.190825.002 V12.0.1.0.QFJCNXM release-keys`,
    ramRemain: "1024",
    deviceInfo: "unknown",
    gyroscope: "true",
    vaid: "",
    buildType: "user",
    sdkVersion: "29",
    board: "sdm660",
  };
  const url = "https://public-data-api.mihoyo.com/device-fp/api/getFp";
  const data = {
    device_id: deviceId,
    seed_id: seedID,
    platform: "2",
    seed_time: seedTime, // 2020-05-08
    ext_fields: JSON.stringify(deviceFPHeader),
    app_name: "bbs_cn",
    bbs_device_id: deviceId,
    device_fp: getRandomString(13, "hex"),
  };
  const header = getMinHeaderMobile();
  return await axios.post(url, data, { headers: header }).then((res) => {
    return res.data;
  });
}
