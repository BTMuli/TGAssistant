/**
 * @file core tools logger.ts
 * @description 日志工具
 * @since 2.0.0
 */

import log4js from "log4js";

import { getProjLogPath } from "../utils/getBasePaths.ts";
import { getDate } from "../utils/getDate.ts";

const logDir = getProjLogPath();

log4js.configure({
  appenders: {
    console: {
      type: "console",
      layout: {
        type: "pattern",
        pattern: "%[[%d{yyyy-MM-dd hh:mm:ss}][%p] %c%] %m",
      },
    },
    file: {
      type: "file",
      pattern: ".yyyy-MM-dd",
      filename: `${logDir}/${getDate("date")}.log`,
      daysToKeep: 7,
      layout: {
        type: "pattern",
        pattern: "[%d{yyyy-MM-dd hh:mm:ss}][%p] %c %m",
      },
    },
  },
  categories: {
    default: {
      appenders: ["console", "file"],
      level: "all",
    },
    console: {
      appenders: ["console"],
      level: "all",
    },
    file: {
      appenders: ["file"],
      level: "all",
    },
  },
});

const logger = {
  default: log4js.getLogger(),
  console: log4js.getLogger("console"),
  init: () => {
    const divider = "".padStart(40, "-");
    logger.default.info(divider);
  },
};

export default logger;
