/**
 * @file calendar download.js
 * @description 素材日历原始数据下载
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import fs from "node:fs";
import path from "node:path";
import axios from "axios";
// TGAssistant
import pathList, { AMBER_VH } from "../../root.js";
import { consoleLogger, defaultLogger } from "../tools/logger.js";
import { dirCheck, fileExist } from "../tools/utils.js";

defaultLogger.info("[素材日历][下载] 开始执行 download.js");

// 检测保存路径是否存在
const srcJsonDir = path.resolve(pathList.src.json, "calendar");
dirCheck(srcJsonDir);

const mysUrl = "https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/get_activity_calendar?app_sn=ys_obc";
const amberUrl = `https://api.ambr.top/v2/chs/dailyDungeon?vh=${AMBER_VH}`;
const mysSavePath = path.resolve(srcJsonDir, "mys.json");
const amberSavePath = path.resolve(srcJsonDir, "amber.json");

// 下载JSON
if (!fileExist(amberSavePath)) {
	try {
		await axios.get(amberUrl).then(res => {
			const dataGet = res.data["data"];
			fs.writeFileSync(amberSavePath, JSON.stringify(dataGet, null, 2));
			defaultLogger.info("[素材日历][下载] amber.json 下载完成");
		});
	} catch (error) {
		defaultLogger.error("[素材日历][下载] amber.json 下载失败");
		defaultLogger.error(error.message);
	}
} else {
	consoleLogger.mark("[素材日历][下载] amber.json 已存在，跳过下载");
}
if (!fileExist(mysSavePath)) {
	try {
		await axios.get(mysUrl).then(res => {
			const dataGet = res.data["data"]["list"].filter(item => item.kind === "2");
			fs.writeFileSync(mysSavePath, JSON.stringify(dataGet, null, 2));
			defaultLogger.info("[素材日历][下载] mys.json 下载完成");
		});
	} catch (error) {
		defaultLogger.error("[素材日历][下载] mys.json 下载失败");
		defaultLogger.error(error.message);
	}
}else {
	consoleLogger.mark("[素材日历][下载] mys.json 已存在，跳过下载");
}
defaultLogger.info("[素材日历][下载] JSON 下载完成");
defaultLogger.info("[素材日历][下载] download.js 执行完毕");