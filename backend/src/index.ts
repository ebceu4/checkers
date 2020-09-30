import { telegramBot } from './telegramBot'
import { server } from './server'

console.log('BACKEND BOOT', {
  FRONTEND_PORT: process.env.FRONTEND_PORT,
  FRONTEND_HOST: process.env.FRONTEND_HOST,
  BACKEND_API_PORT: process.env.BACKEND_API_PORT,
})

telegramBot()
  .startPolling()

server()
  .start()


  

  