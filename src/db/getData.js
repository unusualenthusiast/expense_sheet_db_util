const { DB_SCHEMA } = require("../config");
const { getDBConnection } = require("./createConnection");

async function getExpenseSubTypeData() {
    const connectId = Date.now();
    let dbConnection;
    try {
        dbConnection = getDBConnection();
        await dbConnection.connect();
        console.log(`DB Connection(${connectId}) is started`);
        const res = await dbConnection.query(`SELECT ID, NAME FROM ${DB_SCHEMA}.EXPENSE_SUB_TYPE;`);
        console.log("getExpenseSubTypeData - query executed");
        return res.rows;
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

module.exports = {
    getExpenseSubTypeData
}