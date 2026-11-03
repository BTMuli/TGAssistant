/**
 * 按环境变量和 Windows 系统设置选择请求代理。
 * @since 2.7.0
 */
import { execFileSync } from "node:child_process";
import { platform } from "node:os";

/**
 * 进程启动时读取一次 Windows 手动代理，避免每次请求都启动子进程。
 * @since 2.7.0
 * @returns 启用的代理配置，未配置或读取失败时为空对象
 */
function readWindowsProxy(): Record<string, string> {
  if (platform() !== "win32") return {};
  try {
    const output = execFileSync(
      "reg.exe",
      ["query", "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings"],
      { encoding: "utf8", windowsHide: true, timeout: 5000, stdio: ["ignore", "pipe", "ignore"] },
    );
    const settings: Record<string, string> = {};
    for (const line of output.split(/\r?\n/)) {
      const match = line.match(/^\s*(ProxyEnable|ProxyServer|ProxyOverride)\s+REG_\w+\s+(.*)$/);
      if (match) settings[match[1]] = match[2].trim();
    }
    return Number(settings.ProxyEnable) === 1 ? settings : {};
  } catch {
    return {};
  }
}

const windowsProxy = readWindowsProxy();

/**
 * 匹配代理例外中的主机、端口、通配符及 Windows 本地地址规则。
 * @since 2.7.0
 * @param url - 请求地址
 * @param rule - 代理例外规则
 * @param windows - 是否使用 Windows 系统代理的例外语义
 * @returns 是否命中例外
 */
function matchesBypass(url: URL, rule: string, windows: boolean = false): boolean {
  if (!rule) return false;
  if (windows && rule.toLowerCase() === "<local>") return !url.hostname.includes(".");
  const match = rule.match(/^(.+):(\d+)$/);
  let hostname = match ? match[1] : rule;
  const port = url.port || (url.protocol === "https:" ? "443" : "80");
  if (match && match[2] !== port) return false;
  if (!windows && hostname.startsWith(".")) hostname = `*${hostname}`;
  const pattern = hostname.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(`^${pattern}$`, "i").test(url.hostname);
}

/**
 * 优先选择环境变量代理，无代理或命中例外时使用直连。
 * @since 2.7.0
 * @param input - 请求地址
 * @returns 代理地址，空字符串表示直连
 */
export default function getProxyForUrl(input: string | URL): string {
  const url = new URL(input);
  const env = process.env;
  const noProxy = env.no_proxy || env.NO_PROXY || "";
  if (noProxy.split(/[,\s]+/).some((rule) => matchesBypass(url, rule))) return "";
  const protocol = url.protocol.slice(0, -1);
  let proxy = env[`${protocol}_proxy`] || env[`${protocol.toUpperCase()}_PROXY`];
  proxy ||= env.all_proxy || env.ALL_PROXY;
  if (!proxy) {
    const bypass = windowsProxy.ProxyOverride || "";
    if (bypass.split(";").some((rule) => matchesBypass(url, rule.trim(), true))) return "";
    const server = windowsProxy.ProxyServer || "";
    proxy = /^\w+=/.test(server)
      ? server
          .split(";")
          .map((entry) => entry.trim())
          .find((entry) => entry.startsWith(`${protocol}=`))
          ?.slice(protocol.length + 1)
      : server;
  }
  if (!proxy) return "";
  return proxy.includes("://") ? proxy : `http://${proxy}`;
}
