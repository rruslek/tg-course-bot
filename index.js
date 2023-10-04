import express from 'express'
import { Telegraf, Scenes, session } from 'telegraf'
import { config } from 'dotenv'
import { getMainMenu, getChats, getBots, getBackButtons, getExercises } from './keyboards.js'
import fs from 'fs'

config()
const app = express()
const PORT = 3000

const BOT_TOKEN = process.env.TOKEN


let isAdmin = (userId) => {
    return userId == process.env.ADMIN;
};

let forwardToAdmin = (ctx) => {
    if (isAdmin(ctx.message.from.id)) {
        ctx.reply('Ошибка, вы не можете отправить сообщение самому себе');
    } else {
        ctx.forwardMessage(process.env.ADMIN, ctx.from.id, ctx.message.id);
    }
};

const supportScene = new Scenes.BaseScene('supportScene');

supportScene.enter(ctx => ctx.reply(isAdmin(ctx.message.from.id)
? 'Теперь вы можете отвечать на сообщения пользователей!'
: 'Напишите свои сообщения администратору.', getBackButtons()))
supportScene.on('message', (ctx) => {
    // убеждаемся что это админ ответил на сообщение пользователя
    if (ctx.message.text == '🔙Назад') {
        ctx.scene.leave('supportScene')
    }
    else {
        if (ctx.message.reply_to_message
            && ctx.message.reply_to_message.forward_from
            && isAdmin(ctx.message.from.id)) {
            // отправляем копию пользователю
            ctx.telegram.sendCopy(ctx.message.reply_to_message.forward_from.id, ctx.message);
        } else {
            // перенаправляем админу
            forwardToAdmin(ctx);
        }
    }
});
supportScene.leave(ctx => ctx.reply(isAdmin(ctx.message.from.id)
? 'Готово!'
: 'Спасибо за ваше обращение', getMainMenu()))


const stage = new Scenes.Stage([supportScene])
stage.hears('exit', ctx => ctx.scene.leave)

const bot = new Telegraf(BOT_TOKEN)
bot.use(session(), stage.middleware())


bot.start(ctx => {
    ctx.reply(isAdmin(ctx.message.from.id)
    ? 'Добро пожаловать админ!'
    : 'Добро пожаловать!', getMainMenu())
})


bot.hears('📝Термины', ctx => {
    ctx.reply(fs.readFileSync('texts/termins.txt', 'utf8'))
})

bot.hears('👀CPM всех тематик', ctx => {
    ctx.reply(fs.readFileSync('texts/cpms.txt', 'utf8'))
})

bot.hears('❔Стоимость пдп в тематиках', ctx => {
    ctx.reply(fs.readFileSync('texts/prices.txt', 'utf8'))
})

bot.hears('👷‍♂Биржи труда', ctx => {
    ctx.reply(fs.readFileSync('texts/labors.txt', 'utf8'))
})

bot.hears('⚖️ Биржи по продаже каналов', ctx => {
    ctx.reply(fs.readFileSync('texts/sell_channels.txt', 'utf8'))
})

bot.hears('💼 Тематические чаты', ctx => {
    ctx.reply('Выберите один из чатов', getChats())
})

bot.hears('💰Покупка', ctx => {
    ctx.reply(fs.readFileSync('texts/buy_chats.txt', 'utf8'))
})

bot.hears('💰Продажа', ctx => {
    ctx.reply(fs.readFileSync('texts/sell_chats.txt', 'utf8'))
})

bot.hears('🧑‍💻Тематические чаты', ctx => {
    ctx.reply(fs.readFileSync('texts/tematic_chats.txt', 'utf8'))
})

bot.hears('🗣Чаты для общения', ctx => {
    ctx.reply(fs.readFileSync('texts/talk_chats.txt', 'utf8'))
})

bot.hears('🤖Боты для работы', ctx => {
    ctx.reply('Выберите ботов, которые Вас интересуют.', getBots())
})

bot.hears('🤖Боты для постинга', ctx => {
    ctx.reply(fs.readFileSync('texts/posting_bots.txt', 'utf8'))
})

bot.hears('🤖Боты приёма СМС', ctx => {
    ctx.reply(fs.readFileSync('texts/SMS_bots.txt', 'utf8'))
})

bot.hears('🤖Боты для чистки', ctx => {
    ctx.reply(fs.readFileSync('texts/clear_bots.txt', 'utf8'))
})

bot.hears('🤖Боты для чата', ctx => {
    ctx.reply(fs.readFileSync('texts/chat_bots.txt', 'utf8'))
})

bot.hears('🤖Боты для обратной связи', ctx => {
    ctx.reply(fs.readFileSync('texts/support_bots.txt', 'utf8'))
})

bot.hears('🤖Бот для закупа', ctx => {
    ctx.reply(fs.readFileSync('texts/buy_bots.txt', 'utf8'))
})

bot.hears('📕Задания', ctx => {
    ctx.reply('Выберите задание для выполнения. ', getExercises())
})

bot.hears('1 задание', ctx => {
    ctx.reply(fs.readFileSync('texts/exercise1.txt', 'utf8'))
})

bot.hears('2 задание', ctx => {
    ctx.reply(fs.readFileSync('texts/exercise2.txt', 'utf8'))
})

bot.hears('3 задание', ctx => {
    ctx.reply(fs.readFileSync('texts/exercise3.txt', 'utf8'))
})

bot.hears('4 задание', ctx => {
    ctx.reply(fs.readFileSync('texts/exercise4.txt', 'utf8'))
})

bot.hears('📩Обратная связь', ctx => ctx.scene.enter('supportScene'))

bot.hears('🔙Назад', ctx => {
    ctx.reply('Главное меню', getMainMenu())
})

bot.hears('🔝Главное меню', ctx => {
    ctx.reply('Главное меню', getMainMenu())
})


bot.launch()

app.listen(PORT, () => console.log(`My server is running on port ${PORT}`))