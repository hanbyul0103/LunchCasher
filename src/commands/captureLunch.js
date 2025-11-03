// 월, 일, 메뉴, 가격을 입력하면 json에 기록됨 (월, 일 안 쓰면 오늘, 메뉴와 가격은 필수 입력)
import {
    ApplicationCommandOptionType,
} from 'discord.js';

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
    name: 'image-test',
    description: '영수증 분석',
    options: [
        {
            name: 'image',
            description: '영수증 이미지를 첨부하세요.',
            type: ApplicationCommandOptionType.Attachment,
            required: true,
        },
    ],
    callback: async (client, interaction) => {
        const image = interaction.options.getAttachment('image');

        if (!image || !image.contentType?.startsWith('image/')) {
            return await interaction.reply({ content: '이미지 파일만 업로드할 수 있습니다.', ephemeral: true, });
        }

        await interaction.reply({ content: `${image.url}` });
    },
};