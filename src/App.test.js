import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import App from "./App.js";
import Menu from "./components/Menu.js";

test('check main App screen', () => {
  const {container} = render(<App/>);
  expect(container.firstChild.classList.contains('App')).toBe(true)
})

test('check welcome screen', () => {
  const {container} = render(<App/>);
  expect(screen.getByText('release the beast')).toBeInTheDocument();
})

test('check navigation', () => {
  const {container} = render(<App/>);
  expect(container.getElementsByTagName('BrowserRouter')).toBeTruthy();
})

