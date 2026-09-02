# JigsawWorld 设计规范（Gallery Design System）

> 2026-09 首页改版确立的「画廊 / 美术馆」视觉体系。所有令牌（Token）统一定义在
> `src/app/globals.css` 的 `@theme` 与 `.dark` 块中，任何页面**禁止硬编码颜色**，一律通过
> Tailwind 工具类（`bg-card`、`text-accent`…）或本文列出的公共 class 复用。

---

## 1. 设计理念

把拼图呈现为「挂在美术馆墙上的一幅画」：

- **奶油色墙面**做全局背景，营造画廊展墙的氛围；
- **森林绿**是框体色，承担所有主操作（Register、Continue、Begin 之外的确认类动作）；
- **陶土橙**是高光色，只用于页面上最重要的单一行动点（Begin Puzzle、Play Today's Puzzle）与点缀（斜体词、View all）；
- 标题一律使用**衬线字体**，像画框下的作品铭牌；UI 与正文用无衬线；
- 卡片如「画框 + 卡纸」：象牙白底、沙色细边框、极小的圆角、柔和的暖色阴影。

---

## 2. 配色方案

### 2.1 语义色（全局通用，自动适配深色模式）

| Token | 亮色值 | 用途 |
| --- | --- | --- |
| `background` | `#F6F1E8` 奶油 | 页面墙面底色 |
| `foreground` | `#262219` 墨色 | 正文与标题 |
| `card` / `card-hover` | `#FFFDF8` 象牙白 | 卡片/面板底色 |
| `panel` | `#FBF7EE` | 比卡片略沉一级的面板（英雄区信息卡、chips） |
| `primary` | `#2F4A3A` 森林绿 | 主按钮、选中态、图标强调 |
| `primary-foreground` | `#F7F3EA` | 绿底上的文字 |
| `accent` | `#B4592E` 陶土橙 | 唯一高光：核心 CTA、斜体词、View all、悬停强调 |
| `accent-subtle` | `#F4E4D8` | 橙色弱背景 |
| `muted` / `muted-foreground` | `#EFE9DC` / `#857B69` | 次级底色 / 次级文字 |
| `secondary` | `#EFE8D9` | 次级填充（用户名 chip 等） |
| `border` / `input` | `#E4DAC7` 沙色 | 唯一边框色 |
| `ring` | 同 `primary` | 焦点环 |
| `destructive` | `#C0453A` | 危险操作 |

### 2.2 难度色（difficulty）

| Token | 亮色 | 语义 |
| --- | --- | --- |
| `puzzle-easy` | `#4A7259` 绿 | Easy |
| `puzzle-medium` | `#B98A2F` 金 | Medium |
| `puzzle-hard` | `#C0453A` 红 | Hard |

配套弱背景：`success-subtle` / `warning-subtle`；徽章直接用公共类
`.difficulty-easy / .difficulty-medium / .difficulty-hard`（自带边框与底色）。

### 2.3 深色模式

深色是「闭馆之后」的暖炭色系：背景 `#171310`、卡片 `#211C15`、边框 `#3B3327`，
主色提亮为鼠尾草绿 `#7BA18C`、橙色提亮为 `#CD7A45`。全部在 `.dark` 块覆盖同名 token，
组件层**不需要**额外写 `dark:` 颜色（仅个别透明度微调）。

### 2.4 用色规则

1. 一个视图内，橙色高光点 **≤ 2 处**（一个主 CTA + 可选的 View all）；
2. 森林绿用于「确认/继续」类动作与选中态，不要与橙色同时抢焦点；
3. 边框只用 `border`（沙色），需要更重时用 `#D5C9AE`（沙色加深，见 Streak 圆点）；
4. 灰阶文字只有两档：`foreground`（90% 场景）与 `muted-foreground`（辅助信息）。

---

## 3. 字体系统

| 角色 | 字体 | 加载方式 |
| --- | --- | --- |
| 展示衬线（标题、卡名、数字铭牌） | **Cormorant Garamond** 500/600/700 + 斜体 | `next/font`，变量 `--font-cormorant` |
| UI / 正文无衬线 | **Inter** | `next/font`，变量 `--font-inter` |

两个变量类挂在 `<html>` 上（`src/app/layout.tsx`），`@theme` 中映射为：

- `--font-display: var(--font-cormorant), Georgia, serif` → 工具类 `font-display`
- `--font-sans: var(--font-inter), ...` → 全局 body 默认字体

> ⚠️ 注意：`--font-*` 变量类必须挂在 `<html>` 上。若挂在 `<body>`，`:root` 处的
> `--font-display` 无法解析，会整体回退到浏览器默认字体。

### 3.1 字号层级

| 层级 | 写法 | 示例 |
| --- | --- | --- |
| H1 英雄标题 | `font-display text-[3.4rem] lg:text-[4.3rem] font-semibold leading-[1.02]` | "Art you *love.*" |
| 面板标题 | `font-display text-[32px] font-semibold leading-[1.1]` | Today's Puzzle 卡 |
| 区块标题 | `.label-caps`（见 §5.2） | POPULAR TODAY |
| 卡片标题 | `font-display text-[19px] font-semibold leading-tight` | 拼图卡片名 |
| 强调句 | `font-display text-xl sm:text-[22px] leading-8/9` | "Curated puzzles…" |
| 正文 | 14–16px `text-foreground` / `text-muted-foreground` | 描述、菜单 |
| 元信息 | 12–13px `text-muted-foreground` | "150 pcs · 2.2k plays" |

**强调词**：标题中的关键词用 `italic text-accent`（衬线斜体 + 陶土橙），一屏最多两处。

