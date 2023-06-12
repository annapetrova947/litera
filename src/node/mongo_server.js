const { MongoClient } = require("mongodb")
const axios = require("axios")

const url =
  "mongodb+srv://rootUser:0123456789@cluster0.l95hg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const mongoClient = new MongoClient(url)

let db

// connecting with db
/**
 * Создаётся подключение к БД
 */
const run = async function () {
  try {
    // Подключаемся к серверу
    await mongoClient.connect()
    db = mongoClient.db("cluster0")
    // return db;
    // взаимодействие с базой данных
    // await testUpdateInCollection(db);
    /*
    await db.command({ping: 1}, function (err, result) {
      if (!err) {
        console.log("Подключение с сервером успешно установлено");
        console.log(result);
        // testInsertCollections(db);
        // testDeleteFromCollection(db);
        // testUpdateInCollection(db);

      }
      // Закрываем подключение
      // mongoClient.close();
      // console.log("Подключение закрыто");
    });

     */
  } catch (err) {
    console.log(err)
    await mongoClient.close()
  } finally {
    // Закрываем подключение при завершении работы или при ошибке
    // await mongoClient.close();
  }
}
module.exports.connectWithDB = run

// updating data about a word
const updateWords = async function (userID, wordsList) {
  const query = {
    userID,
    words: Object,
  }
  const collection = db.collection("root")
  const sendingWords = {}
  for (let i = 0; i < wordsList.length; i++) {
    const word = wordsList[i]
    const wordQuery = {
      userID,
      words: Object,
    }
    const wordPath = `words.${word}`.toString()
    const projection = { name: 0 }
    const searchResult = await collection.findOne(wordQuery, {
      projection,
    })
    if (!(word in searchResult.words)) {
      updateData(query, wordPath, 1)
      sendingWords[word] = 0
    } else {
      updateData(query, wordPath, searchResult.words[word] + 1)
    }
    // console.log(`searchResult: ${searchResult.words['lgbt']}`);
  }
  sendWordsInfo(userID, sendingWords, "http://localhost:3001")
}
module.exports.updateWordsInfo = updateWords

/**
 * creating new user. If ok than returns DB id. Else throws exception.
 * @param userID ID юзера
 * @param history MAP с историей переводов
 * @param name имя юзера
 * @param email email юзера
 * @param imageUrl изображение юзера
 */
const newUser = async function (userID, history, name, email, imageUrl) {
  const query = {
    userID,
    words: Object,
  }
  const collection = db.collection("root")
  const userArr = {
    userID,
    username: userID,
    extraField: "",
    history,
    words: {},
    name,
    email,
    imageUrl,
  }
  const searchResult = await collection.findOne(query, {
    projection: { userID: 1 },
  })
  // console.log(searchResult.userId);
  // console.log(`searchResult: ${searchResult.userID}`);
  if (searchResult?.userID != null) {
    // console.log('aaaaaaaa');
    // throw "User with such ID already exists";
  } else {
    const result = await collection.insertOne(userArr)
    // console.log(`result.insertedId: ${result.insertedId}`);
    return result.insertedId.toString()
  }
}
module.exports.newUser = newUser

/**
 * deleting user by ID
 * @param userID ID юзера
 */
const deleteUser = async function (userID) {
  const collection = db.collection("root")
  const query = {
    userID,
    words: Object,
  }
  collection.deleteOne(query, (err, obj) => {
    if (err) throw err
    console.log("1 document deleted")
  })
}
module.exports.deleteUser = deleteUser

/**
 * check if obj with such id exists
 * @param id object id
 */
const checkById = async function (id) {
  const query = {
    userID: id,
  }
  // console.log(id);
  const collection = db.collection("root")
  const searchResult = await collection.findOne(query, {
    projection: { userID: 1 },
  })
  // console.log(searchResult.userID);
  return searchResult.userID
}
module.exports.checkById = checkById

/**
 * adding new translate request to history
 * Добавить перевод в историю
 * @param userID ID юзера
 * @param requestText текст запроса пользователя
 * @param responseText текст перевода
 * @param fromTo из какого языка в какой в формате <оригинальный язык>|<язык перевода>
 */
const newTranslation = async function (
  userID,
  requestText,
  responseText,
  fromTo
) {
  const query = {
    userID,
  }
  console.log(userID)
  const collection = db.collection("root")
  const wordPath = `history.${Date.now().toString()}`.toString()
  // let searchResult = await collection.findOne(query, {});
  // console.log(`searchResult: ${searchResult.username}`);
  /*
  updateData(query, wordPath+'.requestText', requestText);
  updateData(query, wordPath+'.responseText', responseText);
  updateData(query, wordPath+'.fromTo', fromTo);

   */
  updateData(query, wordPath, {
    requestText,
    responseText,
    fromTo,
  })
}
module.exports.newTranslation = newTranslation

// returns user's history
/**
 * Запрос, который возвращает всю историю пользователя
 * @param userID ID юзера
 * @returns {Promise<*>} MAP следующего содержания: {
 *    <some number> :{
 *      requestText:"requestText"
 *      responseText:"responseText"
 *      fromTo:"<requestText language>|<responseText language>"
 *    }
 * }
 */
