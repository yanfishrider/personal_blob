# 摸鱼骑士 知识库

个人博客 / 知识库。写前端、动画，以及一些奇怪想法的实现记录。

线上地址：<https://yanfishrider.github.io/personal_blob>

## 技术栈

| 层 | 选择 |
| --- | --- |
| 框架 | Astro 5（内容集合 + 静态生成，默认零客户端 JS） |
| 样式 | Tailwind CSS 3 + 一层自定义设计令牌 / 组件类 |
| 动画 | anime.js 4（npm 依赖，跟随打包，不依赖 CDN） |
| 编辑器 | CodeMirror 6（笔记页实时编辑） |
| 部署 | GitHub Pages + Actions |

## 本地开发

需要 Node >= 20。

```bash
npm ci
npm run dev      # http://localhost:4321/personal_blob
npm run check    # astro check（类型校验）
npm run build    # 产物输出到 dist/
npm run preview  # 预览构建产物
```

> 站点部署在子路径 `/personal_blob` 下，`astro.config.mjs` 的 `base` 必须与仓库名一致。
> 所有站内链接都走 `import.meta.env.BASE_URL` 拼接，不要在模板里硬编码 `/xxx`。

## 目录结构

```
src/
  components/         通用 UI（侧栏、统计、日历、文章卡片…）
    notes/            笔记页专用（SideNav / CodeEditor / PreviewPanel）
  content/posts/      Markdown 文章
  layouts/            BaseLayout（站点骨架）、BlogPost（文章页）
  lib/                数据处理：blog-data / taxonomy / markdown / editor-state
  pages/             路由；tags/[slug] 与 categories/[slug] 是静态筛选页
  styles/global.css   设计令牌 + 组件样式
  data/              笔记页的教程数据
public/               静态资源（图片、脚本、视频）
```

## 写文章

在 `src/content/posts/` 新建 `.md`，frontmatter：

```yaml
---
title: 标题
description: 摘要（列表页与 SEO 用，建议 40–80 字）
date: 2026-09-16
tags: [动画, CSS]
category: 技术实现
draft: false # true 时不生成页面、不进列表、不进 sitemap
---
```

标签和分类会自动生成 `/tags/<slug>`、`/categories/<slug>` 页面，无需手动维护。

## 设计系统

样式令牌集中在 [`src/styles/global.css`](src/styles/global.css) 顶部：

- `--paper` / `--surface`：暖灰纸面与卡片底
- `--ink` ~ `--ink-4`：四档墨色
- `--accent` / `--accent-soft`：单一黄铜强调色
- `--font-serif`（标题）/ `--font-sans`（正文）/ `--font-mono`（元信息）

改配色只需要动这几个变量。字号、圆角、卡片阴影同样以变量形式定义。

两套页面主题：默认纸面，`<BaseLayout theme="dark">` 用于笔记 / 动画馆 / 游戏这类深色应用页。

## 无障碍与动效

- 尊重 `prefers-reduced-motion`：关闭自定义光标、点击绽开、开场动画与位移过渡。
- 自定义光标只在脚本初始化成功后启用（`html.custom-cursor-on`），失败时回退系统光标。
- 预览构建可用 `?noloading=1` 跳过开场动画。

## 部署

推送到 `main` 后由 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) 自动执行
`npm run check` → `npm run build` → 发布到 GitHub Pages。
