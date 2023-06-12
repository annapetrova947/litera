import React, { useState } from "react"

import { BrowserRouter, Route, Routes } from "react-router-dom"

import "./App.css"

import Toggle from "./components/Toggle"
import Menu from "./components/Menu"

import TranslationPage from "./pages/translation_page/TranslationPage"
import Login from "./pages/auth_page/Login"
import QuizPage from "./pages/quiz_page/QuizPage"
import Logout from "./pages/auth_page/Logout"
import HistoryPage from "./pages/history_page/HistoryPage"
import ProfilePage from "./pages/profile_page/ProfilePage"

import "../node_modules/animate.css/animate.css"

export const AuthContext = React.createContext()

export const initialState = {
  isAuthenticated: false,
  userId: null,
}

export const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("userId", action.userId)
      return {
        ...state,
        isAuthenticated: true,
        userId: action.userId,
      }
    case "LOGOUT":
      localStorage.clear()
      return {
        ...state,
        isAuthenticated: false,
        userId: null,
      }
    default:
      return state
  }
}

function App(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  React.useEffect(() => {
    const userId = localStorage.getItem("userId")
    console.log("useEffect userId")
    console.log(userId)

    if (userId) {
      dispatch({
        type: "LOGIN",
        userId,
      })
    }
  }, [])

  const [navToggled, setNavToggled] = useState(false)

  const handleNavToggle = () => {
    setNavToggled(!navToggled)
  }

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      <div className="App">
        <Toggle handleNavToggle={handleNavToggle} />

        <BrowserRouter>
          {navToggled ? <Menu handleNavToggle={handleNavToggle} /> : null}

          <Routes>
            <Route exact path="/" element={props.startPage??<TranslationPage />} />
            <Route exact path="/quiz" element={<QuizPage />} />
            <Route exact path="/history" element={<HistoryPage />} />
            <Route exact path="/profile" element={<ProfilePage />} />

            <Route exact path="/login" element={<Login />} />
            <Route exact path="/logout" element={<Logout />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  )
}

export default App
