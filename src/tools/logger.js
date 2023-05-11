/**
 * @file tools logger.js
 * @description 日志记录
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import log4js from "log4js";
// TGAssistant
import pathList from "../../root.js";
import getDate from "./getDate.js";

// 日志记录器
const logger = log4js.getLogger();

// 日志记录器配置
log4js.configure({
	appenders: {
		console: {
			type: "console",
			layout: {
				type: "pattern",
				pattern: "%[[%d{yyyy-MM-dd hh:mm:ss}][%p] %c -%] %m",
			}
		},
		file: {
			type: "file",
			pattern: ".yyyy-MM-dd",
			filename: `${pathList.log}/${getDate()}.log`,
			daysToKeep: 7,
			layout: {
				type: "pattern",
				pattern: "[%d{yyyy-MM-dd hh:mm:ss}][%p] %c - %m",
			}
		}
	},
	categories: {
		default: {
			appenders: ["console", "file"],
			level: "all",
		},
	},
});

export default logger;
