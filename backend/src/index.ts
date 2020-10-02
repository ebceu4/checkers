import { telegramBot } from './telegramBot'
import { server } from './server'

console.log('BACKEND BOOT', {
  INTERNAL_BACKEND_WS_PORT: process.env.INTERNAL_BACKEND_WS_PORT,
  DOMAIN: process.env.DOMAIN,
  REDIS_URL: process.env.REDIS_URL,
})

telegramBot()
  .startPolling()

server()
  .start()


  

  