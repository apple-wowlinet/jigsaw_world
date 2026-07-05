/**
 * PuzzleRenderer —— PixiJS v8 渲染层 + 游戏组装
 * 场景图：viewportRoot（相机） → [世界边框, 预览层, 拼块容器, 特效层]
 * 模型（PuzzleCore）即时更新；渲染层通过每帧同步 + 每块 renderOffset
 * （吸附回弹/旋转补间）投影模型状态。
 */
import {
  Application,
  Container,
  Graphics,
  Rectangle,
  Sprite,
  Texture,
} from 'pixi.js';
import { PuzzleCore } from '@/lib/puzzle/core/puzzle-core';
import { restore, serialize } from '@/lib/puzzle/core/save';
import { pieceBounds } from '@/lib/puzzle/core/group';
import { MARGIN } from '@/lib/puzzle/core/constants';
import type {
  DebugOverlapPair,
  DebugPieceInfo,
  Piece,
  PieceChoice,
  PuzzleDebugInfo,
  SaveGameV6,
  SnapEvent,
} from '@/lib/puzzle/core/types';
import type { SubjectData } from '@/lib/puzzle/core/subject';
import { bakeAtlas, makeAlphaAt, type AtlasResult } from './atlas';
import { SnapIndicator } from './snap-indicator';
import { TweenRunner, easeOutQuad } from './tween';
import { Viewport } from './viewport';
import { InputController } from './input';
import { sfx } from '@/lib/puzzle/audio/sfx';

export interface GameCallbacks {
  onProgress?: (pct: number) => void;
  onComplete?: () => void;
  onMove?: (moves: number) => void;
  /** 任何会改变存档的操作后触发（防抖自动存档用） */
  onDirty?: () => void;
}

export interface CreateGameOptions {
  mount: HTMLElement;
  subject: SubjectData;
  choice: PieceChoice;
  seed: number;
  rotationEnabled: boolean;
  showPreview: boolean;
  callbacks: GameCallbacks;
  save?: SaveGameV6 | null;
}

interface PieceView {
  sprite: Sprite;
  dx: number; // 渲染偏移（补间衰减到 0）
  dy: number;
  dr: number; // 角度偏移（度）
}

const SETTLE_MS = 120;
const ROTATE_MS = 150;

export class PuzzleGame {
  core = new PuzzleCore();
  app: Application | null = null;
  viewport!: Viewport;
  tweens = new TweenRunner();
  paused = false;

  private atlas: AtlasResult | null = null;
  private views = new Map<Piece, PieceView>();
  private piecesLayer = new Container();
  private fxLayer = new Container();
  private previewLayer = new Container();
  private worldFrame = new Graphics();
  private root = new Container();
  private indicator: SnapIndicator | null = null;
  private input: InputController | null = null;
  private callbacks: GameCallbacks = {};
  private subject!: SubjectData;
  private destroyed = false;
  private contextLostHandler: ((e: Event) => void) | null = null;
  private contextRestoredHandler: (() => void) | null = null;

