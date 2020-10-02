export const toBase64 = (data: Buffer) =>
  data.toString('base64')

export const fromBase64 = (data: string) =>
  Buffer.from(data, 'base64')

export const shortStringToBytes = (data: string) => {
  const encoded = Buffer.from(data, 'utf8')
  if (encoded.byteLength > 255)
    throw new Error('Data is too big')
  return Buffer.concat([Buffer.from([encoded.byteLength]), encoded])
}

export const shortStringFromBytes = (data: Buffer) => {
  const len = data.readUInt8(0)
  const str = data.slice(1, len + 1)
  return { value: str.toString('utf8'), rest: data.slice(len + 1) }
}

export const numberToBytes = (data: number) => {
  const b = Buffer.alloc(8)
  b.writeBigUInt64BE(BigInt(data))
  return b
}

export const numberFromBytes = (data: Buffer) =>
  parseInt(Buffer.from(data).readBigUInt64BE(0).toString())
