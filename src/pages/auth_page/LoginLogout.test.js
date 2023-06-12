import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import App from "../../App.js"
import Login from "./Login.js";
import Logout from "./Logout.js";
import {refreshTokenSetup} from "./refreshToken";

test('check Login screen', () => {
  const {container} = render(<App startPage={<Login/>}/>);
  expect(container.getElementsByTagName('GoogleButton')).toBeTruthy();
})

test('check Login screen', () => {
  const {container} = render(<App startPage={<Logout/>}/>);
  expect(container.getElementsByTagName('GoogleButton')).toBeTruthy();
})

test('check Login animation', () => {
  const {container} = render(<App startPage={<Login/>}/>);
  expect(container.getElementsByClassName('column').length).toBeGreaterThanOrEqual(1);
})

test('check refresh token', () => {
  jest.spyOn(window.localStorage.__proto__, 'setItem');
  window.localStorage.__proto__.setItem = jest.fn();
  refreshTokenSetup();
  expect(localStorage.setItem).not.toHaveBeenCalled();
})
