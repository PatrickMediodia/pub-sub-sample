import './App.css';
import { useState, useEffect } from 'react';
import { generateUsername } from "unique-username-generator";
import useWebSocket, { ReadyState } from "react-use-websocket";

import {
  Connection,
  Button,
  Header,
  Messages,
  InputField,
  Form
} from './components/index';

const username = generateUsername();

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [topic, setTopic] = useState('general');

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
      data: { 
        topic,
        username,
      },
    });
    setMessages([]);
  };

  // send message to topic
  const handleSendMessage = (e) => {
    e.preventDefault();
    sendJsonMessage({
      type: 'message',
      data: {
        username,
        topic,
        message, 
      },
    });
    setMessage('');
  };

  // get message from ws consumer
  useEffect(() => {
    if (lastJsonMessage === null) return;

    setMessages((prevMsgs) => {
      return [...prevMsgs, lastJsonMessage];
    });
  }, [lastJsonMessage]);

  // send initial topic on ready state
  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        type: 'topic',
        data: { 
          topic,
          username,
        },
      });
    }
  }, [readyState]);

  return (
    <>
      <Form>
        <Header title="Chat Room"/>
        <Connection connectionState={readyState === ReadyState.OPEN} />
        <p>Username: {username}</p>
        <InputField value={topic} onChange={(e) => setTopic(e.target.value)} />
        <Button title='Change Room' handleSubmit={handleChangeTopic} />
      </Form>
      <Form>
        <Header title="Messages" />
        <Messages messages={messages} username={username} />
        <InputField value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button title='Send Message' handleSubmit={handleSendMessage} />
      </Form>
    </>
  );
}

export default App;
