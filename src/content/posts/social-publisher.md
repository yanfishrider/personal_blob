---
title: "多平台社交媒体自动发布工具 —— Social Publisher"
description: "基于 Playwright 实现一键发布到小红书、百家号、头条、B站、抖音、微博，支持内容差异化和 Web 可视化管理。"
date: 2026-07-29
tags: ["Python", "Playwright", "自动化", "社交媒体"]
category: "项目"
draft: false
---

## 缘起

运营多个社交媒体账号的时候，有一个重复劳动特别让人头疼：同一篇文章，要在小红书、百家号、今日头条、B 站、抖音、微博各发一遍。每个平台的编辑器不一样、字数限制不一样、标签规则不一样——光是把一篇文章搬到六个平台，就能耗掉半个下午。

于是就有了 Social Publisher：一个基于 Playwright 的多平台一键发布工具。把文章写好，封面图准备好，剩下的交给脚本。

GitHub：[yanfishrider/social-publisher](https://github.com/yanfishrider/social-publisher)

## 支持的平台

| 平台 | 内容类型 | 特殊处理 |
|------|---------|---------|
| 小红书 | 图文笔记 | 自动改写为 ≤20 字标题 + ~1000 字短文案 |
| 百家号 | 图文文章 | 封面图必填，支持分类标签 |
| 今日头条 | 图文文章 | Markdown 自动转纯文本段落 |
| B 站 | 专栏文章 | 支持长文 Markdown 发布 |
| 抖音 | 图文 | 精简至 ~800 字，自动适配 |
| 微博 | 头条文章 | ProseMirror 编辑器适配 |

支持通过 `--platform all` 一条命令发布到全部六个平台。

## 核心设计

### 两种运行模式

**CLI 模式**——适合脚本化、批量操作：

```bash
uv run python main.py publish xiaohongshu \
  --title "标题" --cover-image cover.jpg \
  --content-file article.md --tags "标签1,标签2"
```

**Web 模式**——FastAPI 驱动的可视化界面，拖拽上传 Markdown 和封面图，勾选目标平台，一键发布。默认开启"仅填充不发布"的手动模式，填完内容后由用户最终确认再点击发布按钮。

### 内容差异化

不同平台的受众和内容风格不一样，同一篇文章不能无脑搬运。`content_rewriter.py` 模块会根据目标平台自动调整：

- **小红书**：生成口语化短文案，控制标题在 20 字以内，正文 ~1000 字
- **长文平台**（百家号/头条号/B 站/微博）：清除 Markdown 语法，保留完整段落结构

### 浏览器操控

底层使用 [Patchright](https://github.com/Kaliiiiiiiiii-Vinyzu/Patchright)（Playwright 的增强分支），通过 CDP 协议操控 Chromium 浏览器：

- 支持连接真实 Edge 浏览器（`--use-edge`），复用已登录的 Cookie 和 Session
- 模拟人类打字速度（`human_typing.py`）避免触发反爬
- 支持 `--manual` 模式：仅填充图文不自动发布，由用户手动点击

### 进程隔离

Web 模式中，FastAPI 使用 asyncio，Playwright Sync API 与 asyncio 存在冲突。解决方案是将发布逻辑抽到独立子进程 `publish_worker.py`，通过 `subprocess` + JSON 传递配置，彻底解耦。

## 项目结构

```
social-publisher/
├── main.py              # CLI 入口
├── server.py            # FastAPI Web 服务
├── publish_worker.py    # 独立发布子进程
├── content_rewriter.py  # 内容差异化改写
├── human_typing.py      # 模拟人类打字
├── platforms/
│   ├── xiaohongshu.py   # 小红书
│   ├── baijiahao.py     # 百家号
│   ├── toutiao.py       # 今日头条
│   ├── bilibili.py      # B 站
│   ├── douyin.py        # 抖音
│   └── weibo.py         # 微博
└── templates/
    └── index.html       # Web 界面
```

## 小结

从一个"不想手动搬文章"的痛点出发，变成了一个覆盖六大平台的自动化发布工具。技术选型上 Playwright + Patchright 的组合意外地稳定——毕竟只要浏览器能打开的后台，理论上都能自动化。

下一步计划：增加内容排期调度、支持更多平台（搜狐号、知乎等）、接入 AI 改写以提升内容差异化质量。

GitHub：[https://github.com/yanfishrider/social-publisher](https://github.com/yanfishrider/social-publisher)
