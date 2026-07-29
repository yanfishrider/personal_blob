---
title: "Astro 博客搭建全记录"
description: "从零搭建 Astro 5 + Tailwind 3 博客，三栏卡片布局、双动画加载、SPA 文章切换，踩坑记录。"
date: 2026-07-29
tags: ["Astro", "Tailwind", "博客", "SSG"]
category: "前端"
draft: false
---

## 为什么选 Astro

静态博客框架很多——Hexo、Hugo、11ty、Next.js。选 Astro 的理由很简单：

- **真正的 SSG**：构建时生成纯静态 HTML，零 JS 运行时
- **组件化**：`.astro` 文件类似 Vue SFC，但服务端渲染
- **内容集合**：`src/content/posts/*.md` 直接当文章源，自带 frontmatter 校验
- **按需加载**：支持 `client:load` / `client:idle` 控制 JS 何时加载

目标：一个带开场动画、三栏卡片布局、支持 SPA 文章切换的个人博客。

## 坑 1：Tailwind v3 vs v4

`@astrojs/tailwind@6` 同时兼容 v3 和 v4，但行为不同。

v4 用 `@import "tailwindcss"`，v3 用 `@tailwind base/components/utilities`。项目装的是 `tailwindcss@^3.4`，但 `global.css` 里不小心写成了 v4 的 `@import` 语法，导致：

1. Tailwind 的 base 层没有正确注入，body 的默认样式被重置
2. 手动写在 `global.css` 里的 `body { background: #7DB6BF }` 被 PostCSS 丢弃，从未出现在输出中

解决：改为 v3 的 `@tailwind base/components/utilities` 三指令，body 样式改为 inline style 直接写在 `<body>` 标签上。

## 坑 2：`<script>` 不支持 TypeScript

Astro 组件里的 `<script>` 标签是**纯 JavaScript**，不是 TypeScript。

最初写的代码：
```js
const card = (e.target as Element).closest('a.post-card') as HTMLAnchorElement | null;
```

构建通过（Vite 剥离了类型注解），但 `npx astro dev` 模式下直接报错——类型注解是 TS 语法，浏览器不认识。

解决方案：全部改写为 `var` + `function` + 无类型注解的纯 JS。事件委托用 `e.target.closest()`（原生 DOM API，不需要 `.dataset` 的类型断言）。

## 坑 3：`BASE_URL` 拼接缺少分隔符

`astro.config.mjs` 设置 `base: '/astro-blog'`。`import.meta.env.BASE_URL` 的值是 `/astro-blog`（**没有尾部斜杠**）。

早期的链接写法：
```astro
<a href={`${import.meta.env.BASE_URL}posts/${slug}`}>
```

实际生成：`/astro-blogposts/slug`（斜杠被吞了）。

修复：全部改为 `${BASE_URL}/posts/slug`，确保路径分隔符。受影响文件：BaseLayout 导航、Sidebar 统计链接、文章卡片、归档页、分类页、标签页。

## 坑 4：SPA 文章加载

点击文章卡片 → 原地替换中心区域 → 不跳转。实现方案：

1. `fetch()` 文章页 HTML
2. `DOMParser` 解析 → 提取 `#post-article` 内容
3. 替换 `#center-view` 的 `innerHTML`
4. `history.pushState` 更新 URL（可分享）
5. `popstate` 监听浏览器前进/后退

几个细节：
- 事件委托绑在 `#center-view` 上，避免 `innerHTML` 替换后监听器丢失
- 「返回列表」按钮用 `history.back()` 而非手动恢复 DOM
- 独立文章页（`/posts/slug`）保持完整渲染，不影响 SEO

## 最终架构

```
src/
├── components/
│   ├── LoadingScreen.astro    # NieR/P3RE/无动画 三种模式
│   ├── ProfileSidebar.astro   # 个人信息 + 统计 + 目录
│   ├── SiteStats.astro        # 站点数据统计
│   ├── BlogCalendar.astro     # 当月日历
│   └── SideToolbar.astro      # 动画切换 + 重播 + 回顶
├── layouts/
│   ├── BaseLayout.astro       # 导航 + sidebar/rightSidebar 插槽
│   └── BlogPost.astro         # 文章详情模板
├── pages/
│   ├── index.astro            # 三栏布局：侧边栏 | 文章卡片(2列) | 统计
│   ├── archive.astro          # 归档（按年分组）
│   ├── categories.astro       # 分类页
│   ├── tags.astro             # 标签云
│   ├── search.astro           # 客户端搜索
│   ├── about.astro            # 关于
│   └── posts/[slug].astro     # 文章动态路由
└── styles/global.css          # 文章排版 + Tailwind
```

整个过程基本是把踩过的每个坑都填了一遍，但最终效果符合预期：纯静态、零运行时 JS（除了动画组件）、GitHub Pages 一键部署。
