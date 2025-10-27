// 입력한 달의 점심 비용 총 합을 알려줌 (안 쓰면 현재 월)
import {
    ApplicationCommandOptionType,
} from 'discord.js';

// 라이브러리
import path from "path";
import { fileURLToPath } from 'url';

// 외부 함수
import * as jsonHelper from "../data/jsonHelper.js";
import * as embedGenerator from "../utils/embedGenerator.js";
import * as monthlyCalculator from "../utils/monthlyCalculator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    name: 'get-monthly-sum',
    description: '입력한 달의 점심 가격의 합을 보여줍니다.',
    options: [
        {
            name: 'month',
            description: '불러올 달',
            required: false,
            type: ApplicationCommandOptionType.Integer,
            min_value: 1,
            max_value: 12,
        },
    ],
    callback: async (client, interaction) => {
        let month = interaction.options?.getInteger('month');

        if (!month) month = new Date().getMonth() + 1;

        month = month.toString().padStart(2, '0');

        const dataPath = path.join(__dirname, `../data/2025`);
        const targetFile = path.join(dataPath, `${month}.json`);

        const data = jsonHelper.readFile(targetFile);

        const value = data.map(d => d.price);

        const sum = monthlyCalculator.sum(value);
        const fields = [{
            name: `${month}월 총합`,
            value: `${sum}원`,
            inline: false
        }]

        const embed = embedGenerator.createEmbed({
            title: "명세서",
            description: "2025년 통계",
            fields: fields,
            timestamp: true
        });

        await interaction.reply({ embeds: [embed] });
    },
};