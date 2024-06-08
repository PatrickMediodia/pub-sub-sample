import yargs from "yargs";
import consumer from "./consumer";

const { argv } = yargs(process.argv.slice(2));

consumer(argv.topic);

//TODO: Subscribe to multiple topics
//Run by using the command npm run start-sub-cli -- --topic=<topic>
