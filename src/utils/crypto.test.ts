import { describe, expect, it } from 'vitest';
import { webcrypto } from 'node:crypto';
import { createKdfParams, decryptJson, deriveAesKey, encryptJson } from '@/utils/crypto';

if (!globalThis.crypto) {
  (globalThis as unknown as { crypto: Crypto }).crypto = webcrypto as unknown as Crypto;
}
if (!globalThis.isSecureContext) {
  (globalThis as unknown as { isSecureContext: boolean }).isSecureContext = true;
}

describe('crypto vault', () => {
  it('encrypt/decrypt roundtrip', async () => {
    const kdf = createKdfParams();
    const key = await deriveAesKey('correct horse battery staple', kdf);
    const cipher = await encryptJson(key, { a: 1, b: 'x' });
    const plain = await decryptJson<{ a: number; b: string }>(key, cipher);
    expect(plain).toEqual({ a: 1, b: 'x' });
  });
});
