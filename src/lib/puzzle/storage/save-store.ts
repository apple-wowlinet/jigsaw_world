/**
 * SaveStore —— localStorage 存档槽 + 设置
 * key 方案：jw:save:<puzzleId>:<nop>（puzzleId = 目录 slug 或 idb:<key>）
 */
import type { SaveGameV6 } from '@/lib/puzzle/core/types';

const SAVE_PREFIX = 'jw:save:';
const ROTATION_KEY = 'jw:rotation';

type StoredSaveGameV6 = SaveGameV6 & {
  savedAt?: number;
};

export interface PuzzleSaveSummary {
  puzzleId: string;
  nop: number;
  progressPercent: number;
  connectedPieces: number;
  totalPieces: number;
  savedAt: number;
  elapsed: number;
  moves: number;
}

export function saveKey(puzzleId: string, nop: number) {
  return `${SAVE_PREFIX}${puzzleId}:${nop}`;
}

export function loadSave(puzzleId: string, nop: number): SaveGameV6 | null {
  try {
    const raw = localStorage.getItem(saveKey(puzzleId, nop));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SaveGameV6;
    if (parsed.v !== 6 || !Array.isArray(parsed.pieces)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function storeSave(puzzleId: string, save: SaveGameV6) {
  try {
    const storedSave: StoredSaveGameV6 = { ...save, savedAt: Date.now() };
    localStorage.setItem(saveKey(puzzleId, save.nop), JSON.stringify(storedSave));
  } catch {
    // 容量满/隐私模式：静默失败
  }
}

export function clearSave(puzzleId: string, nop: number) {
  try {
    localStorage.removeItem(saveKey(puzzleId, nop));
  } catch {
    /* ignore */
  }
}

/**
 * 列出浏览器中尚未完成的拼图存档，最近保存的排在最前。
 * 旧版存档没有 savedAt，使用游戏时长和移动次数作为稳定的降级排序。
 */
export function listPuzzleSaves(): PuzzleSaveSummary[] {
  if (typeof window === 'undefined') return [];

  const saves: PuzzleSaveSummary[] = [];

  try {
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (!key?.startsWith(SAVE_PREFIX)) continue;

      const slot = key.slice(SAVE_PREFIX.length);
      const separator = slot.lastIndexOf(':');
      if (separator <= 0) continue;

      const puzzleId = slot.slice(0, separator);
      const nop = Number(slot.slice(separator + 1));
      const raw = localStorage.getItem(key);
      if (!raw || !Number.isSafeInteger(nop) || nop <= 0) continue;

      const save = JSON.parse(raw) as StoredSaveGameV6;
      if (
        save.v !== 6 ||
        save.nop !== nop ||
        !Array.isArray(save.pieces) ||
        save.pieces.length === 0
      ) {
        continue;
      }

      const groupSizes = new Map<number, number>();
      let connectedPieces = 1;
      for (const piece of save.pieces) {
        if (piece.g <= 0) continue;
        const groupSize = (groupSizes.get(piece.g) ?? 0) + 1;
        groupSizes.set(piece.g, groupSize);
        connectedPieces = Math.max(connectedPieces, groupSize);
      }

      const totalPieces = save.pieces.length;
      const progressPercent = totalPieces > 1
        ? Math.round(((connectedPieces - 1) / (totalPieces - 1)) * 99)
        : 0;

      saves.push({
        puzzleId,
        nop,
        progressPercent,
        connectedPieces,
        totalPieces,
        savedAt: typeof save.savedAt === 'number' ? save.savedAt : 0,
        elapsed: typeof save.elapsed === 'number' ? save.elapsed : 0,
        moves: typeof save.moves === 'number' ? save.moves : 0,
      });
    }
  } catch {
    return [];
  }

  return saves.sort(
    (a, b) =>
      b.savedAt - a.savedAt ||
      b.elapsed - a.elapsed ||
      b.moves - a.moves
  );
}

/* ---------------- 设置 ---------------- */

export function getRotationPref(): boolean {
  try {
    return localStorage.getItem(ROTATION_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setRotationPref(on: boolean) {
  try {
    localStorage.setItem(ROTATION_KEY, String(on));
  } catch {
    /* ignore */
  }
}
