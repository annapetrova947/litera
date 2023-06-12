import React from "react"
import { FaTimes } from "react-icons/fa"
import {
  StyledMenu,
  StyledLink,
  CloseToggle,
} from "../template_styles/MenuAnimStyles"

function Menu({ handleNavToggle }) {
  return (
    <StyledMenu>
      <StyledLink
        className="animate__animated animate__fadeInRight"
        onClick={handleNavToggle}
        to="/"
      >
        Translate
      </StyledLink>
      <StyledLink
        className="animate__animated animate__fadeInRight"
        onClick={handleNavToggle}
        to="/quiz"
      >
        Quiz
      </StyledLink>
      <StyledLink
        className="animate__animated animate__fadeInRight"
        onClick={handleNavToggle}
        to="/history"
      >
        History
      </StyledLink>
      <StyledLink
        className="animate__animated animate__fadeInRight"
        onClick={handleNavToggle}
        to="/profile"
      >
        Profile
      </StyledLink>
      <StyledLink
        className="animate__animated animate__fadeInRight"
        onClick={handleNavToggle}
        to="/login"
      >
        Login
      </StyledLink>
      <StyledLink
        className="animate__animated animate__fadeInRight"
        onClick={handleNavToggle}
        to="/logout"
      >
        Logout
      </StyledLink>
      <CloseToggle
        className="animate__animated animate__fadeInRight"
        onClick={handleNavToggle}
      >
        <FaTimes />
      </CloseToggle>
    </StyledMenu>
  )
}
export default Menu
