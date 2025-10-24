// 입력한 달의 소비 기록을 보여줌 (0 입력 시 전체 기록을 보여줌)
import {
    ApplicationCommandOptionType,
    inlineCode,
} from 'discord.js';

// 라이브러리
import path from "path";
import { fileURLToPath } from 'url';

// 외부 함수
import * as jsonHelper from "../data/jsonHelper.js";
import * as embedGenerator from "../utils/embedGenerator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    name: 'get-history',
    description: '입력한 달의 점심 내역을 모두 불러옵니다.',
    options: [
        {
            name: 'month',
            description: '불러올 달',
            required: false,
            type: ApplicationCommandOptionType.Integer,
            min_value: 0,
            max_value: 12,
        },
    ],
    callback: async (client, interaction) => {
        let month = interaction.options?.getInteger('month');

        if (!month) month = new Date().getMonth() + 1;
        month = month.toString().padStart(2, '0');

        let data;

        if (month === "00") {
            // 전체 달(month)
        }
        else {
            const dataPath = path.join(__dirname, `../data/2025`);
            const targetFile = path.join(dataPath, `${month}.json`);

            data = jsonHelper.readFile(targetFile);
        }

        const fields = [];
        //const value = data.map(d => `${d.day}일\t${d.menu}\t${d.price}원`).join('\n');
        const value = '```\n' + data.map(d => {
            const day = d.day.toString().padStart(2, ' ');        // 날짜 정렬
            const menu = d.menu.padEnd(12, ' ');                  // 메뉴 길이 맞춤
            const price = d.price.toLocaleString().padStart(6, ' '); // 가격 정렬
            return `${day}일 | ${menu} | ${price}원`;
        }).join('\n') + '\n```';

        fields.push({
            name: `${month}월`,
            value: value,
            inline: true
        });

        const specificationEmbed = embedGenerator.createEmbed({
            title: "명세서",
            description: "2025년 통계",
            fields: fields,
            timestamp: true
        });

        await interaction.reply({ embeds: [specificationEmbed] });
    },
};