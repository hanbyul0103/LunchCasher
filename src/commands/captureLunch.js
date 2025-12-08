// 월, 일, 메뉴, 가격을 입력하면 json에 기록됨 (월, 일 안 쓰면 오늘, 메뉴와 가격은 필수 입력)
import {
    ApplicationCommandOptionType,
} from 'discord.js';

//env설정
import dotenv from "dotenv";
dotenv.config();

// 라이브러리
import axios from 'axios';
import { randomUUID } from 'crypto';

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

        await interaction.deferReply({ ephemeral: false });

        if (!image || !image.contentType?.startsWith('image/')) {
            return await interaction.editReply({ content: '이미지 파일만 업로드할 수 있습니다.' });
        }

        const { menus, month, day } = await handleReceiptImage(image.url);

        if (!menus || menus.length === 0) {
            return await interaction.editReply('영수증에서 메뉴를 찾지 못했어요 🥲');
        }

        const mainMenu = menus[0];

        const { specificationEmbed } = lunchRecordUtils.saveLunchRecord({
            menu: mainMenu.name,
            price: mainMenu.price,
            month,
            day,
        });

        await interaction.editReply({
            content: `영수증에서 인식된 메뉴를 기록했어요!`,
            embeds: [specificationEmbed],
        });
    },
};

async function handleReceiptImage(imageUrl) {
    const base64 = await downloadImageAsBase64(imageUrl);

    const ocrResult = await runClovaOCR(base64);

    return ocrResult;
}

async function downloadImageAsBase64(url) {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(res.data, 'binary').toString('base64');
}

async function runClovaOCR(imageBase64) {
    const body = {
        version: 'V2',
        requestId: randomUUID(),
        timestamp: Date.now(),
        images: [
            {
                format: 'jpg',
                name: 'receipt',
                data: imageBase64,
            },
        ],
    };

    const response = await axios.post(process.env.CLOVA_API_URL, body, {
        headers: {
            'Content-Type': 'application/json',
            'X-OCR-SECRET': process.env.CLOVA_SECRET,
        },
    });

    if (response.data.code) {
        console.error('CLOVA OCR Error:', response.data);
        throw new Error(
            `CLOVA OCR 오류(code=${response.data.code}): ${response.data.message}`,
        );
    }

    const image = response.data.images?.[0];
    const result = image?.receipt?.result;

    if (!result) {
        console.error('영수증 결과를 찾을 수 없습니다:', response.data);
        throw new Error('영수증 인식 결과가 없습니다.');
    }

    // ----------------------------
    // ① 메뉴 이름 + 가격만 뽑기
    // ----------------------------
    const items = result.subResults?.flatMap(sub => sub.items || []) ?? [];

    const menus = items.map(item => {
        const name = item.name?.text ?? '';
        const priceStr =
            item.price?.price?.formatted?.value ??
            item.price?.price?.text ?? '0';

        return {
            name: name,
            price: Number(priceStr),
        };
    });

    // ----------------------------
    // ② 날짜 → 월, 일 나누기
    // ----------------------------
    const formatted = result.paymentInfo?.date?.formatted;

    const month = formatted?.month ? Number(formatted.month) : null;
    const day = formatted?.day ? Number(formatted.day) : null;

    return {
        menus,
        month,
        day,
    };
}
