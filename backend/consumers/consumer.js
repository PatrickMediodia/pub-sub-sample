import redis from "redis";

const client = redis.createClient();
const subscriber = client.duplicate();

const consumer = async (topic) => {
    console.log(`Subscribed to topic: ${topic}\n`);

    await subscriber.connect();
    await subscriber.subscribe(topic, (msg) => {
        console.log(`${topic}: ${msg}`);
    });
};

export default consumer;
