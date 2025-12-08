import path from 'path';
import { fileURLToPath } from 'url';

// 외부 함수
import * as jsonHelper from "../data/jsonHelper.js";
import * as embedGenerator from "../utils/embedGenerator.js";

import { ThisYear } from '../utils/Core/getThisYear.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function saveLunchRecord({ menu, price, month, day }) {
    // month / day 비어 있으면 오늘 날짜로
    if (!month) month = date().month;
    if (!day) day = date().day;

    const monthStr = month.toString().padStart(2, '0');

    const dataPath = path.join(__dirname, `../data/${ThisYear()}`);
    const targetFile = path.join(dataPath, `${monthStr}.json`);

    let data = jsonHelper.readFile(targetFile);

    const newData = { day, menu, price };

    let inserted = false;
    for (let i = 0; i < data.length; i++) {
        if (data[i].day > day) {
            data.splice(i, 0, newData);
            inserted = true;
            break;
        } else if (data[i].day === day) {
            // 같은 날짜가 이미 있으면 덮어쓰기
            data[i] = newData;
            inserted = true;
            break;
        }
    }

    if (!inserted) data.push(newData); // 마지막에 추가

    jsonHelper.writeFile(targetFile, data);

    // 방금 기록된 날 찾기
    const recordedItem = data.find(d => d.day === day);

    let fields = [];
    getEmbedFields(targetFile, fields, monthStr, recordedItem?.day);

    const specificationEmbed = embedGenerator.createEmbed({
        title: "명세서",
        description: `${ThisYear()}년 통계`,
        fields: fields,
        timestamp: true
    });

    // 디스코드에서 쓸 임베드 리턴
    return { specificationEmbed };
}

function date() {
    const today = new Date();

    return {
        month: today.getMonth() + 1,
        day: today.getDate()
    }
}

function getEmbedFields(targetFile, fields, month, recordedDay = null) {
    const data = jsonHelper.readFile(targetFile);

    const value = data.map(d => {
        const line = `${d.day.toString().padStart(2, ' ')}일 ${d.menu} ${d.price}원`;
        return (d.day === recordedDay) ? `+ ${line}` : line;
    }).join('\n');

    fields.push({
        name: `${month}월`,
        value: value,
        inline: true
    });

    return;
}

export { saveLunchRecord }