const userHistory = async function (userID) {
  const query = {
    userID,
  }
  const collection = db.collection("root")
  const searchResult = await collection.findOne(query, {
    projection: {
      userID: 0,
      username: 0,
      words: 0,
      extraField: 0,
    },
  })
  if (searchResult != null) {
    // console.log(searchResult.history);
    return searchResult.history
  }
  throw "no such user"
}
module.exports.getUserHistory = userHistory

// returns user's info
/**
 * Запрос, который возвращает информацию пользователя
 * @param userID ID юзера
 * @returns {Promise<*>} Объект с полями username, name, imageUrl и email
 */
const userInfo = async function (userID) {
  const query = {
    userID,
  }
  const collection = db.collection("root")
  const searchResult = await collection.findOne(query, {
    projection: {
      _id: 0,
      userID: 0,
      words: 0,
      extraField: 0,
      history: 0,
    },
  })
  if (searchResult != null) {
    // console.log(searchResult);
    return searchResult
  }
  throw "no such user"
}
module.exports.getUserInfo = userInfo

// change username
/**
 * Смена имени пользователя
 * @param userID ID юзера, который менят имя
 * @param username новое имя пользователя
 */
const newUsername = function (userID, username) {
  const query = {
    userID,
  }
  const collection = db.collection("root")
  const usernamePath = "username"
  updateData(query, usernamePath, username)
}
module.exports.changeUsername = newUsername

function updateData(query, dataPath, newValue) {
  const collection = db.collection("root")
  console.log(`path: ${dataPath}`)
  updatingMap = {}
  // updatingMap = { dataPath: newValue };
  updatingMap[dataPath] = newValue
  collection.updateOne(query, { $set: updatingMap })
}

/**
 * Make a GET request for a user's words
 * Выполнить GET запрос на указанный адрес, чтобы получить слова по параметрам
 * @param {string} address Адрес, на который отправляется запрос
 * @param {string} code специальной код, который требует сервер
 * @param {string} wordOption параметр, по которому будут запрошены слова
 * @param {number} wordAmount число запрашиваемых слов
 */
const wordsGetRequest = async function (address, code, wordOption, wordAmount) {
  /*
  let urlAddress = 'http://localhost:3000';
  let someCode = '1205502529252032';
  let option = 'noun';
  let amount = '5';
  */
  const urlAddress = address
  const someCode = code
  const option = wordOption
  const amount = wordAmount

  const result = await axios
    .get(`${urlAddress}?code=${someCode}&option=${option}&amount=${amount}`)
    .then(
      (response) =>
        // console.log('');
        // console.log(`get request: ${  Object.keys(response.data['words'])}`);
        response.data
    )
    .catch((error) => {
      // handle error
      console.log(error)
      return {}
    })
  return result
}
module.exports.getWords = wordsGetRequest

/**
 * sending info about words with POST
 * @param {string} userID ID юзера
 * @param wordsMap Специальный MAP в формате:
 * {
 *   "<userID>": {
 *       "<ENG word>": {
 *           trans: "<RUS translation>",
 *           result: 0
 *           },
 *       "<ENG word>": {
 *           trans: "<RUS translation>",
 *           result: 1
 *           },
 *       }
 * }
 * 0 - неправильно, 1 - правильно.
 * @param {string} address Адрес сервера обработки слов
 */
let sendWordsInfo = function (userID, wordsMap, address) {
  let post = {}
  post = wordsMap
  // console.log(`wordsMap: ${wordsMap}`);
  // console.log(`wordsMap: ${JSON.stringify(wordsMap)}`);
  axios
    .post(address, post)
    .then((response) => {
      console.log(`sendWordsInfo: ${response.data}`)
    })
    .catch((error) => {
      console.log(error)
    })
}
module.exports.sendWordsInfo = sendWordsInfo

// testing
async function testInsertCollections(dbInstance) {
  const collection = dbInstance.collection("root")
  console.log(await collection.countDocuments())

  const usersArr = [
    {
      name: "abc",
      words: {
        dog: 8,
        cat: 5,
        chicken: 3,
      },
    },
    {
      name: "abd",
      words: {
        pleasure: 1,
        point: 9,
        color: 7,
      },
    },
    {
      name: "abe",
      words: {
        Sample: 1,
        coat: 9,
        fusion: 7,
        template: 12,
      },
    },
  ]
  const options = { ordered: true }
  const result = await collection.insertMany(usersArr, options)
  // console.log(result.insertedCount());
}

async function testDeleteFromCollection(dbInstance) {
  const query = {
    name: "abd",
    words: Object,
  }
  const collection = dbInstance.collection("root")
  await collection.deleteOne(query)
}

async function testUpdateInCollection(dbInstance) {
  const query = {
    name: "abe",
    words: Object,
  }
  const collection = dbInstance.collection("root")
  collection.updateMany(query, { $set: { "words.coat": 78 } })
}

// testing
run()
