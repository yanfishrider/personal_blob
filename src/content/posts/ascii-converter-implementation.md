---
title: "图片转 ASCII 转换器实现详解"
description: "从像素采样、灰度映射到字符渲染——记录博客图片转 ASCII 转换页面的完整实现思路与踩坑过程。"
date: 2026-08-04
tags: ["Canvas", "JavaScript", "图像处理", "ASCII"]
category: "前端"
draft: false
---

## 起因

博客里做 LoadingScreen 的时候，为了把 YoRHa 徽章转成 ASCII 点阵，接触了图片转 ASCII 的思路——当时是借助在线工具完成的。但工具只能按它预设的参数转，想调列数、换字符集、加滤镜都得看它脸色。

正好博客需要一个能展示"前端能力"的页面，干脆自己写一个完整的图片转 ASCII 转换器，把生成、预览、导出都握在手里。

功能清单从一开始就很明确：
- 拖拽 / 点击 / Ctrl+V 粘贴三种方式导入图片
- 列数可调（20~400）
- 三种输出模式：纯文本、Canvas 渲染、彩色
- 图像预处理：亮度/对比度/饱和度/色相/灰度/复古/反色/阈值/边缘检测
- 多字符集切换（普通、方块、二进制、数字、字母等）
- 导出 TXT / PNG

## 核心思路：三步走

图片转 ASCII 本质上只有三步：**降采样 → 灰度化 → 字符映射**。

### 第一步：降采样

原始图片可能 4000×3000，不可能逐像素转字符（会输出 4000 行字符）。需要先缩小到"列数 × 行数"的网格，每个格子将来对应一个字符。

列数由滑块控制（默认 120），行数按宽高比自动计算：

```js
var colsVal = parseInt(document.getElementById('cols-slider').value);
var w = imgData.width, h = imgData.height;
var cW = w / colsVal;              // 每个字符格对应的像素宽度
var rows = Math.floor(h / cW * 0.5); // 行数 = 高度 / 格宽 × 0.5
```

注意这个 **0.5**——字符的宽高比大约是 1:2（一个字符占的宽度只有高度的一半），如果不压缩行数，输出的 ASCII 图会被垂直拉伸，看起来"变高了"。

降采样用离屏 Canvas 完成，`drawImage` 直接把原图缩到目标尺寸，浏览器自动做像素重采样：

```js
var offCanvas = document.createElement('canvas');
offCanvas.width = colsVal;
offCanvas.height = rows;
var octx = offCanvas.getContext('2d');
octx.drawImage(imgData, 0, 0, colsVal, rows);
var pixels = octx.getImageData(0, 0, colsVal, rows).data;
```

### 第二步：灰度化

每个像素是 RGBA 四个值，字符映射只需要一个亮度值。人眼对三种颜色的敏感度不同，标准加权公式：

```js
var grayVal = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
```

绿色权重最高、蓝色最低，这和人眼的感光特性一致（人眼对绿色最敏感）。

### 第三步：字符映射

准备一个"由密到疏"的字符集，亮度越高用越"密"的字符：

```js
var CHARS = '@%#*+=-:. ';
```

按字符数量把 0~255 的灰度区间均匀切分，建立密度表：

```js
function buildDensity() {
  var n = CHARS.length - 1;
  var d = [];
  for (var i = 0; i <= n; i++) d.push(Math.floor(i * 255 / n));
  return d;
}
```

然后遍历每个格子，找到灰度值落在的密度区间，取对应字符：

```js
var ch = ' ';
for (var i = 0; i < density.length; i++) {
  if (grayVal <= density[i]) { ch = CHARS[i] || ' '; break; }
}
```

`CHARS` 里最后一个字符是空格（最暗 → 空白），所以 `@` 对应最亮、` ` 对应最暗。字符集本身是**可配置**的——方块字符 `█▓▒░`、二进制 `01`、数字、字母，换一套字符集就是完全不同的视觉风格。

## 图像预处理：一行 CSS 搞定

亮度、对比度、饱和度、色相、灰度、复古、反色这七个滤镜，全部用 Canvas 的 `ctx.filter` 实现——浏览器原生支持，零成本：

```js
var f = [];
if (b != 100) f.push('brightness(' + (b/100) + ')');
if (c != 100) f.push('contrast(' + (c/100) + ')');
if (s != 100) f.push('saturate(' + (s/100) + ')');
if (hue != 0) f.push('hue-rotate(' + hue + 'deg)');
if (gray > 0) f.push('grayscale(' + (gray/100) + ')');
if (sepia > 0) f.push('sepia(' + (sepia/100) + ')');
if (inv > 0) f.push('invert(' + (inv/100) + ')');
octx.filter = f.join(' ');
octx.drawImage(imgData, 0, 0, colsVal, rows);
```

注意 `drawImage` 之前设置 `filter`，滤镜只对本次绘制生效。这样"先滤镜后降采样"的流程，保证了预处理和字符映射在同一份像素数据上完成。

## 阈值与边缘检测

### 阈值（二值化）

滑块为 0 时关闭；大于 0 时把灰度硬切到纯黑/纯白：

```js
if (thresh > 0) grayVal = grayVal < thresh ? 0 : 255;
```

适合做高对比度的剪影效果。

### Sobel 边缘检测

经典的 Sobel 算子，用两个 3×3 卷积核分别算水平梯度 Gx 和垂直梯度 Gy：

