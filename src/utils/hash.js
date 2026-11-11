const EMPTY_SHA256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'

export async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Pitch-demo helper: simulates what happens when a payload is altered after pinning.
 * Any change to the input produces a completely different SHA-256 digest (avalanche effect).
 */
export async function forgeTamperedHash(originalHash) {
  return globalThis.crypto?.subtle ? sha256Hex(`tampered:${originalHash}`) : EMPTY_SHA256
}
