import {
    Client,
    GatewayIntentBits
} from "discord.js";

//env설정
import dotenv from "dotenv";
dotenv.config();

// 라이브러리

// 외부 함수들
import * as jsonHelper from "./data/jsonHelper.js";
import * as commandRegister from "./utils/commandRegister.js";
import * as loadCommands from "./utils/loadCommands.js";

import { ThisYear } from "./utils/Core/getThisYear.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

let commands;

client.once("ready", async () => {
    console.log("[!] ready");

    // 명령어 세팅
    await commandRegister.registCommands();

    commands = await loadCommands.getCommands();

    // 폴더 및 파일 세팅
    jsonHelper.initializeDataFiles(ThisYear());
});

client.on("interactionCreate", async (interaction) => {
    // 채팅이 아니라면 리턴
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.callback(client, interaction);
    } catch (error) {
        console.log(`명령어 실행 중 예상치 못한 오류가 발생했습니다.`, error);

        await interaction.reply({ content: `명령어 실행 중 예상치 못한 오류가 발생했습니다.`, ephemeral: true });
    }
});

client.login(process.env.TOKEN);