import Telegraf from 'telegraf'
import { stringifyCallbackQueryToken } from './queryToken'

export const telegramBot = () => {
  const bot = new Telegraf(process.env.BOT_TOKEN!)

  bot.gameQuery(async (ctx) => {
    const { callbackQuery } = ctx
    console.log('gameQuery', callbackQuery)
    const token = stringifyCallbackQueryToken({ id: callbackQuery?.inline_message_id!, user: callbackQuery?.from! })
    ctx.answerGameQuery(`https://${process.env.DOMAIN}?${token}`)
    const markup = JSON.stringify({
      inline_keyboard: [
        [{ text: 'BOOM!', callback_game: 'Checkers' }],
      ],
    })

    //await ctx.telegram.editMessageText(undefined, undefined, callbackQuery?.inline_message_id!, `[${callbackQuery?.from.first_name}](tg://user?id=${callbackQuery?.from.id})`, { parse_mode: 'MarkdownV2' })
    //const r = await ctx.telegram.editMessageReplyMarkup(undefined, undefined, callbackQuery?.inline_message_id!, markup)
    //console.log(r)

  })

  bot.on('inline_query', (ctx) => {
    ctx.answerInlineQuery([
      {
        type: 'game',
        id: 'checkers',
        game_short_name: 'Checkers',
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Play', callback_game: 'Checkers' }],
          ],
        },
      }])
  })

  bot.start((ctx) => {
    ctx.reply('Welcome')
    console.log('on start')
  })
  bot.help((ctx) => ctx.reply('Send me a sticker'))
  bot.on('sticker', (ctx) => ctx.reply('👍'))
  bot.hears('hi', (ctx) => ctx.reply('Hey there'))

  return {
    startPolling() {
      console.log('startPolling')
      bot.startPolling()
    }
  }
}
