import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import App from "../../App.js"
import {QuizPage, fetchQuizPageJson, askWords, sendResults, createQuestions} from "./QuizPage.js";
require('jest-fetch-mock').enableMocks()
import { act } from 'react-dom/test-utils';
beforeEach(() => {
  fetch.resetMocks();
});

test('check QuizPage screen', async () => {
  await act(async () =>{

    const {container}  = render(<App startPage={<QuizPage/>}/>)

    expect(container.getElementsByTagName('Heading')).toBeTruthy();
    expect(container.getElementsByTagName('p')).toBeTruthy();
    expect(container.getElementsByTagName('button')).toBeTruthy();


    fetch.mockResponseOnce(JSON.stringify({0: {word: 'water', questionText: 'Как переводится слово water?', answerOptions: Array(4)},
      1: {word: 'note', questionText: 'Как переводится слово note?', answerOptions: Array(4)},
      2: {word: 'sadsa', questionText: 'Как переводится слово sadsa?', answerOptions: Array(4)},
      3: {word: 'assa', questionText: 'Как переводится слово assa?', answerOptions: Array(4)},
      4: {word: 'truck', questionText: 'Как переводится слово truck?', answerOptions: Array(4)},
      length: 5}))
    const result = await createQuestions('114992549929960424340');
    expect(result).toBeTruthy()

  });
})
test('check QuizPage createQuestions function query error', async () => {
  fetch.mockReject(() => Promise.reject("API is down"));
  const result = await createQuestions('1');
  expect(result).toEqual([]);
})


  test('check QuizPage function query error', async () => {
    fetch.mockReject(() => Promise.reject("API is down"));
    const result = await askWords();
    expect(result).toEqual({});
  })

test('check QuizPage sendResults function query error', async () => {
  fetch.mockReject(() => Promise.reject("API is down"));
  const result = await sendResults({}, '121');
  expect(result).toEqual({});
})
