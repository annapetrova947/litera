import React from "react"

import { GoogleLogout } from "react-google-login"
import GoogleButton from "react-google-button"
import { useNavigate } from "react-router"
import { AuthContext } from "../../App"
import { Heading, StyledPage } from "../../template_styles/PageAnimStyles"
import "./auth_page.css"

const clientId =
  "831509170132-qltti6dligculutcckl4f7v5belp7gq8.apps.googleusercontent.com"

function Logout() {
  const { state, dispatch } = React.useContext(AuthContext)
  const navigate = useNavigate()

  const onSuccess = () => {
    alert("Logout made successfully")

    dispatch({
      type: "LOGOUT",
    })

    navigate("/")
  }

  const onFailure = () => {}

  return (
    <StyledPage>
      <Heading className="animate__animated animate__fadeInLeft">
        {state.userId != null ? "Logout? Sure?" : "No login no logout"}
      </Heading>

      {state.userId !== null ? (
        <div className="centered-inside-div auth-component">
          <div className="column">
            <GoogleLogout
              clientId={clientId}
              render={(renderProps) => (
                <GoogleButton
                  onClick={renderProps.onClick}
                  label="Sign out with Google"
                  disabled={renderProps.disabled}
                >
                  Sign out with Google
                </GoogleButton>
              )}
              onLogoutSuccess={onSuccess}
              onFailure={onFailure}
            />
          </div>
        </div>
      ) : (
        <div />
      )}
    </StyledPage>
  )
}

export default Logout