  async init(opts: CreateGameOptions) {
    this.callbacks = opts.callbacks;
    this.subject = opts.subject;

    const mount = opts.mount;
    const boardW = Math.max(320, mount.clientWidth);
    const boardH = Math.max(320, mount.clientHeight);

    const app = new Application();
    await app.init({
      resizeTo: mount,
      antialias: true,
      preference: 'webgl',
      backgroundAlpha: 0,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
    });
    if (this.destroyed) {
      app.destroy(true, { children: true, texture: true });
      return;
    }
    this.app = app;
    mount.appendChild(app.canvas);
    app.canvas.style.touchAction = 'none';
    app.canvas.style.display = 'block';

    // 模型初始化（世界尺寸可能大于屏幕）
    this.core.init(
      opts.subject,
      opts.choice,
      opts.seed,
      boardW,
      boardH,
      opts.rotationEnabled
    );

    // 恢复存档（切图确定性保证 seed 匹配即可恢复）
    if (opts.save) restore(this.core, opts.save);

    // 烘焙图集 + 命中测试
    this.atlas = bakeAtlas(
      this.core.pieces,
      opts.subject,
      window.devicePixelRatio || 1
    );
    this.core.alphaAt = makeAlphaAt(this.atlas);
    // 调试钩子（开发用）
    if (process.env.NODE_ENV !== 'production') {
      (window as unknown as Record<string, unknown>).__jigsawDebug = {
        game: this,
        atlas: this.atlas,
        subject: this.subject,
      };
    }

    // 场景图
    this.root.addChild(this.worldFrame);
    this.root.addChild(this.previewLayer);
    this.root.addChild(this.piecesLayer);
    this.root.addChild(this.fxLayer);
    this.piecesLayer.sortableChildren = true;
    app.stage.addChild(this.root);

    this.viewport = new Viewport(this.root);
    this.viewport.resize(app.screen.width, app.screen.height, this.core.W, this.core.H);
    this.viewport.fitWorld();

    this.buildWorldFrame();
    this.buildPreview(opts.showPreview);
    this.buildSprites();

    this.indicator = new SnapIndicator(this.fxLayer, this.tweens);

    // 核心事件
    this.core.events = {
      onProgress: (pct) => this.callbacks.onProgress?.(pct),
      onComplete: () => {
        sfx.complete();
        this.callbacks.onComplete?.();
        this.callbacks.onDirty?.();
      },
      onSnap: (e: SnapEvent) => {
        sfx.snap();
        this.indicator?.show(e, this.viewport.scale);
      },
      onMove: () => {
        this.callbacks.onMove?.(this.core.moves);
        this.callbacks.onDirty?.();
      },
    };

    // 输入
    this.input = new InputController(app.canvas, this);
    this.input.attach();

    // 渲染循环
    app.ticker.add(() => {
      this.tweens.update(app.ticker.deltaMS);
      this.syncSprites();
    });

    // WebGL 上下文丢失恢复
    this.contextLostHandler = (e: Event) => e.preventDefault();
    this.contextRestoredHandler = () => this.refreshTextures();
    app.canvas.addEventListener('webglcontextlost', this.contextLostHandler);
    app.canvas.addEventListener('webglcontextrestored', this.contextRestoredHandler);
  }

  /* ---------------- 场景构建 ---------------- */

  private buildWorldFrame() {
    const g = this.worldFrame;
    g.clear();
    g.roundRect(0, 0, this.core.W, this.core.H, 12)
      .fill({ color: 0x808080, alpha: 0.05 })
      .stroke({ color: 0x808080, alpha: 0.22, width: 1.5 });
  }

  private buildPreview(show: boolean) {
    this.previewLayer.removeChildren().forEach((c) => c.destroy());
    const rect = this.core.previewRect;
    const tex = Texture.from(this.subject.canvas);
    const sprite = new Sprite(tex);
    sprite.position.set(rect.x, rect.y);
    // 预览画布是高分辨率（×dpr），显示为逻辑尺寸
    sprite.width = rect.w;
    sprite.height = rect.h;
    sprite.alpha = 0.18;
    const border = new Graphics();
    border
      .rect(rect.x, rect.y, rect.w, rect.h)
      .stroke({ color: 0xffffff, alpha: 0.12, width: 1 });
    this.previewLayer.addChild(sprite, border);
    this.previewLayer.visible = show;
  }

  private buildSprites() {
    for (const view of this.views.values()) view.sprite.destroy();
    this.views.clear();
    this.piecesLayer.removeChildren();
    if (!this.atlas) return;

    const pageTextures = this.atlas.pages.map((p) => {
      const tex = Texture.from(p.canvas);
      // 高分辨率烘焙 + mipmap：显示尺寸小于烘焙尺寸时保持锐利
      tex.source.autoGenerateMipmaps = true;
      tex.source.scaleMode = 'linear';
      return tex;
    });
    for (const piece of this.core.pieces) {
      const ref = piece.atlasRef!;
      const tex = new Texture({
        source: pageTextures[ref.page].source,
        frame: new Rectangle(ref.frameX, ref.frameY, ref.frameW, ref.frameH),
      });
      const sprite = new Sprite(tex);
      sprite.width = piece.width;
      sprite.height = piece.height;
      sprite.anchor.set(
        (piece.core.x + piece.core.width / 2) / piece.width,
        (piece.core.y + piece.core.height / 2) / piece.height
      );
      this.piecesLayer.addChild(sprite);
      this.views.set(piece, { sprite, dx: 0, dy: 0, dr: 0 });
    }
    this.syncSprites();
  }

