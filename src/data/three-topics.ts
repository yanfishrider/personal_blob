import type { Topic } from './anime-topics';

// Three.js 学习栏目 — 结构与 anime-topics 一致（topic → children 树），
// 预览 iframe 为 module 脚本，示例直接 import esm.sh 的 three。
// 螺丝拧紧示例 = 旋转 + 轴向位移按螺距耦合（拧紧的核心机制）。

export const threeTopics: Topic[] = [
  {
    id: 'threejs', label: 'Three.js 学习',
    desc: `**Three.js** 交互式学习笔记。

左侧导航树展开可浏览 Three.js 各章节，点击条目加载对应示例。每个章节包含：
- **HTML** — 页面结构
- **CSS** — 样式
- **JavaScript** — Three.js 代码（预览区 iframe 内运行 WebGL）

**核心三件套**：\`Scene\`（场景）+ \`PerspectiveCamera\`（透视相机）+ \`WebGLRenderer\`（渲染器）。
所有示例通过 \`import * as THREE from 'https://esm.sh/three@0.170.0'\` 引入，修改代码预览区自动刷新。`,
    html: `<div class="overview">
  <h1>Three.js</h1>
  <p>JavaScript 3D 库 — WebGL 之上的人性化封装</p>
  <div class="dots">
    <span></span><span></span><span></span><span></span><span></span>
  </div>
</div>`,
    css: `.overview { text-align: center; padding: 60px 20px; color: #bbb; font-family: sans-serif; }
.overview h1 { font-size: 36px; color: #66d9ef; margin: 0 0 8px; }
.overview p { font-size: 14px; color: #888; margin: 0 0 32px; }
.dots { display: flex; gap: 8px; justify-content: center; }
.dots span { width: 8px; height: 8px; border-radius: 50%; background: #66d9ef; opacity: 0.3; }
.dots span:nth-child(1) { animation: pulse 1s infinite 0s; }
.dots span:nth-child(2) { animation: pulse 1s infinite 0.2s; }
.dots span:nth-child(3) { animation: pulse 1s infinite 0.4s; }
.dots span:nth-child(4) { animation: pulse 1s infinite 0.6s; }
.dots span:nth-child(5) { animation: pulse 1s infinite 0.8s; }
@keyframes pulse { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:1;transform:scale(1.5)} }`,
    js: `// Three.js 学习笔记 — 从左侧导航选择章节
console.log('👋 从左侧选择一个章节开始学习');`,
    children: [
      {
        id: 'three-intro', label: '入门',
        desc: `**第一个场景** — 场景 / 相机 / 渲染器 / 几何体 / 材质，五步一个旋转立方体。

\`\`\`js
const scene = new THREE.Scene();                                    // 1. 场景：装物体的容器
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100);   // 2. 透视相机：人眼视角
const renderer = new THREE.WebGLRenderer({ antialias: true });      // 3. 渲染器：把 3D 画到 canvas
const mesh = new THREE.Mesh(geometry, material);                    // 4. 网格 = 几何体 + 材质
requestAnimationFrame(function animate() { ... });                  // 5. 循环：每帧渲染
\`\`\`

**坐标系**：x 右 / y 上 / z 朝屏幕外。相机默认看向 -z 方向，所以物体要放 z 负方向或相机往后退（\`camera.position.z = 5\`）。`,
        html: ``,
        css: `html, body { margin: 0 !important; padding: 0 !important; height: 100%; overflow: hidden; background: #ffffff; }
canvas { display: block; }`,
        js: `import * as THREE from 'https://esm.sh/three@0.170.0';

// 1. 场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// 2. 透视相机：fov 视角 / 宽高比 / 近裁剪 / 远裁剪
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;   // 相机后退 5 个单位

// 3. 渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4. 网格 = 几何体 + 材质
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const material = new THREE.MeshBasicMaterial({ color: 0x66d9ef, wireframe: false });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// 5. 渲染循环（rAF）
function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.015;
  renderer.render(scene, camera);
}
animate();

// 自适应窗口
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});`,
      },
      {
        id: 'three-camera', label: '场景与相机',
        desc: `**透视相机 vs 正交相机** — 两种投影方式。

- **PerspectiveCamera**（透视）：近大远小，符合人眼，产品动画/螺丝特写首选
- **OrthographicCamera**（正交）：没有透视缩短，尺寸恒定 —— 就是魔方正交投影的 3D 版本，适合机械装配图

**透视**：\`fov\` 越大视野越广、透视越夸张；\`position.z\` 越小（越近）物体越大。
**正交**：\`left/right/top/bottom\` 决定可见范围，\`zoom\` 缩放画面。`,
        html: ``,
        css: `html, body { margin: 0 !important; padding: 0 !important; height: 100%; overflow: hidden; background: #ffffff; }
canvas { display: block; }`,
        js: `import * as THREE from 'https://esm.sh/three@0.170.0';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// 左：透视相机（近大远小）
const camP = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
camP.position.set(-2, 0.5, 3);
camP.lookAt(-2, 0, 0);

// 右：正交相机（不变形，尺寸恒定）
const camO = new THREE.OrthographicCamera(-1.5, 1.5, 1.5, -1.5, 0.1, 100);
camO.position.set(2, 0.5, 3);
camO.lookAt(2, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setScissorTest(true);
document.body.appendChild(renderer.domElement);

// 两个一样的立方体（线框便于看透视变形）
function makeBox(x) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x66d9ef, wireframe: true })
  );
  mesh.position.x = x;
  mesh.rotation.y = Math.PI / 6;
  scene.add(mesh);
  return mesh;
}
const boxP = makeBox(-2);
const boxO = makeBox(2);

function animate() {
  requestAnimationFrame(animate);
  boxP.rotation.y += 0.01;
  boxO.rotation.y += 0.01;

  const w = window.innerWidth / 2, h = window.innerHeight;
  // 左半屏：透视相机
  renderer.setViewport(0, 0, w, h);
  renderer.setScissor(0, 0, w, h);
  renderer.render(scene, camP);
  // 右半屏：正交相机
  renderer.setViewport(w, 0, w, h);
  renderer.setScissor(w, 0, w, h);
  renderer.render(scene, camO);
}
animate();`,
      },
      {
        id: 'three-geometry', label: '几何体',
        desc: `**常用内置几何体** — 全部参数化，改参数即改形状。

- \`BoxGeometry(w, h, d)\` — 立方体
- \`SphereGeometry(r, wSeg, hSeg)\` — 球体
- \`CylinderGeometry(rTop, rBottom, h, radialSeg)\` — 圆柱/**六角头**（\`radialSeg=6\` 就是六棱柱！）
- \`TorusGeometry(r, tube, radialSeg, tubularSeg)\` — 圆环（可做垫圈）
- \`TubeGeometry(curve, seg, radius)\` — 沿曲线扫掠（可做螺纹！）

**注意**：线段数（Segments）决定圆滑度，越大越圆但顶点越多；机械件常用 16~64。`,
        html: ``,
        css: `html, body { margin: 0 !important; padding: 0 !important; height: 100%; overflow: hidden; background: #ffffff; }
canvas { display: block; }`,
        js: `import * as THREE from 'https://esm.sh/three@0.170.0';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 7);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 一排几何体：立方体 / 球 / 圆柱 / 六棱柱 / 圆环
const items = [
  { g: new THREE.BoxGeometry(1, 1, 1), x: -4, color: 0x66d9ef },
  { g: new THREE.SphereGeometry(0.6, 32, 32), x: -2, color: 0xff7b42 },
  { g: new THREE.CylinderGeometry(0.5, 0.5, 1.2, 32), x: 0, color: 0x51cf66 },
  { g: new THREE.CylinderGeometry(0.55, 0.55, 1.2, 6), x: 2, color: 0xffd43b },   // 六棱柱
  { g: new THREE.TorusGeometry(0.55, 0.2, 16, 32), x: 4, color: 0xcc5de8 },     // 垫圈
];
const meshes = items.map(function (it) {
  const mesh = new THREE.Mesh(it.g, new THREE.MeshBasicMaterial({ color: it.color }));
  mesh.position.x = it.x;
  scene.add(mesh);
  return mesh;
});

function animate() {
  requestAnimationFrame(animate);
  meshes.forEach(function (m) { m.rotation.y += 0.01; });
  renderer.render(scene, camera);
}
animate();`,
      },
      {
        id: 'three-material', label: '材质与光照',
        desc: `**材质 + 光照 = 金属质感**（螺丝/机械件的灵魂）。

- \`MeshBasicMaterial\` — 无光照，纯色/线框
- \`MeshStandardMaterial\` — PBR 标准材质，配合光照才有效果
  - \`metalness\`（金属度）：1 = 金属，0 = 非金属
  - \`roughness\`（粗糙度）：0 = 镜面反光，1 = 哑光
- **灯光**（至少一种）：
  - \`AmbientLight\` — 环境光，无方向，防止全黑
  - \`DirectionalLight\` — 平行光，模拟太阳，有方向感
  - \`PointLight\` — 点光源
  - \`HemisphereLight\` — 天光+地光，简单自然的氛围

**金属质感配方**：\`metalness: 0.9, roughness: 0.3\` + 平行光 + 环境光。`,
        html: ``,
        css: `html, body { margin: 0 !important; padding: 0 !important; height: 100%; overflow: hidden; background: #ffffff; }
canvas { display: block; }`,
        js: `import * as THREE from 'https://esm.sh/three@0.170.0';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(3, 2, 4);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 光照：环境光（防黑）+ 平行光（方向感）
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const dir = new THREE.DirectionalLight(0xffffff, 1.2);
dir.position.set(3, 5, 4);
scene.add(dir);

// 金属质感：metalness 高 + roughness 低
const metal = new THREE.MeshStandardMaterial({
  color: 0xcccccc, metalness: 0.9, roughness: 0.3,
});
const screwHead = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.5, 6), metal);
screwHead.rotation.z = Math.PI / 6;   // 六角头转正一个角
screwHead.position.y = 0.8;
scene.add(screwHead);

const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.6, 24), metal);
rod.position.y = -0.1;
scene.add(rod);

// 地面参考网格
const grid = new THREE.GridHelper(6, 12, 0x333333, 0x222222);
grid.position.y = -1.4;
scene.add(grid);

function animate() {
  requestAnimationFrame(animate);
  screwHead.rotation.y += 0.02;
  rod.rotation.y += 0.02;
  renderer.render(scene, camera);
}
animate();`,
      },
      {
        id: 'three-anim', label: '动画与循环',
        desc: `**动画机制** — Three.js 没有内置动画器，动画就是「每帧改参数 + 渲染」。

- 渲染循环：\`requestAnimationFrame\` 每帧回调（约 60fps）
- 旋转：\`mesh.rotation.x += 速度\`（弧度/帧）
- 平移：\`mesh.position.y += 速度\`
- 缩放：\`mesh.scale.set(s, s, s)\`
- 分组：\`Group\` 把多个零件打包，整体旋转/平移（螺丝装配动画的骨架）

**缓动**：可以用已有的 anime.js 驱动参数（\`animate\` 的 update 回调里设置 rotation/position），或自己写缓动函数。

下一节「螺丝拧紧」演示旋转 + 位移耦合。`,
        html: ``,
        css: `html, body { margin: 0 !important; padding: 0 !important; height: 100%; overflow: hidden; background: #ffffff; }
canvas { display: block; }`,
        js: `import * as THREE from 'https://esm.sh/three@0.170.0';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 6);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Group：把齿轮 + 轴打包成一个零件组
const gearGroup = new THREE.Group();
const gear = new THREE.Mesh(
  new THREE.CylinderGeometry(1, 1, 0.3, 24),
  new THREE.MeshStandardMaterial({ color: 0xff7b42, metalness: 0.7, roughness: 0.4 })
);
gearGroup.add(gear);
// 齿：一圈小方块
for (let i = 0; i < 12; i++) {
  const tooth = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.22, 0.34),
    new THREE.MeshStandardMaterial({ color: 0xff7b42, metalness: 0.7, roughness: 0.4 })
  );
  const a = (i / 12) * Math.PI * 2;
  tooth.position.set(Math.cos(a) * 1.12, Math.sin(a) * 1.12, 0);
  gearGroup.add(tooth);
}
gearGroup.position.y = 1;
scene.add(gearGroup);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const dir = new THREE.DirectionalLight(0xffffff, 1.2);
dir.position.set(3, 5, 4);
scene.add(dir);

let t = 0;
function animate() {
  requestAnimationFrame(animate);
  t += 0.016;                       // 时间（秒）
  gearGroup.rotation.z = t * 1.5;   // 绕自身轴旋转
  gearGroup.position.y = 1 + Math.sin(t) * 0.4;  // 上下浮动
  renderer.render(scene, camera);
}
animate();`,
        children: [
          {
            id: 'three-screw', label: '螺丝拧紧',
            desc: `**螺丝拧紧 = 绕轴旋转 + 轴向位移的螺距耦合**。

\`\`\`js
// 螺距 P：转一圈前进 P
angle += 转速 * dt;                       // 旋转角
screw.position.y = baseY - (angle / (2π)) * P;   // 位移跟随
\`\`\`

**实现要点**：
- 螺纹：\`CatmullRomCurve3\` 螺旋线 + \`TubeGeometry\` 扫掠成螺纹牙
- 六角头：\`CylinderGeometry(..., 6)\` 六棱柱
- 拧紧快慢：转速用缓动（先快后慢），到锁紧位停住
- **WebGL 深度缓冲自动遮挡**：螺丝旋入底座时，被底座挡住的部分自动隐藏——这正是 SVG 方案里最麻烦的裁切问题，Three.js 免费送

**注意**：螺旋线的 y 与角度必须同步（\`y = 角度/2π × 螺距\`），否则螺纹和位移打架。`,
            html: ``,
            css: `html, body { margin: 0 !important; padding: 0 !important; height: 100%; overflow: hidden; background: #ffffff; }
canvas { display: block; }`,
            js: `import * as THREE from 'https://esm.sh/three@0.170.0';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(4, 2.5, 5);
camera.lookAt(0, 0.5, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 光照
scene.add(new THREE.AmbientLight(0xffffff, 0.45));
const dir = new THREE.DirectionalLight(0xffffff, 1.3);
dir.position.set(4, 6, 5);
scene.add(dir);

const metal = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.85, roughness: 0.35 });

// ── 螺丝组：六角头 + 杆 + 螺纹 ──
const screw = new THREE.Group();

// 六角头（radialSegments=6 = 六棱柱）
const head = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.45, 6), metal);
head.rotation.z = Math.PI / 6;
head.position.y = 2.0;
screw.add(head);

// 杆
const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.4, 24), metal);
rod.position.y = 0.6;
screw.add(rod);

// 螺纹：螺旋线 + TubeGeometry 扫掠（4 圈）
const PITCH = 0.5;   // 螺距
const pts = [];
for (let i = 0; i <= 160; i++) {
  const t = i / 160;
  const ang = t * Math.PI * 2 * 4;
  pts.push(new THREE.Vector3(
    Math.cos(ang) * 0.42,      // x
    -0.9 + t * PITCH * 4,      // y：与角度同步上升（耦合！）
    Math.sin(ang) * 0.42       // z
  ));
}
const curve = new THREE.CatmullRomCurve3(pts);
const thread = new THREE.Mesh(
  new THREE.TubeGeometry(curve, 240, 0.07, 6),
  new THREE.MeshStandardMaterial({ color: 0xb8b8b8, metalness: 0.9, roughness: 0.3 })
);
screw.add(thread);

// ── 底座（含孔）：螺丝旋入后被 WebGL 深度缓冲自动遮挡 ──
const base = new THREE.Mesh(
  new THREE.CylinderGeometry(1.3, 1.5, 1.0, 32),
  new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.4, roughness: 0.6 })
);
base.position.y = -1.1;
scene.add(base);

scene.add(screw);

// ── 拧紧动画：角度缓动（快→慢→停），位移 = 角度 / 2π × 螺距 ──
const FULL = Math.PI * 2 * 4;        // 总转角 4 圈
const START_Y = 2.0;
let angle = 0;
let t = 0;

function animate() {
  requestAnimationFrame(animate);
  t += 0.016;
  // easeOutCubic：先快后慢，拧到底停住
  const p = Math.min(t / 6, 1);
  const e = 1 - Math.pow(1 - p, 3);
  angle = FULL * e;

  screw.rotation.y = angle;                                      // 旋转
  screw.position.y = START_Y - (angle / (Math.PI * 2)) * PITCH;  // 位移耦合

  renderer.render(scene, camera);
}
animate();`,
          },
        ],
      },
      {
        id: 'three-load', label: '加载模型',
        desc: `**加载 glTF/glb 模型** — 用 Blender/CAD 导出的模型文件。

\`\`\`js
import { GLTFLoader } from 'https://esm.sh/three@0.170.0/examples/jsm/loaders/GLTFLoader.js';
const loader = new GLTFLoader();
loader.load('/models/screw.glb', function (gltf) {
  scene.add(gltf.scene);   // gltf.scene 是模型根节点（Group）
});
\`\`\`

**注意**：
- 模型文件放 \`public/models/\`，构建后原样可访问
- CAD 模型单位是 mm（螺丝几十个单位），加载后要 \`scale\` 归一化
- 加载是异步的，场景先渲染，模型到了再出现

本示例先用代码生成一个简易模型演示「加载后处理」流程（实际用 GLTFLoader 时把 \`gltf.scene\` 换成 \`mesh\` 即可）。`,
        html: ``,
        css: `html, body { margin: 0 !important; padding: 0 !important; height: 100%; overflow: hidden; background: #ffffff; }
canvas { display: block; }`,
        js: `import * as THREE from 'https://esm.sh/three@0.170.0';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 4);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const dir = new THREE.DirectionalLight(0xffffff, 1.2);
dir.position.set(3, 5, 4);
scene.add(dir);

// 模拟 GLTFLoader 异步加载：1.2s 后"模型"到位
// 真实用法：
//   const loader = new GLTFLoader();
//   loader.load('/models/screw.glb', function (gltf) {
//     const model = gltf.scene;
//     model.scale.setScalar(0.1);   // CAD mm → 场景单位归一化
//     scene.add(model);
//   });
const model = new THREE.Group();
const metal = new THREE.MeshStandardMaterial({ color: 0x66d9ef, metalness: 0.8, roughness: 0.3 });
for (let i = -1; i <= 1; i++) {
  const cube = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), metal);
  cube.position.x = i * 0.8;
  model.add(cube);
}
model.visible = false;
scene.add(model);

setTimeout(function () {
  model.visible = true;   // "加载完成"
}, 1200);

function animate() {
  requestAnimationFrame(animate);
  model.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();`,
      },
      {
        id: 'three-custom',
        label: '自定义图形设计',
        desc: `**自定义图形设计** — 用 Three.js 参数化几何体做自己的 3D 图形。

Three.js 的内置几何体都是「改参数 = 改形状」：
- \`CylinderGeometry\` — 改 \`radialSegments\` 可得任意棱柱/圆柱
- \`SphereGeometry\` — 改分段数控制圆滑度
- \`LatheGeometry\` — 旋转轮廓线成旋转体（花瓶/瓶身）

从左侧选择设计器，拖动参数实时生成图形。「设计自定义图形」的第一步就是吃透这些参数。`,
        html: `<div class="overview">
  <h1>自定义图形设计</h1>
  <p>参数化几何体 · 改参数即改形状</p>
  <div class="dots">
    <span></span><span></span><span></span>
  </div>
</div>`,
        css: `.overview { text-align: center; padding: 60px 20px; color: #333; font-family: sans-serif; }
.overview h1 { font-size: 30px; color: #0e7490; margin: 0 0 8px; }
.overview p { font-size: 14px; color: #555; margin: 0 0 28px; }
.dots { display: flex; gap: 8px; justify-content: center; }
.dots span { width: 8px; height: 8px; border-radius: 50%; background: #0e7490; opacity: 0.35; }
.dots span:nth-child(1) { animation: pulse 1s infinite 0s; }
.dots span:nth-child(2) { animation: pulse 1s infinite 0.2s; }
.dots span:nth-child(3) { animation: pulse 1s infinite 0.4s; }
@keyframes pulse { 0%,100%{opacity:0.35;transform:scale(1)} 50%{opacity:1;transform:scale(1.5)} }`,
        js: `// 自定义图形设计 — 从左侧选择设计器
console.log('👋 从左侧选择一个设计器开始');`,
        children: [
          {
            id: 'three-poly-prism',
            label: '多面柱体设计',
            desc: `**多面柱体设计器** — \`CylinderGeometry(radiusTop, radiusBottom, height, radialSegments)\` 的 \`radialSegments\`（侧面数）决定生成正 n 棱柱。

- **侧面数 n**：3 三棱柱、4 四棱柱、6 六棱柱…… 越大越接近圆柱（32+ 就是圆柱）
- **棱线**：\`EdgesGeometry\` 从几何体提取棱边画线框，每个面都清晰可数
- 上下面永远是正 n 边形（三角形/正方形/正六边形……）

**扩展思路**：
- 上下半径不同 → 圆台（\`radiusTop ≠ radiusBottom\`）
- \`radiusTop = 0\` → 圆锥（等价 \`ConeGeometry(r, h, n)\`）
- 侧面数 + 位移堆叠 → 自定义柱状雕塑

拖动左侧滑块试试：侧面数从 3 拖到 16，观察棱柱怎么一步步变成圆柱。`,
            html: `<div class="panel">
  <div class="title">多面柱体设计</div>
  <label>侧面数 <input id="seg" type="range" min="3" max="16" step="1" value="6"><span class="val" id="segVal">六棱柱</span></label>
  <label>上下面 <span class="val" id="faceVal">正六边形</span></label>
  <label>半径 <input id="rad" type="range" min="0.5" max="2" step="0.1" value="1"><span class="val" id="radVal">1.0</span></label>
  <label>高度 <input id="hei" type="range" min="0.5" max="3" step="0.1" value="1.6"><span class="val" id="heiVal">1.6</span></label>
  <label class="row"><input id="auto" type="checkbox" checked> 自动旋转</label>
</div>`,
            css: `html, body { margin: 0 !important; padding: 0 !important; height: 100%; overflow: hidden; background: #ffffff; }
canvas { display: block; }
.panel { position: fixed; top: 10px; left: 10px; z-index: 10; width: 160px; background: rgba(255,255,255,0.92); border: 1px solid #d5d5d5; border-radius: 8px; padding: 8px 10px; font: 12px/1.6 sans-serif; color: #333; box-shadow: 0 3px 12px rgba(0,0,0,0.12); }
.panel .title { font-size: 12px; font-weight: 700; color: #0e7490; margin-bottom: 4px; }
.panel label { display: block; margin: 3px 0; }
.panel input[type=range] { width: 88px; vertical-align: middle; accent-color: #0e7490; }
.panel .val { display: inline-block; min-width: 42px; color: #0e7490; font-weight: 600; text-align: right; font-size: 11px; }
.panel label.row { display: flex; align-items: center; gap: 5px; margin-top: 5px; }
.panel .info { margin-top: 6px; padding-top: 6px; border-top: 1px dashed #ddd; font-size: 11px; color: #777; line-height: 1.6; }`,
            js: `import * as THREE from 'https://esm.sh/three@0.170.0';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(3.5, 2.6, 4.5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dir = new THREE.DirectionalLight(0xffffff, 1.2);
dir.position.set(4, 6, 5);
scene.add(dir);

// 柱体材质（灰金属）+ 棱线（深色）
const bodyMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.7, roughness: 0.35 });
const edgeMat = new THREE.LineBasicMaterial({ color: 0x333333 });

// 控制面板
const seg = document.getElementById('seg');
const rad = document.getElementById('rad');
const hei = document.getElementById('hei');
const auto = document.getElementById('auto');
const segVal = document.getElementById('segVal');
const faceVal = document.getElementById('faceVal');
const radVal = document.getElementById('radVal');
const heiVal = document.getElementById('heiVal');

const NAMES = { 3: '三棱柱', 4: '四棱柱', 5: '五棱柱', 6: '六棱柱', 8: '八棱柱', 10: '十棱柱', 12: '十二棱柱', 16: '十六棱柱' };
const FACES = { 3: '正三角形', 4: '正方形', 5: '正五边形', 6: '正六边形', 8: '正八边形', 10: '正十边形', 12: '正十二边形', 16: '正十六边形' };

// 主体放进 Group，自动旋转只转它
const holder = new THREE.Group();
scene.add(holder);

function rebuild() {
  const n = parseInt(seg.value, 10);
  const r = parseFloat(rad.value);
  const h = parseFloat(hei.value);

  // 清掉旧几何体（释放显存）
  holder.traverse(function (o) { if (o.geometry) o.geometry.dispose(); });
  holder.clear();

  const geo = new THREE.CylinderGeometry(r, r, h, n);
  holder.add(new THREE.Mesh(geo, bodyMat));
  holder.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat));

  segVal.textContent = NAMES[n] || (n + '棱柱');
  faceVal.textContent = FACES[n] || ('正' + n + '边形');
  radVal.textContent = r.toFixed(1);
  heiVal.textContent = h.toFixed(1);
}

['input', 'change'].forEach(function (evt) {
  seg.addEventListener(evt, rebuild);
  rad.addEventListener(evt, rebuild);
  hei.addEventListener(evt, rebuild);
});

rebuild();

function animate() {
  requestAnimationFrame(animate);
  if (auto.checked) holder.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});`,
          },

        ],
      },
    ],
  },
];
