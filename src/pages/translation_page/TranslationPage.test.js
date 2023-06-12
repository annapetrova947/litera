import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import App from "../../App.js"
import {TranslationPage} from "./TranslationPage.js";
import {TranslationField, translateInfo, requestApiTranslate} from "./TranslationField.js";

require('jest-fetch-mock').enableMocks()
import {act} from 'react-dom/test-utils';

beforeEach(() => {
  fetch.resetMocks();
});

test('check TranslationPage screen', async () => {
  await act(async () => render(<App startPage={<TranslationPage/>}/>));
});

test('check Translation send function post', async () => {
  fetch.mockResponseOnce(JSON.stringify({}))
  const result = await translateInfo('translatedWord', 'user1', {enValue: "", ruValue: "", targetLanguage: "ru",});
  expect(result).toEqual(undefined);
})


test('check Translation requestApiTranslate send function post', async () => {
  fetch.mockResponseOnce(JSON.stringify({}))
  const result = await requestApiTranslate('1', {
    text: "textTextText", detectedLanguageCode: "en", targetLanguage: "ru",
  });
  expect(result).toEqual(null);
})
