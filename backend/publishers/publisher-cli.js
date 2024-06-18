import yargs from "yargs";
import publish from "./publisher.js";

const { argv } = yargs(process.argv.slice(2));

setInterval(async () => {
    await publish(
        argv.username,
        argv.topic,
        argv.message,
    );
}, Math.floor(Math.random() * 5000));

// const main = async () => {
//     await publish(
//         argv.username,
//         argv.topic,
//         argv.message,
//     );
// };
// main();

//TODO: Add args to publisher-cli
// --topic=<topic>
// --message=<message>
// --usernane=<username>

//Run by using the command npm run start-pub-cli -- --topic=<topic> --message=<message> --username=<username>
