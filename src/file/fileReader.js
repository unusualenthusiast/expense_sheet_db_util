const path = require('path');
const xlsx = require('node-xlsx');
const fs = require('fs');
const { FILE_PATH, SHEET_COLS } = require('../constants');


function getDataFromSheet(fileNames) {
    const data = [];
    fileNames.forEach(fileName => {
        const inputFilePath = path.join(__dirname, '..', '..', FILE_PATH, fileName);
        const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(inputFilePath));
        workSheetsFromBuffer.map((sheet, sheetInd) => {
            if (sheetInd >= 0) {
                sheet.data.map((row, rowInd) => {
                    if (rowInd > 0) {
                        //Neglecting first row as it is column header
                        const object = {};
                        if (row.length > 0 && row[0] && row[6]) {
                            row.map((value, valueInd) => {
                                if (valueInd === 0)
                                    object[SHEET_COLS[valueInd]] = new Date(Date.UTC(0, 0, value - 1));
                                else
                                    object[SHEET_COLS[valueInd]] = value;
                            });
                            if (Object.keys(object).length > 0)
                                data.push(object);
                        }
                    }
                });
            }
        });
    });
    return data;
}

module.exports = {
    getDataFromSheet
};