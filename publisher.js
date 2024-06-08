import redis from "redis";

const publisher = redis.createClient();
await publisher.connect();

const publish = async (req, res) => {
    let { username } = req.params;
    let { message, topic } = req.body;

    await publisher.publish(
        topic, 
        `${username}: ${message}`
    );

    res.send(`Message: '${message}' sent.`);
};

export default publish;
