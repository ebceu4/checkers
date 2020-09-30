import { User } from 'telegraf/typings/telegram-types'
import { decrypt, encrypt } from './crypto'
import { fromBase64, numberFromBytes, numberToBytes, shortStringFromBytes, shortStringToBytes, toBase64 } from './utils'

export type CallbackQueryToken = {
  id: string
  user: {
    id: number
    first_name: string
    username?: string
  }
}

export const stringifyCallbackQueryToken = ({ id, user }: CallbackQueryToken) => {
  const data = Buffer.concat([
    shortStringToBytes(id),
    numberToBytes(user.id),
    shortStringToBytes(user.first_name),
    user.username ? shortStringToBytes(user.username) : Buffer.alloc(0),
  ])


  return toBase64(encrypt(data))
    .replace(/[\+\/\=]/g, (x: string) => ({ '+': '.', '/': '_', '=': '-' } as any)[x])
}

export const parseCallbackQueryToken = (raw: string) => {
  const buffer = decrypt(fromBase64(raw.replace(/[\.\_\-]/g, (x: string) => ({ '.': '+', '_': '/', '-': '=' } as any)[x])))
  const { value: id, rest: r1 } = shortStringFromBytes(buffer)
  const userId = numberFromBytes(r1)
  const { value: first_name, rest: r2 } = shortStringFromBytes(r1.slice(8))
  const { value: username } = r2.length !== 0 ? shortStringFromBytes(r2) : { value: undefined }
  return { id, user: { id: userId, first_name, username } } as CallbackQueryToken
}
