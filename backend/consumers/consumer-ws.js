#!/usr/bin/env node
import yargs from "yargs";
import redis from "redis";
import express from "express";
import { createServer } from "http";
import { WebSocketServer } from 'ws';

const { argv } = yargs(process.argv.slice(2));

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
    
    const topic = 'all';
    await subscriber.subscribe(topic, (msg) => {
        const response = `${topic}: ${msg}`;
        console.log(response);
        ws.send(msg);
    });
});

server.listen(
    PORT,
    () => { console.log(`Listening on port:${PORT}`) }
);
