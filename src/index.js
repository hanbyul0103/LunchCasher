import {
    Client,
    GatewayIntentBits
} from "discord.js";

//env설정
import dotenv from "dotenv";
dotenv.config();

import { initializeDataFiles } from "./data/jsonHelper.js";

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

    initializeDataFiles(thisYear());
})

client.login(process.env.TOKEN);