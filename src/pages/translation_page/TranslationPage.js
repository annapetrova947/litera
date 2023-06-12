import React from "react"
import "regenerator-runtime"
import TranslationField from "./TranslationField"
import { Heading, StyledPage } from "../../template_styles/PageAnimStyles"

export function TranslationPage() {
  return (
    <StyledPage>
      <Heading className="animate__animated animate__fadeInLeft">
        Translate
      </Heading>

      <div className="translations-page">
        <TranslationField />
      </div>
    </StyledPage>
  )
}

export default TranslationPage
