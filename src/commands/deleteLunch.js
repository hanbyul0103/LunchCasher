// 월, 일을 입력하면 json에서 삭제됨 (월, 일 안 쓰면 오늘)
import {
    ApplicationCommandOptionType
} from "discord.js";

// 라이브러리
import path from 'path';
import { fileURLToPath } from 'url';

// 외부 함수
import * as jsonHelper from "../data/jsonHelper.js";
import * as embedGenerator from "../utils/embedGenerator.js";

import { ThisYear } from '../utils/Core/getThisYear.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    name: 'delete-lunch',
    description: '점심 기록을 삭제합니다.',
    options: [
        {
            name: 'month',
            description: '월',
            required: false,
            type: ApplicationCommandOptionType.Integer,
            min_value: 1,
            max_value: 12,
        },
        {
            name: 'day',
            description: '일',
            required: false,
            type: ApplicationCommandOptionType.Integer,
            min_value: 1,
            max_value: 31,
        },
    ],
    callback: async (client, interaction) => {
        let month = interaction.options?.getInteger('month');
        let day = interaction.options?.getInteger('day');

        if (!month) month = date().month;
        month = month.toString().padStart(2, '0');
        if (!day) day = date().day;

        let fields = [];

        const dataPath = path.join(__dirname, `../data/${ThisYear()}`);
        const targetFile = path.join(dataPath, `${month}.json`);

        let data = jsonHelper.readFile(targetFile);

        const deletedItem = data.find(d => d.day === day);
        getEmbedFields(targetFile, fields, month, deletedItem?.day);

        const specificationEmbed = embedGenerator.createEmbed({
            title: "명세서",
            description: `${ThisYear()}년 통계`,
            fields: fields,
            timestamp: true
        });

        await interaction.reply({ embeds: [specificationEmbed] });

        data = data.filter(d => d.day !== day);
        jsonHelper.writeFile(targetFile, data);

        setTimeout(async () => {
            let newFields = [];
            getEmbedFields(targetFile, newFields, month);

            const updatedEmbed = embedGenerator.createEmbed({
                title: "명세서",
                description: `${ThisYear()}년 통계`,
                fields: newFields,
                timestamp: true
            });

            await interaction.editReply({ embeds: [updatedEmbed] });
        }, 3000);
    }
}

function date() {
    const today = new Date();

    return {
        month: today.getMonth() + 1,
        day: today.getDate()
    }
}

function getEmbedFields(targetFile, fields, month, deletedDay = null) {
    const data = jsonHelper.readFile(targetFile);

    const value = data.map(d => {
        const line = `${d.day.toString().padStart(2, ' ')}일 ${d.menu} ${d.price}원`;
        return (d.day === deletedDay) ? `- ${line}` : line;
    }).join('\n');

    fields.push({
        name: `${month}월`,
        value: value,
        inline: true
    });

    return;
}