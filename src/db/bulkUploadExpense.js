const { DB_SCHEMA } = require("../config");
const { getDBConnection } = require("./createConnection");

async function bulkUploadExpenseWrapper(data) {
    const connectId = Date.now();
    let dbConnection;
    try {
        dbConnection = getDBConnection();
        await dbConnection.connect();
        console.log(`DB Connection(${connectId}) is started`);
        await bulkUploadExpense(dbConnection, data);
    }
    catch (err) {
        console.error('Error connecting or executing queries in PostgreSQL database', err);
    }
    finally {
        if (dbConnection) {
            await dbConnection.end();
            console.log(`DB Connection(${connectId}) is terminated`);
        }
    }
}
async function bulkUploadExpense(dbConnection, data) {
    let query = `
      INSERT INTO ${DB_SCHEMA}.EXPENSE(sub_type_id, amount, description, createdBy, updatedBy) VALUES      
    `;
    let values = [];
    let count = 0;
    data.forEach((val, valInd) => {
        query += "($" + (++count) + ", $" + (++count) + ", $" + (++count) + ", 2, 2)" + ((valInd + 1 === data.length) ? ";" : ", ");
        values.push(val.subTypeId);
        values.push(val.amount ? val.amount: 0);
        values.push(val.description);
    }); 
    try {
        await dbConnection.query(query, values);
        console.log("bulkUploadExpense - query executed");
    }
    catch (err) {
        console.log("Error in executing", err);
        throw (err);
    }
}

module.exports = {
    bulkUploadExpenseWrapper
};