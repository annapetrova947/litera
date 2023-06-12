import React, {useEffect, useState} from "react"

import "./history_page.css"
import {AuthContext} from "../../App"
import {Heading, StyledPage} from "../../template_styles/PageAnimStyles"

export async function fetchHistoryJson(userId) {
  if (userId == null) return {}
  try {
    const historyRes = await fetch("http://localhost:3001", {
      method: "POST", body: JSON.stringify({
        userID: userId.toString(), type: "get_history",
      }),
    })

    return JSON.parse(JSON.stringify(await historyRes.json()))
  } catch (e) {
    return {}
  }
}

export function amount(historyList) {
  if (historyList.length === 0) {
    return "Translate your first word!"
  }
  return `You have translated ${historyList.length} words`
}

export function HistoryPage() {
  const {state, dispatch} = React.useContext(AuthContext)
  const [historyJSON, setHistoryJSON] = useState({})

  useEffect(async () => {
    setHistoryJSON(await fetchHistoryJson(state.userId))
  }, [state])

  const historyList = Object.keys(historyJSON).map((object, i) => (<li key={object}>
    {historyJSON[object].requestText} - {historyJSON[object].responseText}
  </li>))

  return (<StyledPage>
    <Heading className="animate__animated animate__fadeInLeft">
      History it out
    </Heading>
    <p className="amount-translation">
      {" "}
      {state.userId != null ? amount(historyList) : "Would you like to sign in? Ah?"}
    </p>
    <ul className="history-list">{historyList.reverse()}</ul>
  </StyledPage>)
}

export default HistoryPage
