// 월, 일, 메뉴, 가격을 입력하면 json에 기록됨 (월, 일 안 쓰면 오늘, 메뉴와 가격은 필수 입력)
import {
    ApplicationCommandOptionType,
} from 'discord.js';

//env설정
import dotenv from "dotenv";
dotenv.config();

// 라이브러리
import axios from 'axios';

// 외부 함수
import * as lunchRecordUtils from "../utils/lunchRecordUtils.js";

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
        const apiBase = 'http://localhost:3000';

        await interaction.deferReply({ ephemeral: false });

        if (!image || !image.contentType?.startsWith('image/')) {
            return await interaction.editReply({ content: '이미지 파일만 업로드할 수 있습니다.' });
        }

        const { data: ocr } = await axios.post(`${apiBase}/api/receipt-ocr`, {
            imageUrl: image.url,
        });

        const firstItem = ocr.items[0];

        const menu = firstItem?.name ?? '';
        const price = ocr.totalPrice;
        const month = ocr.month;
        const day = ocr.day;

        const { specificationEmbed } = lunchRecordUtils.saveLunchRecord({
            menu: menu,
            price: price,
            month,
            day,
        });
        console.log(`${menu} ${price} ${month} ${day}`);

        await interaction.editReply({
            content: `영수증에서 인식된 메뉴를 기록했어요!`,
            embeds: [specificationEmbed],
        });
    },
};