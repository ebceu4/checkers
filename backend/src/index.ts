import { telegramBot } from './telegramBot'
import { server } from './server'

console.log('BACKEND BOOT', {
  INTERNAL_BACKEND_WS_PORT: process.env.INTERNAL_BACKEND_WS_PORT,
  GAME_QUERY_URI: process.env.GAME_QUERY_URI,
})

telegramBot()
  .startPolling()

server()
  .start()


  

  