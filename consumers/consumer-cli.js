import redis from "redis";
import yargs from "yargs";

const { argv } = yargs(process.argv.slice(2));

const client = redis.createClient();
const subscriber = client.duplicate();

const consumer = async (topic) => {
    console.log(`Subscribed to topic: ${topic}\n`);

    await subscriber.connect();
    await subscriber.subscribe(topic, (msg) => {
        console.log(`${topic}: ${msg}`);
    });
};

consumer(argv.topic);

//TODO: Subscribe to multiple topics
//Run by using the command npm run start-sub-cli -- --topic=<topic>
