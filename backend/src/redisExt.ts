import { Redis } from 'ioredis'
import _ from 'lodash'

export const redisExt = (redis: Redis) => {

  return {
    entries: <TEntry>() => {
      const get = (key: string) =>
        redis.get(key).then(x => x ? JSON.parse(x) as TEntry : null)

      const set = (key: string, value: TEntry) =>
        redis.set(key, JSON.stringify(value))

      const merge = (key: string, value: TEntry) =>
        get(key)
          .then(existing => existing ? _.merge(existing, value) : value)
          .then(merged => set(key, merged))

      return {
        get,
        set,
        merge,
      }
    }
  }
}