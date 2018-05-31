const config = require('./config.json')
const request = require('request')
const cheerio = require('cheerio')

const tgbotapi = require('node-telegram-bot-api')

const bot = new tgbotapi(config.token, {
    polling: true
})

let count = 0
var intervalId = setInterval(() => {
    count++
    if( count % 3600 === 0 ) {
        bot.sendMessage(config.self_tgID, 'Server is running now.')
    }
}, 1000)

bot.sendMessage(config.self_tgID, 'Server restarted.')

bot.on('message', msg => {
    if( msg.from.id != config.self_tgID ) return
    if( msg.text === 'check' ) {
        bot.sendMessage(msg.from.id, 'Server is running now.')
    }
    else bot.sendMessage(msg.from.id, 'What?')
})
