import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import App from "../../App.js"
import {HistoryPage, fetchHistoryJson, amount} from "./HistoryPage.js";
import {act} from "react-dom/test-utils";

require('jest-fetch-mock').enableMocks()

beforeEach(() => {
  fetch.resetMocks();
});

test('check History screen', async () => {

  await act(async () => {
    const {container} = render(<App startPage={<HistoryPage/>}/>)
    expect(container.getElementsByTagName('Heading')).toBeTruthy();
    expect(container.getElementsByTagName('p')).toBeTruthy();
  });
})

test('check History element text', () => {
  const {container} = render(<App startPage={<HistoryPage/>}/>);
  expect(screen.getByText('History it out')).toBeInTheDocument();
})

test('check History function query', async () => {
  fetch.mockResponseOnce(JSON.stringify({1639830477986: {requestText: "Yep", responseText: "Йеп", fromTo: "rus|eng"}}))
  const result = await fetchHistoryJson('user1');
  expect(result[1639830477986].responseText).toEqual('Йеп');
})

test('check history amount', async () => {
  const result = await amount([]);
  expect(result).toEqual("Translate your first word!");
})

test('check history amount 1', async () => {
  const result = await amount([{}]);
  expect(result).toEqual("You have translated 1 words");
})
