/// <reference types="@svgdotjs/svg.js" />

import { createApp } from './app'
import './style.scss'
import { ILogger, INotifier } from './types'

const logger: ILogger = {
  info: (value, ...args) => {
    const info = document.querySelector('.infoInline')! as HTMLElement
    info.innerHTML = (info.innerHTML ?? '') + '<br/>' + value
    if (args && args.length > 0)
      info.innerHTML = (info.innerHTML ?? '') + '<br/>' + JSON.stringify(args)

    console.log(value, ...args)
  }
}


logger.info('CLIENT BOOT', {
  DEV_BACKEND_WS_PORT: process.env.DEV_BACKEND_WS_PORT
})


const notifier: INotifier = {
  showPermanent(text: string) {
    const message = document.querySelector('.message')! as HTMLElement
    console.log(message)
    message.innerHTML = text
    message.classList.add('visible')
  },
  hideAll() {
    const message = document.querySelector('.message')! as HTMLElement
    message.classList.remove('visible')
  },
  show(text) {
    this.showPermanent(text)
    setTimeout(() => {
      const message = document.querySelector('.message')! as HTMLElement
      if (message.innerHTML === text)
        this.hideAll()
    }, 5000)
  },
}


const init = () => {
  const token = window.location.href.split('?')[1]
  createApp({
    window,
    wsUri: process.env.SERVER_URL!,
    token,
    notifier,
    logger,
  })
}

init()




