// 월, 일, 메뉴, 가격을 입력하면 json에 기록됨 (월, 일 안 쓰면 오늘, 메뉴와 가격은 필수 입력)
import {
    ApplicationCommandOptionType,
} from 'discord.js';

//env설정
import dotenv from "dotenv";
dotenv.config();

// 라이브러리
import path from 'path';
import { fileURLToPath } from 'url';
import { Jimp, JimpMime } from 'jimp';
import axios from 'axios';
import fs from 'fs';
import sharp from 'sharp';

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

        await interaction.deferReply({ ephemeral: true });

        if (!image || !image.contentType?.startsWith('image/')) {
            return await interaction.editReply({ content: '이미지 파일만 업로드할 수 있습니다.' });
        }

        const data = await handleReceiptImage(image.url);

        // console.log(`data: ${data.date}`);
        // console.log(`storeName: ${data.storeName}`);
        // console.log(`items: ${data.items}`);
        // console.log(`total: ${data.total}`);

        await interaction.editReply({ content: `${image.url}` });
    },
};

async function handleReceiptImage(imageUrl) {
    const preprocessed = await preprocessImage(imageUrl);
    const ocrResult = await runClovaOCR(preprocessed);
    // const structuredData = await analyzeReceiptWithDeepSeek(ocrResult);
    // await saveReceiptData(structuredData);
    // await replyWithSummary(message, structuredData);
}

async function preprocessImage(imageUrl) {
    const { data } = await axios.get(imageUrl, { responseType: "arraybuffer" });

    const resizedBuffer = await sharp(data)
        .resize({ width: 2000, withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();

    const image = await Jimp.read(resizedBuffer);

    image.greyscale();
    image.blur(1);

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        const gray = this.bitmap.data[idx];
        const val = gray > 128 ? 255 : 0;
        this.bitmap.data[idx] = val;
        this.bitmap.data[idx + 1] = val;
        this.bitmap.data[idx + 2] = val;
    });

    image.contrast(0.3);

    if (image.bitmap.width > 2000)
        image.scaleToFit(2000, Jimp.AUTO);
    else if (image.bitmap.width < 1000)
        image.resize(1000, Jimp.AUTO);

    image.convolute([
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0],
    ]);

    const buffer = await new Promise((resolve, reject) => {
        image.getBuffer(JimpMime.jpeg, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });

    return buffer.toString("base64");
}

async function runClovaOCR(imageBase64) {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "X-OCR-SECRET": process.env.CLOVA_SECRET,
        },
    };

    try {
        const response = await axios.post(process.env.CLOVA_API_URL, {
            images: [
                {
                    format: "jpg",
                    name: "receipt",
                    data: imageBase64,
                },
            ],
            lang: "ko",
            version: "V1",
        }, config);

        let sumText = "";
        const fields = response.data.images[0].fields;
        fields.forEach(f => {
            sumText += " " + f.inferText;
        });

        console.log("-------------------");
        console.log(sumText);
        console.log("-------------------");

        return sumText;

    } catch (error) {
        console.error("CLOVA OCR Error:", error.response?.data || error.message);
        throw error;
    }
}

async function analyzeReceiptWithDeepSeek(ocrData) {
    // 입력: OCR JSON (텍스트 목록 포함)
    // 출력: 구조화된 영수증 데이터 JSON
    // 예시 출력:
    // {
    //   date: "2025-11-11",
    //   store: "스타벅스 홍대점",
    //   items: [
    //     { name: "아메리카노", price: 4500 },
    //     { name: "샌드위치", price: 6500 }
    //   ],
    //   total: 11000
    // }
}

async function saveReceiptData(structuredData) {
    // 입력: DeepSeek이 생성한 JSON
    // 출력: 없음
    // 예시: Firebase, MongoDB, Supabase 등 저장
}

async function replyWithSummary(message, structuredData) {
    // 입력: 디스코드 메시지, 분석 결과 JSON
    // 출력: 없음
    // 예시 메시지:
    // 📅 2025-11-11
    // 🏪 스타벅스 홍대점
    // 🍽️ 아메리카노 - 4500원
    // 🍽️ 샌드위치 - 6500원
    // 💰 합계: 11000원
}