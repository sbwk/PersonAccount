export type VaultMetaRecord = {
  id: 'meta';
  version: 1;
  kdfSaltB64: string;
  kdfIterations: number;
  createdAt: string;
  updatedAt: string;
};

export type VaultCipherRecord = {
  id: 'vault';
  nonceB64: string;
  ciphertextB64: string;
  updatedAt: string;
};

const DB_NAME = 'person-account-vault';
const DB_VERSION = 1;

function reqToPromise<T>(req: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function txDone(tx: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onabort = () => reject(tx.error);
    tx.onerror = () => reject(tx.error);
  });
}

async function openDb() {
  const req = indexedDB.open(DB_NAME, DB_VERSION);
  req.onupgradeneeded = () => {
    const db = req.result;
    if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'id' });
    if (!db.objectStoreNames.contains('vault')) db.createObjectStore('vault', { keyPath: 'id' });
  };
  return reqToPromise(req);
}

export async function getMeta() {
  const db = await openDb();
  const tx = db.transaction('meta', 'readonly');
  const store = tx.objectStore('meta');
  const meta = await reqToPromise(store.get('meta'));
  await txDone(tx);
  return (meta ?? null) as VaultMetaRecord | null;
}

export async function setMeta(meta: VaultMetaRecord) {
  const db = await openDb();
  const tx = db.transaction('meta', 'readwrite');
  tx.objectStore('meta').put(meta);
  await txDone(tx);
}

export async function getVaultCipher() {
  const db = await openDb();
  const tx = db.transaction('vault', 'readonly');
  const store = tx.objectStore('vault');
  const rec = await reqToPromise(store.get('vault'));
  await txDone(tx);
  return (rec ?? null) as VaultCipherRecord | null;
}

export async function setVaultCipher(rec: VaultCipherRecord) {
  const db = await openDb();
  const tx = db.transaction('vault', 'readwrite');
  tx.objectStore('vault').put(rec);
  await txDone(tx);
}

