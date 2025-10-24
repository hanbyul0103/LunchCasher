// 입력한 달의 점심 비용 총 합을 알려줌 (안 쓰면 현재 월)
import {
    ApplicationCommandOptionType,
} from 'discord.js';

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

        console.log(month);
    },
};