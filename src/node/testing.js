const server = require("./server_app.js")

async function serverRunning() {
  // Обязательно запустить сервер, без этого ничего работать не будет
  await server.server()

  // Добавить слово в историю. 4 аргумента. ID юзера, запрос пользователя, ответ переводчика, из какого языка в какой
  // в формате <оригинальный язык>|<язык перевода>
  await server.db.newTranslation(
    "testID",
    "dog is a cat",
    "собака это кошка",
    "eng|rus"
  )
  /// добавление слова в историю. Пример 1
  await server.db.newTranslation(
    "testID",
    "собака это кошка",
    "dog is a cat",
    "rus|eng"
  )
  // добавление слова в историю. Пример 2

  // Выполнить GET запрос на указанный адрес, чтобы получить слова по параметрам
  await server.db.getWords(
    "http://localhost:3000",
    "1205502529252032",
    "noun",
    5
  )
  // Пример 1. Так как адреса сервера обработки слов нет, то никакого ответа не будет

  // Правильные/нет слова после квиза
  const wordsMap = {
    12055025: {
      dog: {
        trans: "пёс",
        result: 0,
      },
      cat: {
        trans: "кот",
        result: 1,
      },
    },
  }
  await server.db.sendWordsInfo(
    "1205502529252032",
    wordsMap,
    "http://localhost:3000"
  )
  // Пример 1. Так как адреса сервера обработки слов нет, то никакого ответа не будет
}

serverRunning()
