/**
 * 统一的网络请求入口，自动使用环境变量或 Windows 系统代理。
 * @since 2.7.0
 */
import axios from "axios";
import { ProxyAgent } from "proxy-agent";
import { Agent, Pool, ProxyAgent as FetchProxyAgent } from "undici";

import getProxyForUrl from "./getProxyForUrl.ts";

const agent = new ProxyAgent({ getProxyForUrl });
const dispatcher = new Agent({
  factory(origin, options) {
    const proxy = getProxyForUrl(origin);
    return proxy ? new FetchProxyAgent({ ...options, uri: proxy }) : new Pool(origin, options);
  },
});

/**
 * 使用同一套代理选择规则，保留原生 fetch 的参数和返回值。
 * @since 2.7.0
 * @param input - 请求地址或请求对象
 * @param init - 原生 fetch 请求选项
 * @returns 请求响应
 */
export function fetch(
  input: Parameters<typeof globalThis.fetch>[0],
  init?: Parameters<typeof globalThis.fetch>[1],
): ReturnType<typeof globalThis.fetch> {
  // 内置 fetch 支持 Undici dispatcher；不同 Node.js 版本的声明可能来自不同 Undici 主版本。
  const options = <Parameters<typeof globalThis.fetch>[1]>{ ...init, dispatcher };
  return globalThis.fetch(input, options);
}

export default axios.create({ httpAgent: agent, httpsAgent: agent, proxy: false });
