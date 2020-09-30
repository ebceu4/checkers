/// <reference types="@svgdotjs/svg.js" />

import { createApp } from './app'
import './style.scss'
import { INotifier } from './types'


console.log('CLIENT BOOT', {
  SERVER_URL: process.env.SERVER_URL,
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



const logInfo = (value: string, args?: any) => {
  const info = document.querySelector('.infoInline')! as HTMLElement
  info.innerHTML = (info.innerHTML ?? '') + '<br/>' + value
  if (args)
    info.innerHTML = (info.innerHTML ?? '') + '<br/>' + JSON.stringify(args)
}

logInfo('CLIENT BOOT SERVER: ' + process.env.SERVER_URL)

const init = () => {
  const token = window.location.href.split('?')[1]
  createApp({
    window,
    wsUri: process.env.SERVER_URL!,
    token,
    notifier,
    logger: {
      info: (value, ...args) => {
        logInfo(value, args)
      }
    },
  })
}

init()




