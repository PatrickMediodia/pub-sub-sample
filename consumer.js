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

// get first argument after node(1) and command(2)
consumer(process.argv[2]);
