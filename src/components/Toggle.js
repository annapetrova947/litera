import React from "react"
import { FaBars } from "react-icons/fa"
import { StyledToggle } from "../template_styles/MenuAnimStyles"

function Toggle({ handleNavToggle }) {
  return (
    <StyledToggle
      className="animate__animated animate__fadeInRight"
      onClick={handleNavToggle}
    >
      <FaBars />
    </StyledToggle>
  )
}

export default Toggle
