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

        const data = parseReceipt(image);

        console.log(`data: ${data.date}`);
        console.log(`storeName: ${data.storeName}`);
        console.log(`items: ${data.items}`);
        console.log(`total: ${data.total}`);

        await interaction.reply({ content: `${image.url}` });
    },
};

/**
 * 1️⃣ OCR 결과 정제 (원시 OCR JSON → { text, x, y } 형태로 정리)
 */
function normalizeOCRResult(rawOCR) {
    // TODO: OCR 라이브러리 결과 형식에 맞게 텍스트, 좌표만 추출
    // return [{ text, x, y }, ...]
}

/**
 * 2️⃣ OCR 결과에서 날짜 추출
 */
function extractDate(ocrData) {
    // TODO: 날짜 정규식 기반 탐색
    // return "2025-11-11" or null
}

/**
 * 3️⃣ OCR 결과에서 가게 이름 추출
 */
function extractStoreName(ocrData) {
    // TODO: 상단부 한글 텍스트 탐색
    // return "스타벅스 강남점" or null
}

/**
 * 4️⃣ OCR 결과를 줄 단위로 묶기 (y좌표 기준)
 */
function groupByLine(ocrData) {
    // TODO: y 좌표 가까운 요소끼리 묶기
    // return [[{ text, x, y }, ...], ...]
}

/**
 * 5️⃣ 품목 및 가격 목록 추출
 */
function extractItems(lines) {
    // TODO: 각 줄에서 이름과 가격 매칭
    // return [{ name, price }, ...]
}

/**
 * 6️⃣ 합계(총액) 추출
 */
function extractTotal(lines) {
    // TODO: "합계", "총액", "TOTAL" 등의 키워드로 탐색
    // return number or null
}

/**
 * 7️⃣ 전체 영수증 정보 파싱 (최종 조합)
 */
function parseReceipt(rawOCR) {
    const ocrData = normalizeOCRResult(rawOCR);
    const date = extractDate(ocrData);
    const storeName = extractStoreName(ocrData);
    const lines = groupByLine(ocrData);
    const items = extractItems(lines);
    const total = extractTotal(lines);

    return { storeName, date, items, total };
}
