const url = require("url")
const express = require("express")
const cors = require("cors")
const axios = require("axios")
const mongoDB = require("./mongo_server.js")

const hostname = "127.0.0.1"
const port = 3001

const expressApp = express()
const corsOpts = {
  origin: "*",

  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type"],
}

expressApp.use(cors(corsOpts))

let currentToken = ""

function postToMap(body) {
  const arr = body.split(/name="|\r\n/)
  // console.log(arr);
  const mapPost = {}
  for (let i = 0; i < Math.floor(arr.length / 5); i++) {
    mapPost[arr[i * 5 + 2].substring(0, arr[i * 5 + 2].length - 1)] =
      arr[i * 5 + 4]
  }
  console.log(`mapPost: ${mapPost}`)
  // console.log(typeof body);
  // return  mapPost;
  return JSON.parse(body)
}

async function addWordsInfo(uid, translateRequest, targetLanguage) {
  const resultMap = {}
  resultMap[uid] = {}
  const wordsList = splitTextByWords(translateRequest)
  for (let i = 0; i < wordsList.length; i++) {
    const word = wordsList[i]
    let cleanWord = word.replace(/[^a-zA-Z]/g, "")
    if (cleanWord.length > 0) {
      const cleanWordTranslationResponse = await fetchAsyncTranslate(
        cleanWord,
        targetLanguage
      )
      const cleanWordTranslation = JSON.parse(cleanWordTranslationResponse)
        .translations[0].text
      resultMap[uid][cleanWord] = {}
      resultMap[uid][cleanWord].translation = cleanWordTranslation
      resultMap[uid][cleanWord].result = 0
    } else {
      cleanWord = word.replace(/[^а-яА-Я]/g, "")
      if (cleanWord.length > 0) {
        const cleanWordTranslationResponse = await fetchAsyncTranslate(
          cleanWord,
          targetLanguage
        )
        const cleanWordTranslation = JSON.parse(cleanWordTranslationResponse)
          .translations[0].text
        resultMap[uid][cleanWordTranslation] = {}
        resultMap[uid][cleanWordTranslation].translation = cleanWord
        resultMap[uid][cleanWordTranslation].result = 0
      }
    }
  }

  await mongoDB.sendWordsInfo(
    uid,
    resultMap,
    "https://courseproject.pythonanywhere.com/feedback"
  )
}

function splitTextByWords(text) {
  return text.split(/[ \t]/).map((value) => value.toLowerCase())
}

async function updateTranslateToken() {
  const urlToken = "https://iam.api.cloud.yandex.net/iam/v1/tokens"
  const dataToken = {
    yandexPassportOauthToken: "AQAAAAAGDBExAATuwUBLxpCf4k2Ehl_0EJLr4gs",
  }

  const optionsToken = {
    hostname: urlToken,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }

  const resultToken = await axios.post(urlToken, dataToken, optionsToken)
  return resultToken.data.iamToken
}

async function fetchAsyncTranslate(translateValue, targetLanguage) {
  try {
    const url = "https://translate.api.cloud.yandex.net/translate/v2/translate"
    const data = {
      folderId: "b1ghjohsbvk6a4kckdf6",
      texts: [translateValue],
      targetLanguageCode: targetLanguage,
    }

    const options = {
      hostname: url,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    }

    const result = await axios.post(url, data, options)
    return JSON.stringify(await result.data)
  } catch (error) {
    if (error.response && error.response.data.code === 16) {
      currentToken = await updateTranslateToken()
      return await fetchAsyncTranslate(translateValue, targetLanguage)
    }
  }
}

const runServer = async function () {
  await mongoDB.connectWithDB()
  expressApp.post("/", (req, res) => {
    res.statusCode = 200
    console.log(req.method)
    if (req.method === "GET") {
      const urlReq = url.parse(req.url, true)
      console.log(urlReq.query)
    }
    if (req.method === "POST") {
      let body = ""
      req.on("data", (chunk) => {
        body += chunk.toString()
        // console.log(chunk.toString());
      })
      req.on("end", async () => {
        // console.log(body);
        const response = postToMap(body)
        // console.log(response);
        if ("type" in response) {
          switch (response.type) {
            case "translate":
              console.log(`userid: ${response.userID}`)
              mongoDB.updateWordsInfo(
                response.userID,
                splitTextByWords(response.text)
              )
              // filesHandler.saveWords(splitTextByWords(response['text']), response['userID']);
              break
            case "new_user":
              console.log(`userid: ${response.userID}`)
              mongoDB.newUser(
                response.userID,
                response.history ?? {},
                response.name,
                response.email,
                response.imageUrl
              )
              break
            case "translate_info":
              console.log(`userid: ${response.userID}`)
              mongoDB.newTranslation(
                response.userID,
                response.requestText,
                response.responseText,
                response.fromTO
              )
              break
            case "get_history":
              console.log(`userid: ${response.userID}`)
              // console.log(await mongoDB.getUserHistory(response['userID']));
              const history = await mongoDB.getUserHistory(response.userID)
              res.end(JSON.stringify(history))
              break
            case "get_user_info":
              console.log(`userid: ${response.userID}`)
              const userInfo = await mongoDB.getUserInfo(response.userID)
              console.log(`userInfo: ${JSON.stringify(userInfo)}`)
              res.end(JSON.stringify(userInfo))
              break
            case "change_username":
              console.log(`userid: ${response.userID}`)
              mongoDB.changeUsername(response.userID, response.username)
              break
            case "request_api_translate":
              console.log("request_api_translate")
              const translateResponse = await fetchAsyncTranslate(
                response.requestText,
                response.targetLanguage
              )
              console.log(`response['uid']: ${response.uid}`)
              addWordsInfo(
                response.uid,
                response.requestText,
                response.targetLanguage
              )
              res.end(translateResponse)
              break
            case "quiz":
              console.log("quiz")
              const words = await mongoDB.getWords(
                "https://courseproject.pythonanywhere.com/getwords",
                response.uid,
                response.option,
                response.amount
              )
              res.end(JSON.stringify(words))
              break
            case "quiz_results":
              console.log("quiz_results")
              // console.log(`quiz_results: ${JSON.stringify(response['wordsMap'])}`);
              await mongoDB.sendWordsInfo(
                response.userID,
                response.wordsMap,
                "https://courseproject.pythonanywhere.com/feedback"
              )
              console.log(response.userID)
              // res.end(JSON.stringify(words));
              res.end(response.userID)
              break
            default:
              console.log(response)
          }
        }
      })
    }
    // res.setHeader('Content-Type', 'text/plain');
    // res.end('Hello World');
  })

  const server = await expressApp.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
  })
  // server.listen(port, hostname, () => {
  //   console.log(`Server running at http://${hostname}:${port}/`);
  // });
}

runServer()

module.exports.server = runServer
module.exports.db = mongoDB
