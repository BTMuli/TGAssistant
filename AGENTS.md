# Agent 工作约定

本文件适用于整个仓库。修改代码前，先阅读相关目录的现有实现和配置；若本文件与实际配置不一致，以配置和代码为准，并同步修订本文档。

## 项目结构与数据流

- 本项目是 TeyvatGuide 的辅助数据工具，使用 Node.js、TypeScript、ES Module 和 pnpm。`package.json` 要求 Node.js `>=26.0.0`，包管理器为 `pnpm@12.16.1`。
- `core/components/<数据域>/` 负责数据处理。常见文件为 `constant.ts`（路径及常量）、`download.ts`（获取原始数据或图片）、`convert.ts`（转换输出）、`utils.ts`（局部工具）；有些数据域还包含 `update.ts`。新增处理流程时先沿用相邻组件的模式。
- `core/plugins/` 封装上游数据源，`core/utils/` 和 `core/tools/` 提供共享路径、文件、日志与计数工具，`core/types/` 和各插件的 `types/` 保存类型声明。`web/` 是请求与鉴权相关代码，`test/` 是 Vitest 测试。
- 路径通过 `core/utils/getBasePaths.ts` 统一定位。原始数据通常在 `source/data/src/`，转换结果在 `source/data/out/`；资源文件在 `source/assets/`，临时文件在 `source/temp/`。`source/data/out/` 中有已跟踪的 JSON，改动它们前确认确实需要更新产物。
- `tsconfig.json` 开启 `strict`，定义了 `@core/*`、`@comp/*`、`@amos/*`、`@hakushi/*`、`@hutao/*`、`@nanoka/*`、`@yatta/*`、`@utils/*`、`@tools/*` 路径别名。保持现有模块的导入习惯；不要为局部修改批量改写导入。
- `pnpm typecheck` 显式调用 `@typescript/native` 的编译器，使用同一份 `tsconfig.json` 的 Bundler 模块解析和 `noEmit`，不生成声明或构建缓存。

## 代码与格式约束

- 以 `eslint.config.mjs`、`eslint/` 下的规则和 `.prettierrc.yml` 为准。Prettier 使用双引号、分号、2 空格缩进、100 字符行宽，箭头函数参数始终加括号。
- TypeScript 断言使用尖括号形式（如 `<Foo>value`）；遵守 `@typescript-eslint/no-import-type-side-effects`、`no-unused-expressions` 等启用规则。不把已关闭或未配置的规则描述为 ESLint 强制要求；新增风格约定见下文。
- JSON 的顶层键顺序有专门规则：`package.json`、`tsconfig.json` 和 `source/data/out/WIKI/character/**/*.json` 分别受 `eslint/jsonEslint.js` 约束；其他匹配的输出 JSON 与 `core/**/*.json` 顶层键按升序排序，不保留尾随逗号。YAML 使用 2 空格缩进、双引号优先、键排序规则。
- 保持现有的日志和错误处理风格；类型声明与注释遵循下述约定。扩展数据结构时检查对应的 `.d.ts`、转换逻辑与下游输出，不要只修改下载端。
- 不手改被忽略的缓存、日志或临时资源：`node_modules/`、`logs/`、`source/data/src/`、`source/data/http/`、`source/assets/`、`source/temp/`、`repos/`。若需要提交转换结果，检查差异中是否混入上游数据的无关波动。

## TypeScript 风格

以下约定参考 TeyvatGuide，并按本仓库目录与配置适配，适用于新增或本次修改的代码。不要为统一风格批量迁移无关历史代码；仓库约定与 ESLint 实际启用的规则应明确区分。

- 数组类型使用 `Array<T>`，只读数组使用 `ReadonlyArray<T>`，不新增 `T[]` 写法。
- 对象类型优先使用 `type`，不新增 `interface`；确需声明合并时说明理由。
- 参数与函数返回值写明类型，异步函数使用 `Promise<T>`。优先使用类型注解、泛型和类型收窄，确需断言时使用 `<Foo>value`；常量字面量推导使用 `<const>`，不改写为显式字面量类型断言。
- 优先使用 `unknown`；仅在第三方边界或现有兼容代码无法准确建模时使用 `any`。这是代码约定，`no-explicit-any` 和 `strict-boolean-expressions` 仍按当前配置保持关闭。
- 具名业务函数优先使用 `function` 声明；回调、需要词法 `this` 或简短表达式时可使用箭头函数。不保留未使用的变量、参数或导入，不用 `cond && fn()` 等独立短路表达式代替控制流。
- 跨文件复用的类型先检查已有声明，放入 `core/types/`、所属插件的 `types/` 或 `web/types/`，沿用现有 `TGACore`、`TGWeb` 的 `declare namespace`。单文件局部类型就近定义，不为类型单独新建 `types.ts` 或大写 `Types/` 目录；运行时代码不新增 namespace。
- 不新增原生 TypeScript `enum`；先复用已有值对象，确需新增时使用常量对象并派生值的联合类型。共享声明放在对应 `.d.ts`，实际值放在所属组件或插件的 `enum.ts`、`constant.ts` 等既有运行时目录；仅在声明空间存在的名称不能当作运行时值使用。
- 使用 ESM 导入并沿用本项目 `.ts` 扩展名和路径别名。纯类型导入使用 `import type { Foo }`；混合导入可使用 `import { value, type Foo }`。`import/order` 当前未启用，不把排序描述为 lint 强制要求，也不为局部任务批量重排导入。

