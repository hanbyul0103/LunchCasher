import {
    Client,
    GatewayIntentBits
} from "discord.js";

//env설정
import dotenv from "dotenv";
dotenv.config();

import path from "path";

import * as jsonHelper from "./data/jsonHelper.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

const thisYear = () => {
    return new Date().getFullYear();
}

client.on("ready", async () => {
    console.log("[!] ready");

    jsonHelper.initializeDataFiles(thisYear());

    const dir = path.join('./src/data/2025/01.json');

    const data = jsonHelper.readFile(dir);

    console.log(data);
})

client.login(process.env.TOKEN);