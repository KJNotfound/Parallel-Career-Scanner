/** SHA-256 摘要，用于确定性分支选取。 */
export async function sha256Bytes(input: string): Promise<Uint8Array> {
  const data = new TextEncoder().encode(input)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return new Uint8Array(buf)
}

export function u32At(bytes: Uint8Array, offset: number): number {
  const i = offset
  return (
    (bytes[i]! << 24) |
    (bytes[i + 1]! << 16) |
    (bytes[i + 2]! << 8) |
    bytes[i + 3]!
  ) >>> 0
}

export function modPositive(bytes: Uint8Array, offset: number, modulus: number): number {
  if (modulus <= 0) return 0
  return u32At(bytes, offset) % modulus
}

export function bytesToHex(bytes: Uint8Array, maxLen = 32): string {
  let s = ''
  const n = Math.min(bytes.length, maxLen)
  for (let i = 0; i < n; i++) {
    s += bytes[i]!.toString(16).padStart(2, '0')
  }
  return s
}
