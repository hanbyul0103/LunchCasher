// 월, 일, 메뉴, 가격을 입력하면 json에 기록됨 (월, 일 안 쓰면 오늘, 메뉴와 가격은 필수 입력)
import {
    ApplicationCommandOptionType,
} from 'discord.js';

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
            min_value: 0,
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
        if (!day) day = date().day;

        console.log(`${month} ${day} ${menu} ${price}`);
    },
};

function date() {
    const today = new Date();

    return {
        month: today.getMonth() + 1,
        day: today.getDate()
    }
}