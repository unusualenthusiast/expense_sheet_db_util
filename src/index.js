const { getDataFromSheet } = require('./file/fileReader');
const { trasnformer } = require('./file/transformer');
const { FILE_NAME, CLEAN_DB_MODE } = require('./constants');
const { DB_MODE } = require('./config');
const { executeDDL, executeDML } = require('./db/init');
const { bulkUploadExpenseWrapper } = require('./db/bulkUploadExpense');


async function kickStart() {
    if (DB_MODE === CLEAN_DB_MODE) {
        console.log("inside cleanmode");
        await executeDDL();
        await executeDML();
    }
    const data = await trasnformer(getDataFromSheet([FILE_NAME]))
    await bulkUploadExpenseWrapper(data);
}


kickStart();