import crypto from 'crypto'

const algorithm = 'aes-256-ctr'
const secretKey = crypto.scryptSync(
  process.env.TOKEN_ENCRYPTION_SECRET!,
  process.env.TOKEN_ENCRYPTION_SALT!,
  32
)

const zero = Buffer.from([0])

export const encrypt = (data: Buffer) => {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
  const encrypted = Buffer.concat([cipher.update(Buffer.concat([zero, data])), cipher.final()])
  return Buffer.concat([iv, encrypted])
}

export const decrypt = (data: Buffer) => {
  const iv = data.slice(0, 16)
  const content = data.slice(16)
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv)
  const decrypted = decipher.update(content)
  if (decrypted[0] !== 0) {
    throw Error('Invalid data')
  }
  return Buffer.concat([decrypted.slice(1), decipher.final()])
}