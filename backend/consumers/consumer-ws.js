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

    ws.on('message', async function message(data) {
        processMessage(data, ws);
    });

    ws.on('close', function close() {
        cleanUpOnDisconnect(ws);
    });
});

server.listen(PORT, () => console.log(`Listening on port:${PORT}`));

const processMessage = async (d, ws) => {
    const { type, data } = JSON.parse(d.toString());
    const { username, topic, message } = data;

    switch (type) {
        case 'topic':
            await establishRedisConnection(username, ws);
            await subscribe(username, topic);
            break;

        case 'message':
            await publish(username, topic, message);
            break;

        default:
            console.log('Cannot process message');
            break;
    }
};

const establishRedisConnection = async (username, ws) => {
    if (clients[username] != null) return;

    clients[username] = {
        client: client.duplicate(),
        connection: ws,
    };

    await clients[username].client.connect();
};

const subscribe = async (username, topic) => {
    await clients[username].client.unsubscribe();

    console.log(`User: ${username} subscribed to topic: ${topic}`);

    await clients[username].client.subscribe(topic, (message) => {
        console.log(`\nNew Message: ${message} sent to ${username}`);
        clients[username].connection.send(message);
    });
};

const cleanUpOnDisconnect = function close (ws) {
    for (const key of Object.keys(clients)) {
        if (clients[key].connection === ws) {
            clients[key].client.disconnect();
            delete clients[key];
            console.log(`Client ${key} disconnected`);
            return;
        }
    };
};
