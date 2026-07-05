/**
 * SaveStore —— localStorage 存档槽 + 设置
 * key 方案：jw:save:<puzzleId>:<nop>（puzzleId = 目录 slug 或 idb:<key>）
 */
import type { SaveGameV6 } from '@/lib/puzzle/core/types';

const SAVE_PREFIX = 'jw:save:';
const ROTATION_KEY = 'jw:rotation';

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
    localStorage.setItem(saveKey(puzzleId, save.nop), JSON.stringify(save));
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
