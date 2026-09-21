# Agent 工作约定

本文件适用于整个仓库。修改代码前，先阅读相关目录的现有实现和配置；若本文件与实际配置不一致，以配置和代码为准，并同步修订本文档。

## 项目结构与数据流

- 本项目是 TeyvatGuide 的辅助数据工具，使用 Node.js、TypeScript、ES Module 和 pnpm。`package.json` 要求 Node.js `>=22.9.0`，包管理器为 `pnpm@12.5.1`。
- `core/components/<数据域>/` 负责数据处理。常见文件为 `constant.ts`（路径及常量）、`download.ts`（获取原始数据或图片）、`convert.ts`（转换输出）、`utils.ts`（局部工具）；有些数据域还包含 `update.ts`。新增处理流程时先沿用相邻组件的模式。
- `core/plugins/` 封装上游数据源，`core/utils/` 和 `core/tools/` 提供共享路径、文件、日志与计数工具，`core/types/` 和各插件的 `types/` 保存类型声明。`web/` 是请求与鉴权相关代码，`test/` 是 Vitest 测试。
- 路径通过 `core/utils/getBasePaths.ts` 统一定位。原始数据通常在 `source/data/src/`，转换结果在 `source/data/out/`；资源文件在 `source/assets/`，临时文件在 `source/temp/`。`source/data/out/` 中有已跟踪的 JSON，改动它们前确认确实需要更新产物。
- `tsconfig.json` 开启 `strict`，定义了 `@core/*`、`@comp/*`、`@amos/*`、`@hakushi/*`、`@hutao/*`、`@nanoka/*`、`@yatta/*`、`@utils/*`、`@tools/*` 路径别名。保持现有模块的导入习惯；不要为局部修改批量改写导入。

## 代码与格式约束

- 以 `eslint.config.mjs`、`eslint/` 下的规则和 `.prettierrc.yml` 为准。Prettier 使用双引号、分号、2 空格缩进、100 字符行宽，箭头函数参数始终加括号。
- TypeScript 断言使用尖括号形式（如 `<Foo>value`）；遵守 `@typescript-eslint/no-import-type-side-effects`、`no-unused-expressions` 等启用规则。不要把 ESLint 中已关闭的规则写成额外要求。
- JSON 的顶层键顺序有专门规则：`package.json`、`tsconfig.json` 和 `source/data/out/WIKI/character/**/*.json` 分别受 `eslint/jsonEslint.js` 约束；其他匹配的输出 JSON 与 `core/**/*.json` 顶层键按升序排序，不保留尾随逗号。YAML 使用 2 空格缩进、双引号优先、键排序规则。
- 保持现有的类型声明、函数文档、日志和错误处理风格。扩展数据结构时检查对应的 `.d.ts`、转换逻辑与下游输出，不要只修改下载端。
- 不手改被忽略的缓存、日志或临时资源：`node_modules/`、`logs/`、`source/data/src/`、`source/data/http/`、`source/assets/`、`source/temp/`、`repos/`。若需要提交转换结果，检查差异中是否混入上游数据的无关波动。

## 脚本及其副作用

- `pnpm auto:update` 执行 `scripts/updateAll.ts`，依次运行各组件存在的 `download.ts`、`convert.ts`、`update.ts`。可用 `pnpm exec tsx scripts/updateAll.ts <数据域>` 限定到一个支持的数据域。它会请求外部数据、写入资源及 JSON，最后执行全仓 Prettier 和 ESLint 修复；只在任务需要更新数据时运行，并在运行前检查工作区状态。脚本会记录子进程错误后继续执行，不能仅凭脚本退出码判断全部组件成功，应检查日志和产物差异。
- `pnpm resize` 读取 `source/temp/src/` 的 PNG，在 `source/temp/out/` 生成 WebP。`pnpm move` 会把输出复制到 `scripts/moveSrc.ts` 中写死的本机 TeyvatGuide 路径；运行前先核对目标路径。`scripts/genStoreIcons.ts` 会覆盖 `scripts/output/` 中的图标；按需直接运行。
- `pnpm prettier` 与 `pnpm lint:fix` 都会修改文件，且默认作用于全仓；处理局部任务时优先对目标文件运行 `pnpm exec prettier --check <文件>`、`pnpm exec eslint <文件>`，确需修复时也限定文件范围。
- `web/utils/readCookie.ts` 会读取本机数据库并写入 `source/data/http/cookie.json`。不得将真实 Cookie、令牌、数据库内容或请求头写入测试、日志、文档和提交内容。

## 验证与交付

- 对修改过的 TypeScript、JSON、YAML 文件运行适用的定向 ESLint 检查；对修改过的可格式化文件运行 Prettier 检查。需要全仓验证时运行 `pnpm lint:check`。提交前 `.husky/pre-commit` 会运行 `pnpm lint-staged`，其中 TypeScript 还会经过 oxlint。
- 测试由 `vitest.config.ts` 收集 `test/*.test.ts`；项目没有 `test` npm 脚本，运行相关测试用 `pnpm exec vitest run <测试文件>`，全部测试用 `pnpm exec vitest run`。新增行为测试应覆盖可观察的输入输出，避免依赖真实账号或网络。
- 只提交任务相关的源码、类型、测试和必要产物。工作区已有改动属于当前用户；不要覆盖、清理或顺手格式化不相关文件。交付时说明运行过的检查及未运行的数据更新脚本。
