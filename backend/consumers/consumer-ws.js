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

let clients = {};
const client = redis.createClient();

wss.on('error', console.error);

wss.on('connection', async function connection(ws) {
    console.log("\nA new client connected");

    ws.on('message', async function message(d) {
        const { type, data } = JSON.parse(d.toString());

        switch (type) {
            case 'topic':
                if (clients[data.username] == null) {
                    clients[data.username] = client.duplicate();
                    await clients[data.username].connect();
                }
                await subscribe(data, ws);
                break;

            case 'message':
                const { username, topic, message } = data;
                await publish(username,topic,message);
                break;

            default:
                console.log('Cannot process message');
                break;
        }
    });
});

server.listen(PORT, () => console.log(`Listening on port:${PORT}`));

const subscribe = async (data, ws) => {
    const { username, topic } = data;
    await clients[username].unsubscribe();

    console.log(`\nTopic: ${topic}`);
    await clients[username].subscribe(topic, (msg) => {
        console.log(`New Message: ${msg}`);
        ws.send(msg);
    });
};
