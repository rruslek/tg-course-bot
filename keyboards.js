import { Markup } from 'telegraf'

export function getMainMenu() {
    return Markup.keyboard([
        ['📝Термины', '👀CPM всех тематик'],
        ['💼Тематические чаты', '❔Стоимость пдп в тематиках'],
        ['🤖Боты для работы', '👷‍♂Биржи труда'],
        ['⚖️Биржи по продаже каналов'],
        ['📕Задания'],
        ['📩Обратная связь']
    ])
}

export function getChats() {
    return Markup.keyboard([
        ['💰Покупка', '💰Продажа'],
        ['🧑‍💻Тематические чаты'],
        ['🗣Чаты для общения'],
        ['🔙Назад', '🔝Главное меню']
    ])
}

export function getBots() {
    return Markup.keyboard([
        ['🤖Боты для постинга', '🤖Боты приёма СМС'],
        ['🤖Боты для чистки', '🤖Боты для чата'],
        ['🤖Боты для обратной связи'],
        ['🤖Бот для закупа'],
        ['🔙Назад', '🔝Главное меню']
    ])
}
export function getExercises() {
    return Markup.keyboard([
        ['1 задание', '2 задание'],
        ['3 задание', '4 задание'],
        ['🔙Назад', '🔝Главное меню']
    ])
}
export function getBackButtons() {
    return Markup.keyboard([
        ['🔙Назад']
    ]).resize()
}
