/**
 * 系统代理选择规则测试。
 * @since 2.7.0
 */
import { execFileSync } from "node:child_process";
import { platform } from "node:os";

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("node:child_process", () => ({ execFileSync: vi.fn() }));
vi.mock("node:os", () => ({ platform: vi.fn(() => "win32") }));

/**
 * 模拟 Windows 系统代理配置。
 * @since 2.7.0
 * @param server - 代理服务器配置
 * @param bypass - 代理例外列表
 * @param enabled - 是否启用代理
 */
function setWindowsProxy(server: string, bypass: string = "", enabled: boolean = true): void {
  vi.mocked(execFileSync).mockReturnValue(
    `    ProxyEnable    REG_DWORD    ${enabled ? "0x1" : "0x0"}\r\n` +
      `    ProxyServer    REG_SZ    ${server}\r\n` +
      `    ProxyOverride    REG_SZ    ${bypass}\r\n`,
  );
}

beforeEach(() => {
  vi.resetModules();
  vi.mocked(platform).mockReturnValue("win32");
  for (const name of ["http_proxy", "https_proxy", "all_proxy", "no_proxy"]) {
    vi.stubEnv(name, "");
    vi.stubEnv(name.toUpperCase(), "");
  }
  setWindowsProxy("127.0.0.1:7890");
});

afterEach(() => vi.unstubAllEnvs());

describe("系统代理选择", () => {
  test("共用代理用于 HTTP、HTTPS，且只读取一次注册表", async () => {
    vi.mocked(execFileSync).mockClear();
    const { default: getProxyForUrl } = await import("../core/utils/getProxyForUrl.ts");
    expect(getProxyForUrl("http://example.com")).toBe("http://127.0.0.1:7890");
    expect(getProxyForUrl(new URL("https://example.com"))).toBe("http://127.0.0.1:7890");
    expect(execFileSync).toHaveBeenCalledTimes(1);
  });

  test("分别读取 HTTP 和 HTTPS 的代理地址", async () => {
    setWindowsProxy("http=127.0.0.1:8080;https=https://proxy.example.com:8443");
    const { default: getProxyForUrl } = await import("../core/utils/getProxyForUrl.ts");
    expect(getProxyForUrl("http://example.com")).toBe("http://127.0.0.1:8080");
    expect(getProxyForUrl("https://example.com")).toBe("https://proxy.example.com:8443");
  });

  test("协议未配置时直连", async () => {
    setWindowsProxy("http=127.0.0.1:8080");
    const { default: getProxyForUrl } = await import("../core/utils/getProxyForUrl.ts");
    expect(getProxyForUrl("https://example.com")).toBe("");
  });

  test("关闭系统代理后不使用残留地址", async () => {
    setWindowsProxy("127.0.0.1:7890", "", false);
    const { default: getProxyForUrl } = await import("../core/utils/getProxyForUrl.ts");
    expect(getProxyForUrl("https://example.com")).toBe("");
  });

  test.each(["http://intranet", "https://sub.example.com", "http://127.0.0.1", "http://[::1]"])(
    "系统例外直连：%s",
    async (url) => {
      setWindowsProxy("127.0.0.1:7890", "<local>;*.example.com;127.*;[::1]");
      const { default: getProxyForUrl } = await import("../core/utils/getProxyForUrl.ts");
      expect(getProxyForUrl(url)).toBe("");
      expect(getProxyForUrl("https://other.example.net")).toBe("http://127.0.0.1:7890");
    },
  );

  test("环境变量覆盖系统代理，按协议选择", async () => {
    vi.stubEnv("HTTP_PROXY", "http://env.example.com:8080");
    vi.stubEnv("https_proxy", "http://env.example.com:8443");
    setWindowsProxy("127.0.0.1:7890", "*");
    const { default: getProxyForUrl } = await import("../core/utils/getProxyForUrl.ts");
    expect(getProxyForUrl("http://example.com")).toBe("http://env.example.com:8080");
    expect(getProxyForUrl("https://example.com")).toBe("http://env.example.com:8443");
  });

  test("ALL_PROXY 可覆盖系统代理", async () => {
    vi.stubEnv("ALL_PROXY", "env.example.com:8080");
    const { default: getProxyForUrl } = await import("../core/utils/getProxyForUrl.ts");
    expect(getProxyForUrl("https://example.com")).toBe("http://env.example.com:8080");
  });

  test("NO_PROXY 支持主机、后缀、端口及 IPv6", async () => {
    vi.stubEnv("NO_PROXY", "example.com,.example.net,example.org:8443,[::1]");
    const { default: getProxyForUrl } = await import("../core/utils/getProxyForUrl.ts");
    for (const url of [
      "https://example.com",
      "https://sub.example.net",
      "https://example.org:8443",
      "http://[::1]",
    ]) {
      expect(getProxyForUrl(url)).toBe("");
    }
    expect(getProxyForUrl("https://otherexample.com")).toBe("http://127.0.0.1:7890");
    expect(getProxyForUrl("https://example.org")).toBe("http://127.0.0.1:7890");
  });

  test("NO_PROXY 通配符同时禁用系统代理和环境代理", async () => {
    vi.stubEnv("NO_PROXY", "*");
    vi.stubEnv("HTTPS_PROXY", "http://env.example.com:8443");
    const { default: getProxyForUrl } = await import("../core/utils/getProxyForUrl.ts");
    expect(getProxyForUrl("http://example.com")).toBe("");
    expect(getProxyForUrl("https://example.com")).toBe("");
  });

  test("非 Windows 系统使用环境变量，不读取注册表", async () => {
    vi.mocked(platform).mockReturnValue("linux");
    vi.mocked(execFileSync).mockClear();
    vi.stubEnv("HTTPS_PROXY", "http://env.example.com:8443");
    const { default: getProxyForUrl } = await import("../core/utils/getProxyForUrl.ts");
    expect(getProxyForUrl("https://example.com")).toBe("http://env.example.com:8443");
    expect(getProxyForUrl("http://example.com")).toBe("");
    expect(execFileSync).not.toHaveBeenCalled();
  });

  test("注册表不可读时仍可直连", async () => {
    vi.mocked(execFileSync).mockImplementation(() => {
      throw new Error("Registry unavailable");
    });
    const { default: getProxyForUrl } = await import("../core/utils/getProxyForUrl.ts");
    expect(getProxyForUrl("https://example.com")).toBe("");
  });
});
