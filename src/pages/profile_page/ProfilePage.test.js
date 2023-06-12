import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import App from "../../App.js"
import {ProfilePage, fetchHistoryJson, fetchUserJson} from "./ProfilePage.js";

require('jest-fetch-mock').enableMocks()
import {act} from 'react-dom/test-utils';

beforeEach(() => {
  fetch.resetMocks();
});

test('check Profile screen', () => {
  const {container} = render(<App startPage={<ProfilePage/>}/>);
  expect(container.getElementsByTagName('Heading')).toBeTruthy();
  expect(container.getElementsByTagName('p')).toBeTruthy();
})

test('check History function query', async () => {
  fetch.mockResponseOnce(JSON.stringify({1639830477986: {requestText: "Yep", responseText: "Йеп", fromTo: "rus|eng"}}))
  const result = await fetchHistoryJson('user1');
  expect(result[1639830477986].responseText).toEqual('Йеп');
})

test('check History function query', async () => {
  fetch.mockResponseOnce(JSON.stringify({
    username: '114992549929960424340',
    name: 'Лега',
    email: 'alioleg8@gmail.com',
    imageUrl: 'https://lh3.googleusercontent.com/a-/AOh14GgEYZfHhA0sgJvH6bv2khSpuvQsgOmMbzjvUmcY=s96-c'
  }))
  const result = await fetchUserJson('user1');
  expect(result.name).toEqual('Лега');
})

test('check History function query error', async () => {
  fetch.mockReject(() => Promise.reject("API is down"));
  const result = await fetchUserJson('user1');
  expect(result).toEqual(null);
})

test('check Profile screen UI', async () => {

  await act(async () => render(<App startPage={<ProfilePage/>}/>));

  await act(async () => {
    expect(screen.getByText('Profile in the evening')).toBeTruthy();
    expect(screen.getByRole('button')).toBeTruthy();
  });

})
