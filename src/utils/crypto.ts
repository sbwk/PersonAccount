import { base64ToBytes, bytesToBase64, bytesToUtf8, utf8ToBytes } from '@/utils/encoding';

export type KdfParams = {
  saltB64: string;
  iterations: number;
};

export type VaultCipher = {
  nonceB64: string;
  ciphertextB64: string;
};

export function randomBytes(len: number) {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return bytes;
}

export async function deriveAesKey(password: string, params: KdfParams) {
  const salt = base64ToBytes(params.saltB64);
  const keyMaterial = await crypto.subtle.importKey('raw', utf8ToBytes(password), 'PBKDF2', false, [
    'deriveKey',
  ]);

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt,
      iterations: params.iterations,
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encryptJson(key: CryptoKey, value: unknown): Promise<VaultCipher> {
  const nonce = randomBytes(12);
  const plaintext = utf8ToBytes(JSON.stringify(value));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, key, plaintext);
  return {
    nonceB64: bytesToBase64(nonce),
    ciphertextB64: bytesToBase64(new Uint8Array(ciphertext)),
  };
}

export async function decryptJson<T>(key: CryptoKey, cipher: VaultCipher): Promise<T> {
  const nonce = base64ToBytes(cipher.nonceB64);
  const ciphertext = base64ToBytes(cipher.ciphertextB64);
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: nonce }, key, ciphertext);
  return JSON.parse(bytesToUtf8(new Uint8Array(plaintext))) as T;
}

export function createKdfParams() {
  return {
    saltB64: bytesToBase64(randomBytes(16)),
    iterations: 310_000,
  } satisfies KdfParams;
}

export function scorePasswordStrength(pw: string) {
  const len = pw.length;
  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasDigit = /\d/.test(pw);
  const hasSymbol = /[^a-zA-Z0-9]/.test(pw);

  let score = 0;
  if (len >= 12) score += 2;
  else if (len >= 10) score += 1;

  if (hasLower) score += 1;
  if (hasUpper) score += 1;
  if (hasDigit) score += 1;
  if (hasSymbol) score += 1;

  const level: 'weak' | 'medium' | 'strong' = score >= 6 ? 'strong' : score >= 4 ? 'medium' : 'weak';
  return { score, level };
}

