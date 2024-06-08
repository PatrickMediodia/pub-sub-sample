import redis from "redis";

const publisher = redis.createClient();

const publish = async (username, topic, message) => {
    await publisher.connect();
    await publisher.publish(
        topic, 
        `${username}: ${message}`
    );

    console.log(`Message: '${message}' sent to topic: ${topic}`);
};

export default publish;
