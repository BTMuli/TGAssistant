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

## 仓库概况

![Status](https://repobeats.axiom.co/api/embed/24b7ed9ab5282403bb47ac9cb4223135905caf1a.svg "Repobeats analytics image")

## LICENSE

项目基于 [MIT](LICENSE) 协议开源。

应用版本号遵循 [Semantic Versioning 2.0.0](https://semver.org/lang/zh-CN/) 规范。
