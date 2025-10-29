// 도움말 표시

// TODO: 영수증 임베드 표시할 때 들여쓰기 간격 맞춰주는 코드 작성해야됨. 따로따로 하기 힘들어서 여기에 작성함

import {
    ApplicationCommandOptionType
} from "discord.js";

// 외부 함수
import * as embedGenerator from "../utils/embedGenerator.js";

export default {
    name: 'help',
    description: '도움말을 표시합니다.',
    options: [
        {
            name: "command",
            description: "자세히 보고 싶은 명령어를 선택하세요.",
            type: ApplicationCommandOptionType.String,
            required: false,
            choices: [
                { name: "점심 기록 (/record-lunch)", value: "record-lunch" },
                { name: "기록 삭제 (/delete-lunch)", value: "delete-lunch" },
                { name: "기록 조회 (/get-history)", value: "get-history" },
                { name: "월별 합계 (/get-monthly-sum)", value: "get-monthly-sum" },
                { name: "월별 평균 (/get-monthly-average)", value: "get-monthly-average" },
            ]
        }
    ],
    callback: async (client, interaction) => {
        const command = interaction.options?.getString("command");

        // 선택을 안 하면
        if (!command) {
            const helpEmbed = embedGenerator.createEmbed({
                title: "LunchCasher봇 도움말",
                description: "각 명령어에 대한 간단한 설명입니다.\n자세한 설명은 `/help command:<`",
                fields: [
                    {
                        name: "/record-lunch",
                        value: "점심을 기록합니다.",
                        inline: false,
                    },
                    {
                        name: "/delete-lunch",
                        value: "기록을 삭제합니다.",
                        inline: false,
                    },
                    {
                        name: "/get-history",
                        value: "기록을 조회합니다.",
                        inline: false,
                    },
                    {
                        name: "/get-monthly-sum",
                        value: "월별 합계를 계산합니다.",
                        inline: false,
                    },
                    {
                        name: "/get-monthly-average",
                        value: "월별 평균을 계산합니다.",
                        inline: false,
                    },
                ],
                timestamp: true
            });

            await interaction.reply({ embeds: [helpEmbed] });

            return;
        }

        const details = {
            "record-lunch": {
                title: "/record-lunch",
                description: "특정 날짜의 점심 메뉴와 가격을 기록합니다.\n날짜를 입력하지 않을 시 당일로 기록됩니다.",
                usage: "/record-lunch menu:<메뉴> price:<가격> month:<월> day:<일> ",
                example: "/record-lunch menu:프랭크버거 price:8800 month:1 day:3"
            },
            "delete-lunch": {
                title: "/delete-lunch",
                description: "특정 날짜의 점심 기록을 삭제합니다.\n날짜를 입력하지 않을 시 당일 기록이 삭제됩니다.",
                usage: "/delete-lunch month:<월> day:<일>",
                example: "/delete-lunch month:1 day:3"
            },
            "get-history": {
                title: "/get-history",
                description: "해당 월의 점심 기록을 조회합니다.\n월을 입력하지 않을 시 당월 데이터를 조회합니다.",
                usage: "/get-history month:<월>",
                example: "/get-history month:1"
            },
            "get-monthly-sum": {
                title: "/sum-month",
                description: "월별 총 식비를 계산합니다.\n월을 입력하지 않을 시 당월 식비를 계산합니다.",
                usage: "/get-monthly-sum month:<월>",
                example: "/get-monthly-sum month:1"
            },
            "get-monthly-average": {
                title: "/get-monthly-average",
                description: "월별 평균 식비를 계산합니다.\n월을 입력하지 않을 시 당월 식비를 계산합니다.",
                usage: "/get-monthly-average month:<월>",
                example: "/get-monthly-average month:1"
            },
        };

        const info = details[command];
        if (!info) {
            await interaction.reply({ content: "해당 명령어에 대한 도움말을 찾을 수 없습니다." });

            return;
        }

        const helpEmbed = embedGenerator.createEmbed({
            title: `${info.title}`,
            description: `${info.description}`,
            fields: [
                { name: `사용법`, value: `${info.usage}`, },
                { name: "예시", value: `${info.example}`, }
            ],
            timestamp: true
        });

        await interaction.reply({ embeds: [helpEmbed] });
    }
}