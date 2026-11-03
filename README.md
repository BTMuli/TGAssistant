---
Author: 目棃
Description: 说明文档
Date: 2023-05-01
Update: 2026-09-23
---

> 本文档 [`Frontmatter`](https://github.com/BTMuli/MuCli#Frontmatter) 由 [MuCli](https://github.com/BTMuli/Mucli) 自动生成于 `2023-05-01 21:57:11`
>
> 更新于 `2026-09-23 13:26:01`

![](https://img.shields.io/github/last-commit/BTMuli/TGAssistant?style=for-the-badge) ![](https://img.shields.io/github/license/BTMuli/TGAssistant?style=for-the-badge)

# TGAssistant

本项目为 [TeyvatGuide](https://github.com/BTMuli/TeyvatGuide) 的辅助工具。

## 上游版本

![](https://img.shields.io/github/v/release/BTMuli/Tauri.Genshin?include_prereleases&style=for-the-badge)

适应版本：`0.11.3+`

## 网络代理

网络请求统一通过 `core/utils/request.ts` 发出，自动读取 Windows 当前用户启用的手动系统代理及例外列表（含 `<local>`），启动新进程后生效。未配置代理时直连；PAC/WPAD 自动代理暂不支持。

`HTTP_PROXY`、`HTTPS_PROXY`（以及对应的小写变量）和 `ALL_PROXY` 可覆盖系统代理，`NO_PROXY` 可指定额外的直连主机，多个主机用逗号分隔。其他系统使用这些环境变量配置代理。

## 更新与检查

```sh
pnpm auto:update            # 更新所有数据域，也可使用 pnpm auto:update all
pnpm auto:update material   # 只更新材料，参数不合法时直接报错
pnpm typecheck              # 显式使用 @typescript/native 检查类型，不生成文件
pnpm exec vitest run         # 默认离线测试，仅使用样例和本地测试服务器
```

更新入口按 download、convert、update 顺序执行当前领域存在的阶段。子进程失败时跳过该领域后续阶段，
其他领域继续运行，最后汇总失败并返回非零退出码。可选来源降级仍沿用组件自身规则，产物继续通过 Git 差异审阅。
更新结束后不再自动格式化全仓；需要时显式运行 `pnpm prettier`、`pnpm lint:fix`，局部修改优先限定文件范围。

material 会先从 `repos/Snap.Metadata/Genshin/CHS/` 同步材料及角色 Metadata，再获取其他来源，
单独更新与全量更新使用相同的输入准备顺序，食谱关系不依赖预先更新 character。来源不可用时尝试本地缓存，
必需材料读取失败则终止该阶段。角色与日历的业务时间统一按 `Asia/Shanghai` 输出。

## 复制到 TeyvatGuide

```sh
pnpm move                          # 默认复制到相邻的 TeyvatGuide 仓库
pnpm move "D:/Code/App/TeyvatGuide"  # 或指定目标根目录
```

复制前输出目标绝对路径，并要求目标已有 `src/data` 和 `public` 目录。数据复制到 `src/data`，
资源沿用 `public/icon`、`public/WIKI` 的布局，覆盖同名文件并保留目标中的其他文件。

## 显式联网调试

以下脚本不会被默认测试收集，仅在需要真实网络或账号时手动运行。账号脚本读取本机 Cookie；
`getUserCollect.ts` 还会从本机 TeyvatGuide 数据库刷新 Cookie 缓存。调试只输出状态码、计数或验证结果。

```sh
pnpm exec tsx scripts/debug/genAuthkey.ts <游戏UID>
pnpm exec tsx scripts/debug/getUserCollect.ts
pnpm exec tsx scripts/debug/getDeviceFP.ts
pnpm exec tsx scripts/debug/getBiliVideo.ts
```

## 仓库概况

![Status](https://repobeats.axiom.co/api/embed/24b7ed9ab5282403bb47ac9cb4223135905caf1a.svg "Repobeats analytics image")

## LICENSE

项目基于 [MIT](LICENSE) 协议开源。

应用版本号遵循 [Semantic Versioning 2.0.0](https://semver.org/lang/zh-CN/) 规范。