```js
var gx = -gray[idx-w-1] - 2*gray[idx-1] - gray[idx+w-1] + gray[idx-w+1] + 2*gray[idx+1] + gray[idx+w+1];
var gy = -gray[idx-w-1] - 2*gray[idx-w] - gray[idx-w+1] + gray[idx+w-1] + 2*gray[idx+w] + gray[idx+w+1];
var mag = Math.min(255, Math.sqrt(gx*gx + gy*gy));
```

梯度幅值大的地方就是边缘。输出是灰度边缘图，再走正常的字符映射——效果是只有轮廓线被渲染，很像素描线稿。

## 三种输出模式

### 文本模式

最简单，直接把字符行数组 join 成字符串塞进 `<pre>`，等宽字体天然对齐：

```js
textOutput.textContent = rows.join('\n');
```

`<pre>` 用 `font-size:5px; line-height:5px` 把字符压得很小，整体看起来像一幅画。

### Canvas 模式

把每个字符当成一个"点"画到 Canvas 上，用字符的密度值控制透明度（`alpha`），稀疏字符更透明：

```js
var alpha = 0.1 + (density[CHARS.indexOf(ch)] || 128) / 280;
ctx.fillStyle = 'rgba(200,200,210,' + alpha + ')';
ctx.fillRect(x * cW + offX, y * cH + offY, dotW, dotH);
```

`dotW = cW * 1.2`——点比格子略大，产生"光晕溢出"效果，跟 LoadingScreen 里 DOT > CELL 是同一个设计选择。

### 彩色模式

在 Canvas 模式基础上，额外从原图按同样网格采样颜色：

```js
var offC = document.createElement('canvas');
offC.width = colsVal; offC.height = rowCount;
var cctx = offC.getContext('2d');
cctx.drawImage(img, 0, 0, colsVal, rowCount);
colorData = cctx.getImageData(0, 0, colsVal, rowCount).data;
// ...
ctx.fillStyle = 'rgba(' + colorData[idx] + ',' + colorData[idx+1] + ',' + colorData[idx+2] + ',' + alpha + ')';
```

这样每个点保留原图色彩，只靠透明度表达明暗，远看是马赛克艺术画。

## 空白密度：给背景"透气"

纯字符输出时，暗部（比如黑色背景）会塞满 `:` 和 ` ` 之类的字符，视觉上很脏。空白密度参数解决这个问题：连续遇到低灰度像素时跳过几个，只输出空格：

```js
if (spaceDensity > 1 && grayVal < 30) {
  skipCount++;
  if (skipCount >= spaceDensity) { line += ' '; skipCount = 0; }
  continue;
}
```

密度 1 = 不跳过；密度 5 = 每 5 个暗像素才输出一个字符。调高后暗背景直接"消失"，只留下主体轮廓，特别适合深色图片。

## 交互细节

### 三种导入方式

```js
dropZone.addEventListener('click', function() { fileInput.click(); });
dropZone.addEventListener('dragover', function(e) { e.preventDefault(); ... });
document.addEventListener('paste', function(e) {
  var item = e.clipboardData.items[0];
  if (item && item.type.indexOf('image') !== -1) loadFile(item.getAsFile());
});
```

拖拽需要 `preventDefault()` 阻止浏览器默认打开图片，paste 则直接从剪贴板取图。三种方式最后都走同一个 `loadFile` → `FileReader` → `Image` 加载流程。

### 实时重绘

所有滑块和下拉框的 `input` / `change` 事件都直接调 `convert()`，参数一变立即重新生成，零延迟预览。这也是页面交互流畅的关键——转换逻辑足够轻（缩到 120 列也就一万多个格子），性能完全撑得住实时重算。

## 导出

- **复制文本**：隐藏 `<textarea>` + `execCommand('copy')`（老派但兼容性好）
- **下载 TXT**：`Blob` + `URL.createObjectURL` + 模拟 `<a>` 点击
- **下载 PNG**：`canvas.toDataURL('image/png')`,同样模拟下载

## 踩坑记录

1. **宽高比 0.5**：最初没乘 0.5，输出的字符画纵向拉长两倍，圆变椭圆。字符不是正方形的，行数必须按字符实际宽高比压缩。
2. **字符集密度方向**：`@` 在最左（最亮）、空格在最右（最暗），如果反过来整体会像底片。密度表 `buildDensity` 必须和字符顺序严格对应。
3. **`ctx.filter` 只在绘制时生效**：设置 filter 后再 `getImageData` 是拿不到滤镜效果的，必须 filter + drawImage + getImageData 三步连续执行。
4. **Sobel 边界**：卷积核在图像边缘会越界访问，所以循环从 `y=1` 到 `h-2` 跳过边界一圈。
5. **Canvas 模式要清背景**：先 `fillRect` 铺深色底再画点，否则透明背景导出 PNG 会发黑。

## 小结

整个转换器的核心逻辑不到 100 行 JS：降采样 → 灰度化 → 密度映射。其余全是锦上添花——滤镜、边缘检测、彩色、导出。

最大的收获是理解了"字符密度"这个抽象：任何连续信号（亮度、透明度、甚至声音振幅）都可以映射成一串字符，这就是 ASCII art 的本质。LoadingScreen 的徽章点阵和这个转换器，底层是同一套思想。
