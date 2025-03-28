import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto'

function normalizeKey(key: string): Buffer {
  // Use SHA-256 to generate a 32-byte key from any input string
  return createHash('sha256').update(key).digest()
}

const ENCRYPTION_KEY = normalizeKey(process.env.ENCRYPTION_KEY || 'default-key-please-change-in-production')
const ALGORITHM = 'aes-256-cbc'

export function encrypt(text: string) {
  const iv = randomBytes(16)
  const cipher = createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return `${iv.toString('hex')}:${encrypted}`
}

export function decrypt(text: string) {
  const [ivHex, encryptedText] = text.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const decipher = createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv)
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}