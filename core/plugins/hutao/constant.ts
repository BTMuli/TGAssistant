/**
 * @file core/plugins/hutao/constant.ts
 * @description 一些关于胡桃的常量
 * @since 2.4.0
 */
import path from "node:path";

import { getProjDataPath } from "@core/utils/getBasePaths.ts";

export const jsonDir: Readonly<string> = getProjDataPath("data", "src", "hutao");
export const jsonMeta: Readonly<string> = path.join(jsonDir, "Meta.json");
