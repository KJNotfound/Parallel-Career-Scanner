# 平行宇宙职业扫描仪 · Parallel Career Scanner

娱乐向单页 Web 应用：用「仪器读数」风格生成**短职务条**（地缘语境 + 真实一线工种）、**简录**（童年底色 + 叙事岗 + 据点事件），以及观测统计与判词。同一组表单参数结果**确定性固定**（SHA-256 种子），可导出 PNG 分享。

**声明：随机娱乐生成，不构成职业、心理、财务或任何现实决策建议。**

## 功能概要

- **必填**：公历生日（写入种子与「个体时痕」展示；黄道参与哈希，界面不展示星座名）。
- **选填入参**：地缘语境、拿手倾向、驱动力、承压、班组位置、近况标签、本宇宙自报职业；**对命运的反抗程度**滑条影响判词条目偏移。
- **输出**：运行日志 → 读数卡（据点、个体时痕、职务条、简录、观测统计、判词）→ 下载 PNG / 复制图片。

## 技术栈

- React 19 + TypeScript + Vite 8  
- Tailwind CSS 4（`@tailwindcss/vite`）  
- `html-to-image` 导出卡片  
- 浏览器 `crypto.subtle` SHA-256 做确定性分支

## 本地运行

需要 **Node.js**（建议 LTS）与 **npm**。

```bash
cd multiverse-career-scanner
npm install
npm run dev
```

浏览器打开终端提示的本地地址即可。

## 构建与预览

```bash
npm run build
npm run preview
```

静态资源输出在 `dist/`，可部署到任意静态托管（GitHub Pages、对象存储 + CDN 等）。

## 代码结构（摘要）

| 路径 | 说明 |
|------|------|
| `src/App.tsx` | 表单、扫描流程、结果区 |
| `src/components/ResultCard.tsx` | 读数卡 UI（截图目标） |
| `src/lib/predict-multiverse.ts` | 种子拼接、判词/统计池、扫描日志 |
| `src/data/rimworld-narrative.ts` | 童年/成年叙事、据点、事件与简录 |
| `src/data/real-jobs.ts` | 真实工种池与拿手过滤 |
| `src/data/identity-options.ts` | 地缘 / 动机等选项与标签 |
| `src/data/birth-mark.ts` | 个体时痕、太阳黄道（仅种子） |

## 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发服务器 |
| `npm run build` | 类型检查 + 生产构建 |
| `npm run preview` | 本地预览构建产物 |
| `npm run lint` | ESLint |

## 仓库

<https://github.com/KJNotfound/App-416>
