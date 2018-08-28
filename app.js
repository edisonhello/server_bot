const config = require('./config.json')
const request = require('request')
const cheerio = require('cheerio')

const http = require('http')
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

function noPermission(sender) {
    console.log('No permission.')
    bot.sendMessage(sender, 'You have no permission to use this.')
}

bot.on('message', msg => {
    // console.log( msg )
    let sender = msg.from.id
    // if( sender != config.self_tgID ) return bot.sendMessage(sender, 'You have no permission to talk with me.')
    let args = msg.text.split(' ')
    console.log(args)
    if( args[0] === 'check' ) {
        bot.sendMessage(sender, 'Server is running now.')
    }
    else if( args[0] === 'minecraft' ) {
        if(sender != config.self_tgID) return noPermission(sender)
        childProcess.exec('tmux ls', { encoding:'ascii' }, (err, res, stderr) => {
            let serverRunning = (res.indexOf('minecraft') !== -1)
            if( args[1] === undefined ) {
                bot.sendMessage(sender, serverRunning ?
                    'Minecraft server is running.' :
                    'Minecraft server is not running.')
            }
            else if( args[1] === 'start' ) {
                if( serverRunning ) return bot.sendMessage(sender, 'Minecraft server is already running.')
                childProcess.execSync(`tmux new-session -d -s minecraft '~/minecraft/IE/ServerStart.sh'`)
                bot.sendMessage(sender, 'Maybe server is opened.')
            }
            else if( args[1] === 'ssttoopp' ) {
                if( !serverRunning ) return bot.sendMessage(sender, 'Minecraft server is not running now.')
                childProcess.execSync('tmux kill-session -s minecraft')
                bot.sendMessage(sender, 'Maybe server is closed.')
            }
        })
    }
    else if( args[0] === '$' ) {
        if(sender != config.self_tgID) return noPermission(sender)
        args.splice(0, 1)
        let command = args.join(' ')
        let res = childProcess.execSync(command, {  encoding:'ascii' })
        bot.sendMessage(sender, res)
    }
    else if( args[0] === 'getip' ) {
        console.log(config.registedUser[args[0]], sender)
        if( !config.registedUser[args[0]].includes(sender) ) return noPermission(sender)
        request.get({ url: 'https://api.ipify.org/' }, (err, header, body) => {
            if(err) return bot.sendMessage(sender, 'Error happen when getting ip.' + err)
            bot.sendMessage(sender, 'Server\'s ip is ' + body)
        })
    }
    else if( args[0] === 'regist') {
        bot.sendMessage(config.self_tgID, 'Receive regist request: \n' + JSON.stringify(msg, null, 4))
        bot.sendMessage(sender, 'Received regist request, please wait for apply.')
    }
    else bot.sendMessage(sender, 'What?')
})

bot.on('polling_error', (err) => {
    console.log(err)
})
