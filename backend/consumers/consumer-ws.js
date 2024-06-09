#!/usr/bin/env node
import redis from "redis";
import express from "express";
import { createServer } from "http";
import { WebSocketServer } from 'ws';

const PORT = 3000;
const app = express();

const server = createServer(app);
const wss = new WebSocketServer({ server });

const client = redis.createClient();
const subscriber = client.duplicate();
await subscriber.connect();

wss.on('error', console.error);

wss.on('connection', async function connection(ws) {
    console.log("A new client connected");

    ws.on('message', async function message(data) {
        const topic = data.toString();
        console.log(`\nTopic: ${topic}`);

        await subscribe(topic, ws);
    });
});

server.listen(PORT, () => console.log(`Listening on port:${PORT}`));

const subscribe = async (topic, ws) => {
    await subscriber.unsubscribe();

    await subscriber.subscribe(topic, (msg) => {
        console.log(`New Message: ${msg}`);
        ws.send(msg);
    });
};
