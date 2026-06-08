export function bytesToBase64(bytes: Uint8Array) {
  if (typeof btoa === 'function') {
    let s = '';
    for (let i = 0; i < bytes.length; i += 1) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  }
  return Buffer.from(bytes).toString('base64');
}

export function base64ToBytes(b64: string) {
  if (typeof atob === 'function') {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }
  return new Uint8Array(Buffer.from(b64, 'base64'));
}

export function utf8ToBytes(s: string) {
  return new TextEncoder().encode(s);
}

export function bytesToUtf8(bytes: Uint8Array) {
  return new TextDecoder().decode(bytes);
}
