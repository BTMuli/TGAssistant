/**
 * 统一请求入口的本地代理集成测试。
 * @since 2.7.0
 */
import { execFileSync } from "node:child_process";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { connect, type Socket } from "node:net";
import { once } from "node:events";

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("node:child_process", () => ({ execFileSync: vi.fn() }));
vi.mock("node:os", () => ({ platform: () => "win32" }));

const proxied: Array<string> = [];
const sockets = new Set<Socket>();
let upstreamPort: number;
let proxyPort: number;
let requestClient: typeof import("../core/utils/request.ts");

/**
 * 返回请求内容，或重定向到本地直连地址。
 * @since 2.7.0
 * @param req - 本地测试请求
 * @param res - 本地测试响应
 */
async function respond(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url || "/", "http://upstream.invalid");
  if (url.pathname === "/redirect") {
    res.writeHead(302, { location: `http://127.0.0.1:${upstreamPort}/final` }).end();
    return;
  }
  const chunks: Array<Buffer> = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  res.setHeader("content-type", "application/json");
  res.end(
    JSON.stringify({
      path: url.pathname + url.search,
      method: req.method,
      body: Buffer.concat(chunks).toString(),
      header: req.headers["x-request-test"],
    }),
  );
}

const upstream = createServer(respond);
const proxy = createServer((req, res) => {
  proxied.push(req.url || "");
  return respond(req, res);
});
proxy.on("connect", (req, socket, head) => {
  proxied.push(req.url || "");
  if (req.url?.endsWith(":443")) {
    socket.end("HTTP/1.1 502 Bad Gateway\r\nConnection: close\r\n\r\n");
    return;
  }
  const target = connect(upstreamPort, "127.0.0.1", () => {
    socket.write("HTTP/1.1 200 Connection Established\r\n\r\n");
    if (head.length) target.write(head);
    socket.pipe(target).pipe(socket);
  });
  sockets.add(target);
  target.on("close", () => sockets.delete(target));
  target.on("error", () => socket.destroy());
  socket.on("error", () => target.destroy());
  socket.on("close", () => target.destroy());
});

beforeAll(async () => {
  for (const server of [upstream, proxy]) {
    server.on("connection", (socket) => {
      sockets.add(socket);
      socket.on("close", () => sockets.delete(socket));
    });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
  }
  const upstreamAddress = upstream.address();
  const proxyAddress = proxy.address();
  if (!upstreamAddress || typeof upstreamAddress === "string") throw new Error("No upstream");
  if (!proxyAddress || typeof proxyAddress === "string") throw new Error("No proxy");
  upstreamPort = upstreamAddress.port;
  proxyPort = proxyAddress.port;
});

beforeEach(async () => {
  vi.resetModules();
  proxied.length = 0;
  for (const name of ["http_proxy", "https_proxy", "all_proxy", "no_proxy"]) {
    vi.stubEnv(name, "");
    vi.stubEnv(name.toUpperCase(), "");
  }
  vi.mocked(execFileSync).mockReturnValue(
    `    ProxyEnable    REG_DWORD    0x1\r\n` +
      `    ProxyServer    REG_SZ    127.0.0.1:${proxyPort}\r\n` +
      "    ProxyOverride    REG_SZ    127.0.0.1\r\n",
  );
  requestClient = await import("../core/utils/request.ts");
});

afterEach(() => vi.unstubAllEnvs());
afterAll(async () => {
  for (const socket of sockets) socket.destroy();
  await Promise.all(
    [upstream, proxy].map((server) => new Promise<void>((r) => server.close(() => r()))),
  );
});

describe.each(["fetch", "axios"])("%s 网络代理", (client) => {
  test("HTTP 通过系统代理，保留请求参数、头和正文", async () => {
    const { default: axios, fetch } = requestClient;
    const url = "http://upstream.invalid/echo?test=1";
    const headers = { "x-request-test": "proxy" };
    const data =
      client === "fetch"
        ? await fetch(url, { method: "POST", headers, body: "test-body" }).then((r) => r.json())
        : await axios.post(url, "test-body", { headers }).then((r) => r.data);
    expect(data).toEqual({
      path: "/echo?test=1",
      method: "POST",
      body: "test-body",
      header: "proxy",
    });
    expect(proxied).toHaveLength(1);
    expect(proxied[0]).toContain("upstream.invalid");
  });

  test("HTTPS 使用代理的 CONNECT 隧道", async () => {
    const { default: axios, fetch } = requestClient;
    const url = "https://upstream.invalid/echo";
    const request = client === "fetch" ? fetch(url) : axios.get(url);
    await expect(request).rejects.toThrow();
    expect(proxied).toEqual(["upstream.invalid:443"]);
  });

  test("重定向到系统例外地址时切换直连", async () => {
    const { default: axios, fetch } = requestClient;
    const url = "http://upstream.invalid/redirect";
    const data =
      client === "fetch"
        ? await fetch(url).then((r) => r.json())
        : await axios.get(url).then((r) => r.data);
    expect(data.path).toBe("/final");
    expect(proxied).toHaveLength(1);
  });

  test("NO_PROXY 可绕过系统代理", async () => {
    vi.stubEnv("NO_PROXY", "127.0.0.1");
    vi.mocked(execFileSync).mockReturnValue(
      `    ProxyEnable    REG_DWORD    0x1\r\n` +
        `    ProxyServer    REG_SZ    127.0.0.1:${proxyPort}\r\n`,
    );
    vi.resetModules();
    const { default: axios, fetch } = await import("../core/utils/request.ts");
    const url = `http://127.0.0.1:${upstreamPort}/direct`;
    const data =
      client === "fetch"
        ? await fetch(url).then((r) => r.json())
        : await axios.get(url).then((r) => r.data);
    expect(data.path).toBe("/direct");
    expect(proxied).toEqual([]);
  });
});
