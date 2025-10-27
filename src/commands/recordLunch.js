// 월, 일, 메뉴, 가격을 입력하면 json에 기록됨 (월, 일 안 쓰면 오늘, 메뉴와 가격은 필수 입력)
import {
    ApplicationCommandOptionType,
} from 'discord.js';

// 라이브러리
import path from 'path';
import { fileURLToPath } from 'url';

// 외부 함수
import * as jsonHelper from "../data/jsonHelper.js";

import { ThisYear } from '../utils/Core/getThisYear.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    name: 'record-lunch',
    description: '점심을 기록합니다.',
    options: [
        {
            name: 'menu',
            description: '메뉴',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'price',
            description: '가격',
            required: true,
            type: ApplicationCommandOptionType.Integer,
        },
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
        const menu = interaction.options.getString('menu');
        const price = interaction.options.getInteger('price');
        let month = interaction.options?.getInteger('month');
        let day = interaction.options?.getInteger('day');

        if (!month) month = date().month;
        month = month.toString().padStart(2, '0');
        if (!day) day = date().day;

        const dataPath = path.join(__dirname, `../data/${ThisYear()}`);
        const targetFile = path.join(dataPath, `${month}.json`);

        let data = jsonHelper.readFile(targetFile);

        const newData = { day, menu, price };

        let inserted = false;
        for (let i = 0; i < data.length; i++) {
            if (data[i].day > day) {
                data.splice(i, 0, newData);
                inserted = true;
                break;
            } else if (data[i].day === day) {
                // 같은 날짜가 이미 있으면 덮어쓰기
                data[i] = newData;
                inserted = true;
                break;
            }
        }

        if (!inserted) data.push(newData); // 마지막에 추가

        jsonHelper.writeFile(targetFile, data);

        await interaction.reply({ content: `${month}/${day} 점심 기록 ${menu}: ${price}` });
    },
};

function date() {
    const today = new Date();

    return {
        month: today.getMonth() + 1,
        day: today.getDate()
    }
}