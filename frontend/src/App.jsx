import './App.css';
import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from "react-use-websocket";

function App() {
  const [messages, setMessages] = useState([]);
  
  const WS_URL = "ws://localhost:3000"
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    },
  )

  // useEffect(() => {
  //   console.log("Connection state changed")
  //   if (readyState === ReadyState.OPEN) {
  //     sendJsonMessage({
  //       event: "subscribe",
  //       data: {
  //         channel: "general-chatroom",
  //       },
  //     })
  //   }
  // }, [readyState]);

  useEffect(() => {
    console.log(`Got a new message: ${lastJsonMessage}`)

    if (lastJsonMessage === null) {
      return;
    }

    setMessages((prevMsgs) => {
      return [...prevMsgs, lastJsonMessage];
    });
  }, [lastJsonMessage])

  return (
    <>
      {      
        messages.map((message) => {
          const msg = `${message.username}: ${message.message}`;
          return <p key={msg}>{msg}</p>;
        })
      }
    </>
  )
}

export default App;
