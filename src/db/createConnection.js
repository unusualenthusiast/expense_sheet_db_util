const { Client } = require('pg');
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = require('../config');

function getDBConnection() {
    console.log("New Connection Requested");
    return new Client({
        host: DB_HOST,
        port: DB_PORT,
        database: DB_NAME,
        user: DB_USER,
        password: DB_PASSWORD
    });
}

module.exports = {
    getDBConnection
};