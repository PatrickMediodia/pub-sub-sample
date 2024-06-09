import './App.css';
import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from "react-use-websocket";

function App() {
  const [topic, setTopic] = useState('all');
  const [messages, setMessages] = useState([]);

  const WS_URL = "ws://localhost:3000"
  const { sendMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    },
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(topic);
    setMessages([]);
  };

  useEffect(() => {
    if (lastJsonMessage === null) return;
    console.log(`Got a new message: ${JSON.stringify(lastJsonMessage)}`);

    setMessages((prevMsgs) => {
      return [...prevMsgs, lastJsonMessage];
    });
  }, [lastJsonMessage]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendMessage(topic);
    }
  }, [readyState]);

  return (
    <>
      {
        readyState === ReadyState.OPEN
          ? 'Connection established'
          : 'Connection cannot be established'
      }
      <div className='form-field'>
          <input
              className="form-input"
              name='email'
              type='text'
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              autoComplete="off"
          />
      </div>
      <a onClick={handleSubmit} className='form-link'>Change Topic</a>

      {
        messages.map(function(message, index) {
          const msg = `${message.username}: ${message.message}`;
          return <p key={index}>{msg}</p>;
        })
      }
    </>
  )
}

export default App;
