import styled from "styled-components"
import { Link } from "react-router-dom"

export const StyledMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 100%;
  @media screen and (min-width: 790px) {
    width: 60%;
  }
  background-color: rgb(58, 66, 81, 0.9);
  z-index: 99;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const StyledLink = styled(Link)`
  color: #eee;
  text-decoration: none;
  font-size: clamp(3rem, 4vw, 6vw);
  font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
  transition: 0.2s all ease-in-out;

  user-select: none; /* supported by Chrome and Opera */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */

  &:hover {
    transition: 0.2s all ease-in-out;
    color: orangered;
  }
`

export const CloseToggle = styled.button`
  position: fixed;
  top: 5%;
  right: 4%;
  background: #222;
  color: #fff;
  padding: 0.75rem;
  display: flex;
  place-items: center;
  font-size: 2rem;
  cursor: pointer;
`

export const StyledToggle = styled.button`
  position: fixed;
  top: 5%;
  right: 4%;
  color: #222;
  background: #eee;
  padding: 0.75rem;
  display: flex;
  place-items: center;
  font-size: 2rem;
  cursor: pointer;
`
