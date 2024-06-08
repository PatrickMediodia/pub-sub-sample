import express from "express";
import bodyParser from "body-parser";
import publish from "./publisher.js";
import { checkBody, checkParams } from "../middleware/index.js";

const PORT = 3000
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Publisher listening on port:${PORT}`)
});

app.post(
    '/publish/:username', 
    checkParams,
    checkBody,
    publishAPI
);

const publishAPI = async (req, res) => {
    let { username } = req.params;
    let { message, topic } = req.body;

    await publish(
        username,
        topic,
        message,
    );

    res.send(`Message: '${message}' sent to topic: ${topic}`);
};
