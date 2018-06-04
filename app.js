const config = require('./config.json')
const request = require('request')
const cheerio = require('cheerio')

const childProcess = require('child_process')

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
    // console.log( msg )
    if( msg.from.id != config.self_tgID ) {
        bot.sendMessage(msg.from.id, 'You have no permission to talk with me.')
        return
    }
    args = msg.text.split(' ')
    console.log(args)
    if( args[0] === 'check' ) {
        bot.sendMessage(msg.from.id, 'Server is running now.')
    }
    if( args[0] === '$' ) {
        args.splice(0, 1)
        let command = args.join(' ')
        let res = childProcess.execSync(command, {
            encoding: 'ascii'
        })
        bot.sendMessage(msg.from.id, res)
    }
    else bot.sendMessage(msg.from.id, 'What?')
})
