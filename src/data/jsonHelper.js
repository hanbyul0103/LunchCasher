// json 관리 담당
import fs from 'fs';
import path from 'path';

function isFileExist(filePath) {
    return fs.existsSync(filePath);
}

function readFile(filePath) {
    if (!isFileExist(filePath)) {
        console.log(`[JSON_HELPER] 파일이 존재하지 않습니다: ${filePath}`);

        return {};
    }

    try {
        const data = fs.readFileSync(filePath, 'utf8');

        return JSON.parse(data || '{}');
    } catch (error) {
        console.error(`[JSON_HELPER] 파일을 불러오는 중 오류 발생: ${filePath}`, error);

        return {};
    }
}

function writeFile(filePath, data) {
    try {
        const jsonString = JSON.stringify(data, null, 4);

        fs.writeFileSync(filePath, jsonString, 'utf8');

        return true;
    } catch (error) {
        console.error(`[JSON_HELPER] 파일 저장 중 오류 발생: ${filePath}`, error);

        return false;
    }
}

function getYearDirectory(baseDir, year) {
    const yearDir = path.join(baseDir, year.toString());

    if (!isFileExist(yearDir)) {
        console.log(`[JSON_HELPER] 폴더가 존재하지 않습니다. 폴더를 생성합니다. ${yearDir}`);

        fs.mkdirSync(yearDir, { recursive: true });
    }

    return yearDir;
}

function initializeDataFiles(targetYear) {
    console.log(`[JSON_HELPER] ${targetYear}년 데이터 생성중...`);

    const yearDirectory = getYearDirectory('./src/data', targetYear);

    for (let i = 1; i <= 12; i++) {
        const monthString = i.toString().padStart(2, '0');
        const monthFileName = `${monthString}.json`;
        const filePath = path.join(yearDirectory, monthFileName);

        if (!isFileExist(filePath)) {
            console.log(`[JSON_HELPER] ${monthFileName} 파일이 없습니다. 파일을 새로 생성합니다.`);

            writeFile(filePath, []);
        }
    }

    console.log(`[JSON_HELPER] ${targetYear}년 데이터 생성을 완료했습니다.`);
};

export { readFile, writeFile, initializeDataFiles };