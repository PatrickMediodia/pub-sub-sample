import redis from "redis";

const publisher = redis.createClient();
await publisher.connect();

const publish = async (username, topic, message) => {    
    await publisher.publish(
        topic,
        JSON.stringify({ topic, username, message })
    );

    console.log(`Message: '${message}' sent to topic: ${topic}`);
};

export default publish;
