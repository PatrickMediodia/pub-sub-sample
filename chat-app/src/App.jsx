import './App.css';
import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from "react-use-websocket";

import {
  Connection,
  Button,
  Header,
  Messages,
  InputField,
  Form
} from './components/index';

function App() {
  const [topic, setTopic] = useState('all');
  const [messages, setMessages] = useState([]);
  const [isReady, setIsReady] = useState(false);

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

  // get message from consumer
  useEffect(() => {
    if (lastJsonMessage === null) return;

    setMessages((prevMsgs) => {
      return [...prevMsgs, lastJsonMessage];
    });
  }, [lastJsonMessage]);

  // send initial topic on ready state
  useEffect(() => {
    const isReadyLocal = readyState === ReadyState.OPEN;

    if (isReadyLocal) {
      sendMessage(topic);
    }
    setIsReady(isReadyLocal);
  }, [readyState]);

  return (
    <>
      <Form>
        <Header title="Chat Room"/>
        <Connection connectionState={isReady} />
        <InputField value={topic} onChange={(e) => setTopic(e.target.value)} />
        <Button title='Change Room' handleSubmit={handleSubmit} />
      </Form>
      <Form>
        <Header title="Messages" />
        <Messages messages={messages} />
      </Form>
    </>
  )
}

export default App;
