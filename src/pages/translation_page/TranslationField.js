import React, { useState } from "react"

import "./translations_page.css"
import Button from "@mui/material/Button"
import { CgArrowsExchangeAlt } from "react-icons/cg"
import { IconButton } from "@mui/material"
import { AuthContext } from "../../App"

function TranslationField() {
  const { state } = React.useContext(AuthContext)
  const [translationState, setTranslationState] = useState({
    enValue: "",
    ruValue: "",
    targetLanguage: "ru",
  })

  function handleChange(event) {
    setTranslationState({})
    translationState.targetLanguage === "en"
      ? setTranslationState({
        ...translationState,
        ruValue: event.target.value,
      })
      : setTranslationState({
        ...translationState,
        enValue: event.target.value,
      })
  }

  function handleChange2(event) {
    translationState.targetLanguage === "en"
      ? setTranslationState({
        ...translationState,
        enValue: event.target.value,
      })
      : setTranslationState({
        ...translationState,
        ruValue: event.target.value,
      })
  }

  function handleSubmit(event) {
    event.preventDefault()
  }

  async function requestApiTranslate() {
    const translateResponse = await fetch("http://localhost:3001", {
      method: "POST",
      body: JSON.stringify({
        uid: state.userId,
        type: "request_api_translate",
        targetLanguage: translationState.targetLanguage,
        requestText:
          translationState.targetLanguage === "en"
            ? translationState.ruValue
            : translationState.enValue,
      }),
    })
    return JSON.parse(JSON.stringify(await translateResponse.json()))
      .translations[0].text
  }

  async function translateInfo(translatedWord) {
    await fetch("http://localhost:3001", {
      method: "POST",
      body: JSON.stringify({
        userID: state.userId,
        type: "translate_info",
        requestText:
          translationState.targetLanguage === "en"
            ? translationState.ruValue
            : translationState.enValue,
        responseText: translatedWord,
        fromTO: "".concat(
          translationState.targetLanguage === "en" ? "rus|eng" : "eng|rus"
        ),
      }),
    })
  }

  async function onTranslate() {
    const translatedWord = await requestApiTranslate()
    translationState.targetLanguage === "en"
      ? setTranslationState({
        ...translationState,
        enValue: translatedWord,
      })
      : setTranslationState({ ...translationState, ruValue: translatedWord })
    await translateInfo(translatedWord)
  }

  function onTargetLanguageChange() {
    if (translationState.targetLanguage === "en") {
      setTranslationState({ ...translationState, targetLanguage: "ru" })
    } else if (translationState.targetLanguage === "ru") {
      setTranslationState({ ...translationState, targetLanguage: "en" })
    }
  }

  function translateTextArea(
    onSubmitHandle,
    value,
    placeholder,
    handleOnChange
  ) {
    return (
      <div className="row">
        <form onSubmit={onSubmitHandle}>
          <label>
            <textarea
              className="translate-form-field"
              value={value}
              placeholder={placeholder}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  onTranslate()
                }
              }}
              onChange={handleOnChange}
            />
          </label>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="rows centered">
        <div className="row language-code">
          {translationState.targetLanguage === "en" ? "RU" : "EN"}
        </div>

        <div className="row">
          <IconButton color="error">
            <CgArrowsExchangeAlt
              className="language-direction-icon"
              fontSize="inherit"
              onClick={() => {
                onTargetLanguageChange()
              }}
            />
          </IconButton>
        </div>

        <div className="row language-code">
          {translationState.targetLanguage === "en" ? "EN" : "RU"}
        </div>
      </div>

      <div className="rows">
        {translateTextArea(
          handleSubmit,
          translationState.targetLanguage === "en"
            ? translationState.ruValue
            : translationState.enValue,
          "Translate me please, please",
          handleChange
        )}
        {translateTextArea(
          handleSubmit,
          translationState.targetLanguage === "en"
            ? translationState.enValue
            : translationState.ruValue,
          handleChange2
        )}
      </div>

      <div className="centered">
        <Button
          variant="contained"
          className="release-the-beast"
          color="error"
          onClick={onTranslate}
        >
          release the beast
        </Button>
      </div>
    </div>
  )
}

export default TranslationField
