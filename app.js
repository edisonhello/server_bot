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
    let sender = msg.from.id
    if( sender != config.self_tgID ) return bot.sendMessage(sender, 'You have no permission to talk with me.')
    args = msg.text.split(' ')
    console.log(args)
    if( args[0] === 'check' ) {
        bot.sendMessage(sender, 'Server is running now.')
    }
    else if( args[0] === 'minecraft' ) {
        let res = childProcess.execSync('tmux ls', { encoding:'ascii' })
        let serverRunning = (res.indexOf('minecraft') !== -1)
        if( args[1] === undefined ) {
            bot.sendMessage(sender, serverRunning ?
                'Minecraft server is running.' :
                'Minecraft server is not running.')
        }
        else if( args[1] === 'start' ) {
            if( serverRunning ) return bot.sendMessage(sender, 'Minecraft server is already running.')
            childProcess.execSync('tmux new-session -d -s minecraft \'~/minecraft/IE/ServerStart.sh\'')
        }
        else if( args[1] === 'ssttoopp' ) {
            if( !serverRunning ) return bot.sendMessage(sender, 'Minecraft server is not running now.')
            childProcess.execSync('tmux kill-session -s minecraft')
        }
    }
    else if( args[0] === '$' ) {
        args.splice(0, 1)
        let command = args.join(' ')
        let res = childProcess.execSync(command, {  encoding:'ascii' })
        bot.sendMessage(sender, res)
    }
    else bot.sendMessage(sender, 'What?')
})
