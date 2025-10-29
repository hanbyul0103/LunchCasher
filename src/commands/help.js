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

            });
        }
    }
}