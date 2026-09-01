---
title: "带交互动画角色的登录页面：移植、中文化与交互定制"
description: "动画馆新增第 4 个演示：从 GitHub 移植的互动登录页（4 个角色跟随鼠标/眨眼/回避密码）。单文件零依赖 + iframe 壳接入，中文化表单，并定制密码聚焦时的角色反应逻辑。"
date: 2026-09-01
tags: ["动画", "交互", "登录页", "CSS", "前端", "Astro"]
category: "前端"
draft: false
---

## 缘起

动画馆（animation-lab）已有三个演示：圆弧动画、NieR 加载动画、P3RE 风格动画。用户想再加一个**带交互动画角色的登录页面**——来源是 GitHub 上的开源项目 [guohaolian/animatedlogin](https://github.com/guohaolian/animatedlogin)。

## 为什么这次移植特别简单

原项目是**单 HTML 文件、零依赖**（1220 行 index.html + 一个 logo.png），README 明确写着"直接在浏览器打开 index.html 即可"。这正好匹配动画馆的 iframe 壳方案：

```
animation-lab.astro（壳：左侧菜单 + 右侧 iframe）
  ├─ lab-arc.astro    圆弧动画
  ├─ lab-nier.astro   NieR 加载动画
  ├─ lab-p3re.astro   P3RE 风格动画
  └─ login-demo/      互动登录（public 静态文件，iframe 直接引用）
```

对比之前两个演示页的移植，这次几乎没有踩坑：

| 坑 | lab-arc / lab-p3re | login-demo |
| --- | --- | --- |
| 缺 `<html>` 骨架导致 CSS 不注入 | lab-arc 踩过（Astro 不注入 @vite/client） | 原文件自带完整骨架，无此问题 |
| `import.meta.env` 在浏览器报错 | lab-p3re 踩过（内联 module 不替换） | 零依赖原生 JS，无构建期宏 |
| BASE_URL 拼接缺斜杠 | 两处都踩过（`/personal_blobassset/`） | 静态文件相对路径，无拼接 |

## 接入步骤

1. 复制 `index.html` + `logo.png` → `public/login-demo/`（原样静态文件）
2. `animation-lab.astro` 的 MENU 数组加一项：`{ key: 'login', page: 'login-demo/index.html', label: '互动登录' }`
3. 菜单 HTML 加对应按钮（编号 04）

相对路径（logo、Google Fonts 外链）在 `/personal_blob/login-demo/` 下自动解析正确。

## 中文化

表单文案与 JS 错误提示共 20 处替换：欢迎回来、邮箱、密码、30 天内保持登录、忘记密码、登 录、使用 Google 登录、还没有账号、隐私政策/服务条款/联系我们，以及 4 条校验错误（邮箱格式、密码长度、登录中、登录失败）。

注意：残留的 `Password`/`Google` 字样全是 JS 变量名（`showPassword`、`passwordInput`）和品牌名，不是用户可见文案，无需处理。

## 交互逻辑定制

原项目的角色反应：输入密码时**两个方形角色转头回避**（紫色左倾、黑色右倾），眼睛朝左上看。

用户希望改成更有戏剧性的版本：

1. **聚焦密码 → 不转头，闭眼**：两个方块保持正立（`skewX(0)`），眼睛闭成细线——"我不看你输密码"
2. **闭眼更细**：密码场景闭眼从 2px 调到 1px，自然眨眼保持 2px
3. **闭眼纯黑**：闭眼时眼球背景从白色改为 `#000`（闭眼 = 一条黑线）
4. **黑色偷看**：黑色小人聚焦密码时**睁眼盯着输入框看**（眼睛右移、瞳孔右移），与紫色闭眼形成"一个回避、一个好奇"的对比

### 关键代码

```js
// 紫色：聚焦密码 / 显示密码 → 闭眼 1px 黑线；自然眨眼 2px
purpleEyeL.style.background = (isLookingAway || isShowingPwd || isPurpleBlinking) ? "#000" : "white";
purpleEyeL.style.height = (isLookingAway || isShowingPwd) ? "1px" : (isPurpleBlinking ? "2px" : "18px");

// 黑色：聚焦密码 → 睁眼右看（偷看密码）；显示密码 → 睁眼；自然眨眼 2px 黑线
blackEyeL.style.background = isBlackBlinking ? "#000" : "white";
blackEyeL.style.height = (isLookingAway || isShowingPwd) ? "16px" : (isBlackBlinking ? "2px" : "16px");
// 聚焦时眼睛右移 42px、瞳孔右移 4px → 盯着右侧输入框
blackEyes.style.left = "42px";
blackPupilL.style.transform = "translate(4px, 0px)";
```

状态变量 `isLookingAway = isPasswordFocused && !showPassword`，`isShowingPwd = pwdLen > 0 && showPassword`——两者互斥，正好对应"聚焦未显示"与"已显示"两种密码场景。

### 最终行为

| 场景 | 紫色 | 黑色 |
| --- | --- | --- |
| 空闲 | 眼睛跟随鼠标 + 随机眨眼 | 眼睛跟随鼠标 + 随机眨眼 |
| 聚焦邮箱 | 与另一角色对视 | 与另一角色对视 |
| 聚焦密码 | **闭眼 1px 黑线** | **睁眼右看偷瞄密码** |
| 显示密码 | 闭眼（保持回避） | 睁眼（可以看了） |
| 登录失败 | 沮丧低头 | 沮丧低头 |

## 经验

- **单文件零依赖的开源项目是 iframe 展示的最佳素材**：原样复制进 public 即可，不用适配 Astro 构建
- 交互定制的关键是**先理清状态变量**（isLookingAway / isShowingPwd / 各角色 Blinking），它们互斥或独立，改表现只需在 updateCharacters() 里调整对应分支
- 闭眼用高度压扁 + overflow hidden 裁掉瞳孔，配合背景变黑，比单独画眼皮更简单
