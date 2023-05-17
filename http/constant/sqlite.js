/**
 * @file http constant sqlite.js
 * @description SQLite 数据库相关
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

// Node
import os from "node:os";

const homeDir = os.homedir();

export const SQL_PATH = `${homeDir}\\AppData\\Roaming\\tauri-genshin\\tauri-genshin.db`;
