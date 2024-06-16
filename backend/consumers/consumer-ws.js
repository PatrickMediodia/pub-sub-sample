#!/usr/bin/env node
import redis from "redis";
import express from "express";
import { createServer } from "http";
import WebSocket, { WebSocketServer } from 'ws';
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
                if (clients[data.username] === null || clients[data.username] === undefined) {
                    clients[data.username] = {
                        client: client.duplicate(),
                        connection: ws,
                    };
                    await clients[data.username]['client'].connect();
                }
                await subscribe(data);
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

const subscribe = async (data) => {
    const { username, topic } = data;
    await clients[username]['client'].unsubscribe();

    console.log(`\nTopic: ${topic}`);
    await clients[username]['client'].subscribe(topic, (msg) => {
        console.log(`New Message: ${msg}`);
        clients[username]['connection'].send(msg);
    });
};
