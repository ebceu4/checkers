import Redis from 'ioredis'

export const createRedisSubscriber = () => {
  const redisSubscriber = new Redis(process.env.REDIS_URL)
  const redisReader = new Redis(process.env.REDIS_URL)

  const on = (type: 'subscribe' | 'psubscribe') => async (key: string, action: 'set', handler: (value: string | null) => void) => {
    await redisSubscriber[type](`__keyspace@0__:${key}`)
    redisSubscriber.on('message', async (channel, a) => {
      if (a === action) {
        const value = await redisReader.get(key)
        handler(value)
      }
    })

    return () => redisSubscriber.unsubscribe(`__keyspace@0__:${key}`)
  }

  return {
    on
  }
}


//   return () =>
//     redisSubscriber.unsubscribe(`__keyspace@0__:${key}`)
// }

//__keyevent@0__:set
//psubscribe '__key*__:*'