  private refreshTextures() {
    if (!this.atlas) return;
    for (const page of this.atlas.pages) {
      const tex = Texture.from(page.canvas);
      tex.source.update();
    }
  }

  /* ---------------- 每帧同步 ---------------- */

  private syncSprites() {
    const dragGroup = this.core.drag?.group ?? null;
    for (const [piece, view] of this.views) {
      const s = view.sprite;
      s.position.set(piece.x + view.dx, piece.y + view.dy);
      s.rotation = ((piece.angle + view.dr) * Math.PI) / 180;
      if (s.zIndex !== piece.z) s.zIndex = piece.z;
      // 拖拽视觉反馈：轻微放大
      const held = dragGroup !== null && piece.group === dragGroup;
      const targetScale = held ? 1.03 : 1;
      const base = piece.width; // sprite.width 受 scale 影响，直接控制 scale
      const cur = s.width / base;
      if (Math.abs(cur - targetScale) > 0.001) {
        s.width = piece.width * targetScale;
        s.height = piece.height * targetScale;
      }
    }
  }

  /* ---------------- 对外操作 ---------------- */

  /** 拖放结束后由输入层调用：让位置突变以回弹动画呈现 */
  animateModelJump(before: Map<Piece, { x: number; y: number }>) {
    for (const [piece, pos] of before) {
      if (piece.x === pos.x && piece.y === pos.y) continue;
      const view = this.views.get(piece);
      if (!view) continue;
      this.tweens.kill(view);
      view.dx = pos.x - piece.x;
      view.dy = pos.y - piece.y;
      this.tweens.to(view as unknown as Record<string, number>, { dx: 0, dy: 0 }, SETTLE_MS, easeOutQuad);
    }
  }

  /** 旋转组（含补间）。pivot 默认为持有/命中块 */
  rotateGroupAnimated(piece: Piece, dir: 1 | -1) {
    if (!this.core.rotationEnabled || this.core.complete) return;
    const group = piece.group!;
    const before = new Map(
      group.pieces.map((p) => [p, { x: p.x, y: p.y, angle: p.angle }])
    );
    this.core.rotateGroup(group, piece, dir);
    for (const [p, prev] of before) {
      const view = this.views.get(p);
      if (!view) continue;
      this.tweens.kill(view);
      view.dx = prev.x - p.x;
      view.dy = prev.y - p.y;
      // 旋转方向取最短路径（±90）
      view.dr = -dir * 90;
      this.tweens.to(
        view as unknown as Record<string, number>,
        { dx: 0, dy: 0, dr: 0 },
        ROTATE_MS,
        easeOutQuad
      );
    }
  }

  scatter(partial: boolean) {
    const before = new Map(
      this.core.pieces.map((p) => [p, { x: p.x, y: p.y }])
    );
    this.core.scatter(partial);
    // 散布用较长的补间呈现
    for (const [piece, pos] of before) {
      if (piece.x === pos.x && piece.y === pos.y) continue;
      const view = this.views.get(piece);
      if (!view) continue;
      this.tweens.kill(view);
      view.dx = pos.x - piece.x;
      view.dy = pos.y - piece.y;
      this.tweens.to(
        view as unknown as Record<string, number>,
        { dx: 0, dy: 0 },
        420,
        easeOutQuad
      );
    }
    this.callbacks.onProgress?.(this.core.percent());
    this.callbacks.onDirty?.();
  }

  setPreview(show: boolean) {
    this.previewLayer.visible = show;
  }

  setPaused(paused: boolean) {
    this.paused = paused;
    if (!this.app) return;
    if (paused) this.app.ticker.stop();
    else this.app.ticker.start();
  }

  getSave(elapsed: number): SaveGameV6 {
    return serialize(this.core, elapsed);
  }

