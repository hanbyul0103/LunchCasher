// 입력한 달의 소비 기록을 보여줌 (0 입력 시 전체 기록을 보여줌)
import {
    ApplicationCommandOptionType,
} from 'discord.js';

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

        console.log(month);
    },
};