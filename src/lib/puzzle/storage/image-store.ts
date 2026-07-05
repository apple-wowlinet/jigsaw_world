/**
 * ImageStore —— 零依赖 IndexedDB 图片库
 * DB `jigsaw-world` / store `images`：{ key, blob, name, w, h, createdAt }
 * LRU 保留最近 20 张（putImage 时淘汰最旧）。
 */
const DB_NAME = 'jigsaw-world';
const DB_VERSION = 1;
const STORE = 'images';
const MAX_IMAGES = 20;

export interface StoredImage {
  key: string;
  blob: Blob;
  name: string;
  w: number;
  h: number;
  createdAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'key' });
        store.createIndex('createdAt', 'createdAt');
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('IndexedDB open failed'));
  });
}

function tx<T>(
  db: IDBDatabase,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const req = fn(t.objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('IndexedDB tx failed'));
  });
}

export async function putImage(
  blob: Blob,
  name: string,
  w: number,
  h: number
): Promise<string> {
  const db = await openDB();
  const key = `img-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const record: StoredImage = { key, blob, name, w, h, createdAt: Date.now() };
  await tx(db, 'readwrite', (s) => s.put(record));
  await pruneOldest(db);
  db.close();
  return key;
}

export async function getImage(key: string): Promise<StoredImage | null> {
  try {
    const db = await openDB();
    const rec = await tx<StoredImage | undefined>(db, 'readonly', (s) => s.get(key));
    db.close();
    return rec ?? null;
  } catch {
    return null;
  }
}

export async function deleteImage(key: string): Promise<void> {
  try {
    const db = await openDB();
    await tx(db, 'readwrite', (s) => s.delete(key));
    db.close();
  } catch {
    /* ignore */
  }
}

/** 淘汰最旧记录，保留 MAX_IMAGES 张 */
async function pruneOldest(db: IDBDatabase) {
  const keys = await new Promise<{ key: string; createdAt: number }[]>(
    (resolve, reject) => {
      const out: { key: string; createdAt: number }[] = [];
      const t = db.transaction(STORE, 'readonly');
      const idx = t.objectStore(STORE).index('createdAt');
      const req = idx.openCursor();
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          const v = cursor.value as StoredImage;
          out.push({ key: v.key, createdAt: v.createdAt });
          cursor.continue();
        } else {
          resolve(out);
        }
      };
      req.onerror = () => reject(req.error);
    }
  );
  if (keys.length <= MAX_IMAGES) return;
  const excess = keys.slice(0, keys.length - MAX_IMAGES);
  for (const k of excess) {
    await tx(db, 'readwrite', (s) => s.delete(k.key));
  }
}