  /** 收集调试信息：图片/画布尺寸、块位置、实体重叠检测 */
  getDebugInfo(): PuzzleDebugInfo {
    const core = this.core;
    const src = this.subject.source;
    const natW =
      src instanceof HTMLImageElement
        ? src.naturalWidth
        : src instanceof ImageBitmap
          ? src.width
          : this.subject.width;
    const natH =
      src instanceof HTMLImageElement
        ? src.naturalHeight
        : src instanceof ImageBitmap
          ? src.height
          : this.subject.height;

    const pieces: DebugPieceInfo[] = core.pieces.map((p) => {
      const b = pieceBounds(p);
      return {
        id: p.id,
        row: p.row,
        col: p.col,
        x: Math.round(p.x * 100) / 100,
        y: Math.round(p.y * 100) / 100,
        angle: p.angle,
        width: p.width,
        height: p.height,
        bounds: {
          x: Math.round(b.x),
          y: Math.round(b.y),
          w: Math.round(b.w),
          h: Math.round(b.h),
        },
        group: p.group?.id ?? p.id,
        groupSize: p.group?.pieces.length ?? 1,
        hasMoved: p.hasMoved,
      };
    });

    // 实体（不透明）重叠：外接框每边收缩 MARGIN 后仍相交
    const overlaps: DebugOverlapPair[] = [];
    const bs = core.pieces.map((p) => pieceBounds(p));
    for (let i = 0; i < core.pieces.length; i++) {
      const a = bs[i];
      for (let j = i + 1; j < core.pieces.length; j++) {
        const c = bs[j];
        const ox =
          Math.min(a.x + a.w - MARGIN, c.x + c.w - MARGIN) -
          Math.max(a.x + MARGIN, c.x + MARGIN);
        const oy =
          Math.min(a.y + a.h - MARGIN, c.y + c.h - MARGIN) -
          Math.max(a.y + MARGIN, c.y + MARGIN);
        if (ox > 0.5 && oy > 0.5) {
          overlaps.push({
            a: core.pieces[i].id,
            b: core.pieces[j].id,
            depthX: Math.round(ox),
            depthY: Math.round(oy),
          });
        }
      }
    }

    return {
      image: {
        naturalWidth: natW,
        naturalHeight: natH,
        subjectWidth: this.subject.width,
        subjectHeight: this.subject.height,
        subjectCanvasWidth: this.subject.canvas.width,
        subjectCanvasHeight: this.subject.canvas.height,
      },
      board: {
        worldWidth: core.W,
        worldHeight: core.H,
        screenWidth: this.app ? Math.round(this.app.screen.width) : 0,
        screenHeight: this.app ? Math.round(this.app.screen.height) : 0,
        viewScale: Math.round(this.viewport.scale * 1000) / 1000,
        devicePixelRatio:
          typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
      },
      atlas: {
        pages: this.atlas?.pages.length ?? 0,
        bakeDpr: this.atlas?.bakeDpr ?? 1,
      },
      pieceCount: core.pieces.length,
      choice: core.choice,
      pieces,
      overlaps,
      overlapCount: overlaps.length,
      complete: core.complete,
      moves: core.moves,
      percent: core.percent(),
    };
  }

  resize() {
    if (!this.app) return;
    this.viewport.resize(
      this.app.screen.width,
      this.app.screen.height,
      this.core.W,
      this.core.H
    );
  }

  destroy() {
    this.destroyed = true;
    this.input?.destroy();
    this.indicator?.destroy();
    this.tweens.clear();
    if (this.app) {
      if (this.contextLostHandler)
        this.app.canvas.removeEventListener('webglcontextlost', this.contextLostHandler);
      if (this.contextRestoredHandler)
        this.app.canvas.removeEventListener('webglcontextrestored', this.contextRestoredHandler);
      this.app.destroy(true, { children: true, texture: true });
      this.app = null;
    }
    this.views.clear();
  }
}

/** 工厂：创建并初始化游戏实例 */
export async function createPuzzleGame(
  opts: CreateGameOptions
): Promise<PuzzleGame> {
  const game = new PuzzleGame();
  await game.init(opts);
  return game;
}

export type { PieceChoice, SaveGameV6 };
