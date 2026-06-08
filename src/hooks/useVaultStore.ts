import { create } from 'zustand';
import { createKdfParams, decryptJson, deriveAesKey, encryptJson } from '@/utils/crypto';
import { getMeta, getVaultCipher, setMeta, setVaultCipher } from '@/utils/db';
import type { Account, AccountKey, VaultPlain } from '@/types';

type VaultStatus = 'loading' | 'locked' | 'unlocked';

type VaultState = {
  status: VaultStatus;
  initialized: boolean;
  accounts: Account[];
  key: CryptoKey | null;
  error: string | null;

  bootstrap: () => Promise<void>;
  initMaster: (password: string) => Promise<void>;
  unlock: (password: string) => Promise<void>;
  lock: () => void;

  upsertAccount: (
    input: Omit<Account, 'id' | 'createdAt' | 'updatedAt' | 'keys'> &
      Partial<Pick<Account, 'id'>> & { keys?: AccountKey[] },
  ) => Promise<string>;
  deleteAccount: (id: string) => Promise<void>;
  getAccount: (id: string) => Account | null;
};

function nowIso() {
  return new Date().toISOString();
}

function newId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `id_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

async function persistVault(key: CryptoKey, plain: VaultPlain) {
  const cipher = await encryptJson(key, plain);
  await setVaultCipher({ id: 'vault', ...cipher, updatedAt: nowIso() });
}

export const useVaultStore = create<VaultState>((set, get) => ({
  status: 'loading',
  initialized: false,
  accounts: [],
  key: null,
  error: null,

  bootstrap: async () => {
    set({ status: 'loading', error: null });
    const meta = await getMeta();
    set({ initialized: Boolean(meta), status: 'locked' });
  },

  initMaster: async (password: string) => {
    set({ error: null });
    const kdf = createKdfParams();
    const createdAt = nowIso();
    await setMeta({
      id: 'meta',
      version: 1,
      kdfSaltB64: kdf.saltB64,
      kdfIterations: kdf.iterations,
      createdAt,
      updatedAt: createdAt,
    });

    const key = await deriveAesKey(password, { saltB64: kdf.saltB64, iterations: kdf.iterations });
    await persistVault(key, { accounts: [] });
    set({ initialized: true, status: 'unlocked', key, accounts: [], error: null });
  },

  unlock: async (password: string) => {
    set({ error: null });
    const meta = await getMeta();
    const vaultCipher = await getVaultCipher();
    if (!meta || !vaultCipher) {
      set({ initialized: false, status: 'locked', key: null, accounts: [] });
      return;
    }

    try {
      const key = await deriveAesKey(password, { saltB64: meta.kdfSaltB64, iterations: meta.kdfIterations });
      const plain = await decryptJson<VaultPlain>(key, vaultCipher);
      const accounts = (plain.accounts ?? []).map((a) => ({ ...a, keys: a.keys ?? [] }));
      set({ initialized: true, status: 'unlocked', key, accounts, error: null });
    } catch {
      set({ status: 'locked', key: null, accounts: [], error: '主密码不正确或数据已损坏' });
    }
  },

  lock: () => {
    set({ status: 'locked', key: null, accounts: [], error: null });
  },

  upsertAccount: async (input) => {
    const { key } = get();
    if (!key) throw new Error('locked');

    const id = input.id ?? newId();
    const existing = get().accounts.find((a) => a.id === id);
    const createdAt = existing?.createdAt ?? nowIso();
    const updatedAt = nowIso();

    const next: Account = {
      id,
      title: input.title,
      category: input.category,
      login: input.login,
      password: input.password,
      keys: input.keys ?? existing?.keys ?? [],
      url: input.url || undefined,
      registeredAt: input.registeredAt || undefined,
      level: input.level || undefined,
      expiresAt: input.expiresAt || undefined,
      billing: input.billing,
      note: input.note || undefined,
      createdAt,
      updatedAt,
    };

    const accounts = existing
      ? get().accounts.map((a) => (a.id === id ? next : a))
      : [next, ...get().accounts];

    set({ accounts });
    await persistVault(key, { accounts });
    return id;
  },

  deleteAccount: async (id) => {
    const { key } = get();
    if (!key) throw new Error('locked');
    const accounts = get().accounts.filter((a) => a.id !== id);
    set({ accounts });
    await persistVault(key, { accounts });
  },

  getAccount: (id) => {
    return get().accounts.find((a) => a.id === id) ?? null;
  },
}));
