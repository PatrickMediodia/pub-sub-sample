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

  // change topic
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(topic);
    setMessages([]);
  };

  // get message from cosnumer
  useEffect(() => {
    if (lastJsonMessage === null) return;
    console.log(`Got a new message: ${JSON.stringify(lastJsonMessage)}`);

    setMessages((prevMsgs) => {
      return [...prevMsgs, lastJsonMessage];
    });
  }, [lastJsonMessage]);

  // send initial topic on ready state
  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendMessage(topic);
    }
  }, [readyState]);

  return (
    <>
      <div className='form'>
        <h2 className="form-header">Topic</h2>
        <div className='form-field'>
            <input
                className="form-input"
                name='email'
                type='text'
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                autoComplete="off"
            />   
            {
              readyState === ReadyState.OPEN
                ? <p>Status: Connection established</p>
                : <p>Status: Connection cannot be established</p> 
            }
        </div>
        <input 
          type="button"
          className="form-button"
          value="Change Topic"
          onClick={handleSubmit}
        />
      </div>
      <div className='form'>
        <h3 className="form-header">Messages</h3>
        {
          messages.map(function(message, index) {
            const msg = `${message.username}: ${message.message}`;
            return <p key={index}>{msg}</p>;
          })
        }
      </div>
    </>
  )
}

export default App;