---

## 4. 布局标准

| 项 | 标准 |
| --- | --- |
| 页面容器 | `max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8`（Header 与所有区块统一） |
| 区块间距 | 区块间 `mt-10 ~ mt-12`；标题与内容间 `mb-6` |
| 卡片间距 | 网格 `gap-5`（4 列卡片）/ `gap-4`（6 列分类瓦片） |
| 圆角体系 | 按钮 0.5rem（小按钮 0.375rem）；卡片/瓦片 `rounded-lg`（0.75rem）；胶囊筛选 `rounded-md`；头像/圆形元素 `rounded-full` |
| 卡纸式卡片 | 图片**出血**贴边（卡片 `p-2.5`，图片区无圆角），文字区 `px-1.5 pb-1.5 pt-3`——模拟画框卡纸 |

网格：热门/推荐 4 列（`lg:grid-cols-4`）、分类 6 列（`lg:grid-cols-6`）、英雄区 `lg:grid-cols-[0.92fr_1.08fr]`。

---

## 5. 公共组件标准

### 5.1 按钮（`.btn` 体系，见 globals.css）

| 类 | 用途 |
| --- | --- |
| `btn btn-primary` | 森林绿主操作（Register、Continue Puzzle） |
| `btn btn-terracotta` | 陶土橙核心 CTA（Begin Puzzle、Play Today's Puzzle），每屏 ≤ 1 个 |
| `btn btn-outline` | 象牙白描边次操作 |
| `btn btn-ghost` | 无边框弱操作（Log in） |
| 尺寸 | `btn-sm`（h-9.5）/ `btn-md`（h-10）/ `btn-lg`（h-13）/ `btn-icon` |

`<Button>` 组件（`src/components/ui/button.tsx`）映射到同一套类：`variant="default"` 即
`btn-primary`。悬停统一 `translateY(-2px)` + 阴影加深，按下 `translateY(1px)`。

### 5.2 区块标题（ label-caps + 发丝线 + View all ）

所有区块统一此结构（参考 Popular Today / Recommended for You / Browse by Category）：

```tsx
<div className="mb-6 flex items-center gap-5">
  <h2 className="label-caps shrink-0 text-foreground">Popular Today</h2>
  <span className="h-px flex-1 bg-[#ddd2ba] dark:bg-[#3b3327]" />
  <Link className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent hover:text-accent/80">
    View all <ArrowRight className="h-3.5 w-3.5" />
  </Link>
</div>
```

`.label-caps` = Cormorant 大写 + `letter-spacing: 0.22em` + 13px + 600，用于区块标题、
眉标（PIECES OF WONDER）、铭牌（FEATURED TODAY、DAY STREAK）。

### 5.3 卡片

- **拼图卡**：`border border-[#e7decb] bg-card p-2.5` + 暖阴影，悬停 `-translate-y-1`、
  图片 `scale-[1.04]`、标题 `text-accent`；
- **分类瓦片**：`aspect-[1.3/1] rounded-lg`，底部 `bg-gradient-to-t from-[#241D10]/85` 压暗，
  白色 `font-display` 标题 + `text-white/75` 计数；
- **数量徽章**（推荐卡右上角）：`bg-white/95 rounded-full px-2.5 py-0.5 text-xs font-bold`。

### 5.4 筛选胶囊 / 主题 chips

- 选中：`border-primary bg-primary text-primary-foreground`
- 未选：`border-[#ddd2ba] bg-transparent text-muted-foreground hover:border-primary/50`
- chips（带 emoji）：`h-10 rounded-lg border bg-panel px-4 text-xs font-semibold`

### 5.5 阴影 / 边框

暖色调阴影是体系的隐性标志，统一用棕色系而非黑灰：

```
卡片默认  shadow-[0_10px_30px_-22px_rgba(80,60,25,0.4)]
悬停      shadow-[0_20px_40px_-24px_rgba(80,60,25,0.5)]
面板/横幅 shadow-[0_18px_45px_-32px_rgba(80,60,25,0.5)]
```

---

## 6. 图片与图标

- **图源**：仅 `images.unsplash.com`（已在 `next.config.js` 白名单）。新增图片必须先用
  `curl -I` 验证 200 再入库（历史上两次 404 混入过 fallback 数据）；
- 裁剪参数统一 `?w=900&h=700&fit=crop`（卡片）/ `?w=700&h=520&fit=crop`（瓦片）；
- **图标**：Lucide React，线性 1.75~2 描边；导航项 `h-4 w-4`；装饰性图标可 `fill-accent`；
- 人物/雕像等装饰图在奶油底上用 `[filter:grayscale(1)] mix-blend-multiply` 融合（见 Streak 横幅）。

## 7. 动效

- 入场：`.hero-rise` + `.hero-d-1..6` 延迟编排（上移 + 模糊消散 0.7s）；
- 悬停：位移/缩放 ≤ 4%，时长 300–700ms；
- 全部动效在 `prefers-reduced-motion` 下关闭（globals.css 已处理）。

## 8. 新页面接入 Checklist

1. 背景写 `bg-background`，容器写 `max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8`；
2. 颜色只用 §2 的 token 类，不写 hex（阴影/发丝线等例外见 §5）；
3. 标题用 `font-display`，区块标题用 `.label-caps` + §5.2 结构；
4. 主 CTA 用 `btn-terracotta`（每屏一个），次操作用 `btn-primary` / `btn-outline`；
5. 深色模式不写额外颜色，仅必要时加透明度 `dark:` 微调；
6. 新图片先验证 200；
7. 页面级新颜色如确需新增，先加进 `@theme` token 再使用。
