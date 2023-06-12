import React from "react"

import { GoogleLogin } from "react-google-login"
import GoogleButton from "react-google-button"
import { useNavigate } from "react-router"
import { refreshTokenSetup } from "./refreshToken"
import { AuthContext } from "../../App"
import { Heading, StyledPage } from "../../template_styles/PageAnimStyles"
import "./auth_page.css"

const clientId =
  "831509170132-q8bq85iful5mlopf7muscr5c3b29cu6g.apps.googleusercontent.com"

async function createUser(userId, name, email, imageUrl) {
  await fetch("http://localhost:3001", {
    method: "POST",
    body: JSON.stringify({
      type: "new_user",
      userID: userId,
      name,
      email,
      imageUrl,
    }),
  })
}

function Login() {
  const { state, dispatch } = React.useContext(AuthContext)

  const navigate = useNavigate()

  const onSuccess = async (res) => {
    alert(`Logged in successfully.\nWelcome ${res.profileObj.givenName}.`)

    dispatch({
      type: "LOGIN",
      userId: res.profileObj.googleId,
    })

    refreshTokenSetup(res)
    await createUser(
      res.profileObj.googleId,
      res.profileObj.givenName,
      res.profileObj.email,
      res.profileObj.imageUrl
    )

    navigate("/")
  }

  const onFailure = (res) => {
    console.log("Login failed: res:", res)
  }

  return (
    <StyledPage>
      <Heading className="animate__animated animate__fadeInLeft">
        {state.userId != null
          ? "Logged in can't be logged out"
          : "Login and be PowerRanger"}
      </Heading>

      <div className="centered-inside-div auth-component">
        <div className="column">
          <GoogleLogin
            clientId={clientId}
            render={(renderProps) => (
              <GoogleButton
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                Sign in with Google
              </GoogleButton>
            )}
            buttonText="Login"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy="single_host_origin"
            isSignedIn
          />
        </div>
      </div>
    </StyledPage>
  )
}

export default Login