## 版本与注释元数据

- `package.json.version` 表示发布版本，`package.json.since` 表示本次开发使用的注释版本。新增或更新 `@since` 前先读取 `since`，不使用 `version` 或 TeyvatGuide 的版本号推测；以实际字段为准，不因普通任务自行递增版本。
- 本项目沿用 `@since <package.json.since>` 格式，例如当前为 `@since 2.7.0`；尖括号是文档占位符，实际注释替换为字段值，不添加 TeyvatGuide 的 `Beta v` 前缀。
- 新增或修改支持注释的源文件时，补齐或更新文件头的中文说明和 `@since`，包括仅调整格式或导入的文件。范围包括 `.ts`、`.d.ts`、`.js`、`.mjs` 等源码；JSON、锁文件、生成物和二进制文件不为此添加注释。
- 函数实现或签名发生修改时，无论是否导出，都更新紧邻函数注释中的 `@since`；缺少注释时补充简短中文说明、`@since` 及必要的参数和返回值说明。不要求为每个内联回调单独补齐元数据。
- 新增或修改 `type` 等类型声明时，将版本标记写在声明自身的注释中；新增、删除、重命名字段或改变字段类型也应更新所属类型的 `@since`，字段注释不能替代类型注释。新增导出的常量也添加简短说明和 `@since`。
- 新增或重写的注释采用 TSDoc：直接写中文摘要，参数使用 `@param name - 描述`，返回值使用 `@returns 描述`，泛型使用 `@typeParam T - 描述`。类型由 TypeScript 签名表达，不重复写 `{Type}`；不新增冗余的 `@file`、`@description`、`@function`、`@interface` 等标签。
- 只更新本次涉及的文件头与实际修改的声明，保留无关声明的历史版本。`@since` 不表示首次引入版本，而表示该文件或声明最近一次相关修改的开发版本。当前未接入 `tsdoc/syntax`，注释规范通过人工检查，不宣称已有 lint 校验。

```typescript
/**
 * 按主机名匹配代理例外。
 * @since 2.7.0
 * @param hostname - 请求主机名
 * @param rules - 代理例外列表
 * @returns 是否命中例外
 */
function matchesProxyBypass(hostname: string, rules: ReadonlyArray<string>): boolean {
  return rules.includes(hostname);
}
```

示例中的版本只演示格式，实际编写时读取当前 `package.json.since`。

## 脚本及其副作用

- `pnpm auto:update` 执行 `scripts/updateAll.ts`，依次运行各组件存在的 `download.ts`、`convert.ts`、`update.ts`。无参数或 `all` 更新全部，单个合法数据域限定更新范围；未知领域和多参数组合会在启动任务前报错。它会请求外部数据、写入资源及 JSON，不再自动格式化全仓；只在任务需要更新数据时运行，并在运行前检查工作区状态。子进程失败时跳过同领域后续阶段，继续其他领域，汇总失败并返回非零退出码。组件内部的可选来源降级仍可能正常退出，应继续检查日志和产物差异。
- material 下载入口先同步 Metadata Material 和角色数据，再读取可选来源；食谱关系不依赖 character 预先运行。Metadata 源来自 `repos/Snap.Metadata/Genshin/CHS/`，同步失败时尝试已有本地缓存，必需材料读取失败会终止该阶段。
- `pnpm resize` 读取 `source/temp/src/` 的 PNG，在 `source/temp/out/` 生成 WebP。`pnpm move [TeyvatGuide 根目录]` 将输出复制到参数指定的目标，默认使用相邻 `TeyvatGuide` 仓库；写入前输出绝对路径并检查 `src/data`、`public` 目录，不删除目标多余文件。`scripts/genStoreIcons.ts` 会覆盖 `scripts/output/` 中的图标；按需直接运行。
- `pnpm prettier` 与 `pnpm lint:fix` 都会修改文件，且默认作用于全仓；处理局部任务时优先对目标文件运行 `pnpm exec prettier --check <文件>`、`pnpm exec eslint <文件>`，确需修复时也限定文件范围。
- `web/utils/readCookie.ts` 会读取本机数据库并写入 `source/data/http/cookie.json`。不得将真实 Cookie、令牌、数据库内容或请求头写入测试、日志、文档和提交内容。

## 验证与交付

- 对修改过的 TypeScript、JSON、YAML 文件运行适用的定向 ESLint 检查；对修改过的可格式化文件运行 Prettier 检查。需要全仓验证时运行 `pnpm lint:check`。提交前 `.husky/pre-commit` 会运行 `pnpm lint-staged`，其中 TypeScript 还会经过 oxlint。
- 测试由 `vitest.config.ts` 收集 `test/*.test.ts`；项目没有 `test` npm 脚本，运行相关测试用 `pnpm exec vitest run <测试文件>`，全部测试用 `pnpm exec vitest run`。新增行为测试应覆盖可观察的输入输出，避免依赖真实账号或网络。
- 默认测试仅使用离线样例和本地测试服务器。依赖外部网络或真实账号的调试脚本位于 `scripts/debug/`，只通过 `pnpm exec tsx scripts/debug/<脚本>.ts` 显式运行；不得输出 Cookie、令牌、鉴权结果或原始账号响应。源码及编译配置变更后运行 `pnpm typecheck`。
- 只提交任务相关的源码、类型、测试和必要产物。工作区已有改动属于当前用户；不要覆盖、清理或顺手格式化不相关文件。交付时说明运行过的检查及未运行的数据更新脚本。
