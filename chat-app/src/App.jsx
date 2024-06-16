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
  const [currentUser, setCurrentUser] = useState('patrick');
  const [message, setMessage] = useState('');

  const WS_URL = "ws://localhost:3000"
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    },
  );

  // change topic
  const handleChangeTopic = (e) => {
    e.preventDefault();
    sendJsonMessage({
      type: 'topic',
      data: { topic },
    });
    setMessages([]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendJsonMessage({
      type: 'message',
      data: {
        username: currentUser,
        topic,
        message, 
      },
    });
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
      sendJsonMessage({
        type: 'topic',
        data: { topic },
      });
    }
    setIsReady(isReadyLocal);
  }, [readyState]);

  return (
    <>
      <Form>
        <Header title="Chat Room"/>
        <Connection connectionState={isReady} />
        <InputField value={topic} onChange={(e) => setTopic(e.target.value)} />
        <Button title='Change Room' handleSubmit={handleChangeTopic} />
      </Form>
      <Form>
        <Header title="Messages" />
        <Messages messages={messages} currentUser={currentUser} />
        <InputField value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button title='Send Message' handleSubmit={handleSendMessage} />
      </Form>
    </>
  )
}

export default App;
