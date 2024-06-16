#!/usr/bin/env node
import redis from "redis";
import express from "express";
import { createServer } from "http";
import { WebSocketServer } from 'ws';
import publish from "../publishers/publisher.js";

const PORT = 3000;
const app = express();

const server = createServer(app);
const wss = new WebSocketServer({ server });

const client = redis.createClient();
const subscriber = client.duplicate();
await subscriber.connect();

wss.on('error', console.error);

wss.on('connection', async function connection(ws) {
    console.log("\nA new client connected");

    ws.on('message', async function message(d) {
        const { type, data } = JSON.parse(d.toString());
        switch (type) {
            case 'topic':
                console.log(`\nTopic: ${data.topic}`);
                await subscribe(data.topic, ws);
                break;
            case 'message':
                const { username, topic, message } = data;
                await publish(
                    username,
                    topic,
                    message,
                );
                break;
            default:
                console.log('Cannot process message');
                break;
        }
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
