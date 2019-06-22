const config = require('./config.json')

const tgbotapi = require('node-telegram-bot-api')

const bot = new tgbotapi(config.token, {
    polling: false
})

module.exports = [bot, config]

