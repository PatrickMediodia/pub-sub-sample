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
        const { username, topic, message } = data;

        switch (type) {
            case 'topic':
                await establishConnection(username, ws);
                await subscribe(username, topic);
                break;

            case 'message':
                await publish(username, topic, message);
                break;

            default:
                console.log('Cannot process message');
                break;
        }
    });
});

server.listen(PORT, () => console.log(`Listening on port:${PORT}`));

const establishConnection = async (username, ws) => {
    if (clients[username] != null) return;

    clients[username] = {
        client: client.duplicate(),
        connection: ws,
    };

    await clients[username].client.connect();
};

const subscribe = async (username, topic) => {
    await clients[username].client.unsubscribe();

    console.log(`\nUser: ${username} subscribed to topic: ${topic}`);
    await clients[username].client.subscribe(topic, (message) => {
        console.log(`New Message: ${message}`);
        clients[username].connection.send(message);
    });
};
