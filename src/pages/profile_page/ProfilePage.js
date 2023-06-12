import "./profile_page.css"
import React, {useEffect, useState} from "react"
import {AuthContext} from "../../App"
import {Heading, StyledPage} from "../../template_styles/PageAnimStyles"
import {act} from 'react-dom/test-utils';

export async function fetchHistoryJson(userId) {
  if (userId == null) return {};
  try {
    const historyRes = await fetch("http://localhost:3001", {
      method: "POST", body: JSON.stringify({
        userID: userId.toString(), type: "get_history",
      }),
    })

    return JSON.parse(JSON.stringify(await historyRes.json()))
  } catch (e) {
    return {};
  }
}

export async function fetchUserJson(userId) {
  try {
    const userRes = await fetch("http://localhost:3001", {
      method: "POST", body: JSON.stringify({
        userID: userId.toString(), type: "get_user_info",
      }),
    })

    return JSON.parse(JSON.stringify(await userRes.json()))
  } catch (e) {
    return null
  }
}

export function ProfilePage() {
  const {state, dispatch} = React.useContext(AuthContext)
  const [UserJSON, setUserJSON] = useState({})
  const [historyJSON, setHistoryJSON] = useState({})

  act(() => useEffect(async () => {
    setUserJSON(await fetchUserJson(state.userId))
    console.log(await fetchUserJson(state.userId))
    setHistoryJSON(await fetchHistoryJson(state.userId))
    // console.log(await fetchHistoryJson(state.userId))
  }, [state]))

  const historyList = Object.keys(historyJSON).map((object, i) => (<li key={object}>
      {historyJSON[object].requestText} - {historyJSON[object].responseText}
    </li>))

  return (<StyledPage>
      <Heading className="animate__animated animate__fadeInLeft">
        {state.userId !== null ? "Profile" : `Login in the morning`}
      </Heading>
      <Heading className="animate__animated animate__fadeInLeft">
        {state.userId !== null ? "" : `Profile in the evening`}
      </Heading>
      {state.userId != null ? (<div>
          <p className="user-info">Info</p>
          {UserJSON.imageUrl !== "" ? (<img src={UserJSON.imageUrl} alt="new"/>) : (<div/>)}
          <p className="info"> Name: {UserJSON.name} </p>
          <p className="info">Email: {UserJSON.email}</p>
          <p className="user-info"> Statistics</p>
          <p className="info">
            {" "}
            You have translated {historyList.length} words
          </p>
        </div>) : (<div/>)}
    </StyledPage>)
}

export default ProfilePage
