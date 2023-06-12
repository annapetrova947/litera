import React, {useEffect, useState} from "react"
import "./quiz_screen.css"
import "styled-components"
import {AuthContext} from "../../App"
import {Heading, StyledPage} from "../../template_styles/PageAnimStyles"

const resultMap = {}

export async function askWords(userID) {
  if (userID == null) return {};
  try {
    const data = await fetch("http://localhost:3001", {
      method: "POST", body: JSON.stringify({
        uid: userID, type: "quiz", option: "noun", amount: 5,
      }),
    })


    resultMap[userID.toString()] = {}

    console.log(`askWords: ${Object.keys(resultMap)}`)

    return await data.json()
  } catch (e) {
    return {};
  }
}

export async function sendResults(wordsMap, uid) {
  if (uid == null) return {};
  try {
    const sendingMap = {
      userID: uid, type: "quiz_results", wordsMap: resultMap,
    }

    var result = await fetch("http://localhost:3001", {
      method: "POST", body: JSON.stringify(sendingMap),
    })
    return result;
  } catch (e) {
    return {}
  }
}

export async function createQuestions(uid) {
  if (uid == null) return {}

  try {
    console.log(`createQuestions: ${uid}`)

    function getRandomInt(max) {
      return Math.floor(Math.random() * max)
    }

    const reqWords = await askWords(uid)
    const questionsListTMP = []
    const response2 = {
      words: {},
    }
    for (const pr in reqWords.words) {
      response2.words[pr.valueOf()] = reqWords.words[pr]
    }

    const keysArray = Array.from(Object.keys(response2.words))

    function shuffleArray(array) {
      for (let iter = array.length - 1; iter > 0; iter--) {
        const jter = Math.floor(Math.random() * (iter + 1))
        const temp = array[iter]
        array[iter] = array[jter]
        array[jter] = temp
      }
    }

    shuffleArray(keysArray)

    if (keysArray.length >= 4) {
      for (let i = 0; i < keysArray.length; i++) {
        const rightAnswer = response2.words[keysArray[i]]
        const randomVariants = [rightAnswer]
        while (randomVariants.length < 4) {
          const randNum = getRandomInt(keysArray.length)
          const randAnswer = response2.words[keysArray[randNum]]
          if (!randomVariants.includes(randAnswer)) {
            randomVariants.push(randAnswer)
          }
        }
        const seed = getRandomInt(4)

        questionsListTMP.push({
          word: keysArray[i], questionText: `Как переводится слово ${keysArray[i]}?`, answerOptions: [{
            answerText: randomVariants[(seed + 0) % 4], isCorrect: randomVariants[(seed + 0) % 4] === rightAnswer,
          }, {
            answerText: randomVariants[(seed + 1) % 4], isCorrect: randomVariants[(seed + 1) % 4] === rightAnswer,
          }, {
            answerText: randomVariants[(seed + 2) % 4], isCorrect: randomVariants[(seed + 2) % 4] === rightAnswer,
          }, {
            answerText: randomVariants[(seed + 3) % 4], isCorrect: randomVariants[(seed + 3) % 4] === rightAnswer,
          },],
        })
      }
    }

    console.log(questionsListTMP)
    return questionsListTMP
  } catch (e) {
    return {}
  }
}

export function QuizPage() {
  const {state, dispatch} = React.useContext(AuthContext)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [score, setScore] = useState(0)
  const [questions, setQuestions] = useState([])
  const [words, setWords] = useState({})

  let uid = state.userId

  useEffect(async () => {
    uid = state.userId
    console.log(`state.userID: ${uid}`)
    setQuestions(await createQuestions(uid))
  }, [state])

  const handleAnswerOptionClick = (isCorrect, wordNumber) => {
    // console.log(`Object.keys(resultMap): ${Object.keys(resultMap)}`);
    // console.log(`handleAnswerOptionClick: ${uid}`);
    // console.log(`resultMap[uid]: ${resultMap[uid]}`);
    resultMap[uid.toString()][questions[wordNumber].word] = {}
    resultMap[uid.toString()][questions[wordNumber].word].translation = questions[wordNumber].word
    resultMap[uid.toString()][questions[wordNumber].word].result = 0
    if (isCorrect) {
      resultMap[uid.toString()][questions[wordNumber].word].result = 1
      setScore(score + 1)
    }

    const nextQuestion = currentQuestion + 1

    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion)
    } else {
      sendResults(resultMap, uid)
      setShowScore(true)
    }
  }

  if (state.userId === null) {
    return (<StyledPage>
        <Heading className="animate__animated animate__fadeInLeft">
          Any quiz of unregistered user?
        </Heading>
      </StyledPage>)
  }
  if (questions.length > 0) {
    return (<StyledPage>
        <Heading className="animate__animated animate__fadeInLeft">
          Quiz it out
        </Heading>

        <div className="app">
          {showScore ? (<div className="score-section">
              You scored {score} out of {questions.length}
            </div>) : (<>
              <div className="question-section">
                <div className="question-count">
                  <span>Question {currentQuestion + 1}</span>/{questions.length}
                </div>
                <div className="question-text">
                  {questions[currentQuestion].questionText}
                </div>
              </div>
              <div className="answer-section">
                {questions[currentQuestion].answerOptions.map((answerOption) => (<button
                    className="button-handle-answer"
                    onClick={() => handleAnswerOptionClick(answerOption.isCorrect, currentQuestion)}
                  >
                    {answerOption.answerText}
                  </button>))}
              </div>
            </>)}
        </div>
      </StyledPage>)
  }
  return (<StyledPage>
      <Heading className="animate__animated animate__fadeInLeft">
        Quiz it out
      </Heading>

      <div className="app">
        {showScore ? (<div className="score-section">
            You scored {score} out of {questions.length}
          </div>) : (<div className="question-section">
            <div className="question-count">
              <span>0</span>/0
            </div>
            <div className="question-text">Quiz is loading</div>
          </div>)}
      </div>
    </StyledPage>)
}

export default QuizPage
