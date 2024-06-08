import redis from "redis";
import express from "express";
import bodyParser from "body-parser";
import publish from "./publisher.js";
import { checkBody, checkParams } from "./middleware/index.js";

const PORT = 3000
const app = express();

const publisher = redis.createClient();
await publisher.connect();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(PORT, () => {
    console.log(`Publisher listening on ${PORT}`)
});

app.post(
    '/publish/:username', 
    checkParams,
    checkBody,
    publish
);
