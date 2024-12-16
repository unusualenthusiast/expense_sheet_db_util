const { DB_SCHEMA } = require("../config");
const { SYSTEM_DB_USER } = require("../constants");
const { getDBConnection } = require("./createConnection");

async function executeDDL() {
  const connectId = Date.now();
  let dbConnection;
  try {
    dbConnection = getDBConnection();
    await dbConnection.connect();
    console.log(`DB Connection(${connectId}) is started`);
    await rollbackUseWithCaution(dbConnection);
    await createSchema(dbConnection);
    await createUserTable(dbConnection);
    await createExpenseTypeTable(dbConnection);
    await createExpenseSubTypeTable(dbConnection);
    await createExpenseTable(dbConnection);

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
async function rollbackUseWithCaution(dbConnection) {
  const query = `
    DROP SCHEMA IF EXISTS ${DB_SCHEMA} CASCADE;
  `;
  try {
    await dbConnection.query(query);
    console.log("rollbackUseWithCaution - query executed");
  }
  catch (err) {
    console.log("Error in executing", err);
    throw (err);
  }
}
async function createSchema(dbConnection) {
  const query = `
    CREATE SCHEMA IF NOT EXISTS ${DB_SCHEMA};
  `;
  try {
    await dbConnection.query(query);
    console.log("createSchema - query executed");
  }
  catch (err) {
    console.log("Error in executing", err);
    throw (err);
  }
}
async function createUserTable(dbConnection) {
  const query = `
    CREATE TABLE ${DB_SCHEMA}.USER (
      id serial PRIMARY KEY,
      username VARCHAR(50),
      firstname VARCHAR(50),
      lastname VARCHAR(50),
      created_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await dbConnection.query(query);
    console.log("createUserTable - query executed");
  }
  catch (err) {
    console.log("Error in executing", err);
    throw (err);
  }
}
async function createExpenseTypeTable(dbConnection) {
  const query = `
    CREATE TABLE ${DB_SCHEMA}.EXPENSE_TYPE (
      id serial PRIMARY KEY,
      name VARCHAR(50),
      created_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by INT NOT NULL REFERENCES ${DB_SCHEMA}.USER(id),
      updated_by INT NOT NULL REFERENCES ${DB_SCHEMA}.USER(id)
    );
  `;
  try {
    await dbConnection.query(query);
    console.log("createExpenseTypeTable - query executed");
  }
  catch (err) {
    console.log("Error in executing", err);
    throw (err);
  }
}
async function createExpenseSubTypeTable(dbConnection) {
  const query = `
    CREATE TABLE ${DB_SCHEMA}.EXPENSE_SUB_TYPE (
      id serial PRIMARY KEY,
      name VARCHAR(50),
      type_id INT NOT NULL REFERENCES ${DB_SCHEMA}.EXPENSE_TYPE(id),
      created_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by INT NOT NULL REFERENCES ${DB_SCHEMA}.USER(id),
      updated_by INT NOT NULL REFERENCES ${DB_SCHEMA}.USER(id)
    );
  `;
  try {
    await dbConnection.query(query);
    console.log("createExpenseSubTypeTable - query executed");
  }
  catch (err) {
    console.log("Error in executing", err);
    throw (err);
  }
}
async function createExpenseTable(dbConnection) {
  const query = `
    CREATE TABLE ${DB_SCHEMA}.EXPENSE (
      id serial PRIMARY KEY,
      sub_type_id INT NOT NULL REFERENCES ${DB_SCHEMA}.EXPENSE_SUB_TYPE(id),
      amount DECIMAL(12,2),
      description VARCHAR(500),
      created_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by INT NOT NULL REFERENCES ${DB_SCHEMA}.USER(id),
      updated_by INT NOT NULL REFERENCES ${DB_SCHEMA}.USER(id)
    );
  `;
  try {
    await dbConnection.query(query);
    console.log("createExpenseTable - query executed");
  }
  catch (err) {
    console.log("Error in executing", err);
    throw (err);
  }
}
async function executeDML() {
  const connectId = Date.now();
  let dbConnection;
  try {
    dbConnection = getDBConnection();
    await dbConnection.connect();
    console.log(`DB Connection(${connectId}) is started`);
    await insertUserTable(dbConnection);
    await insertExpenseUserTable(dbConnection);
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
async function insertUserTable(dbConnection) {
  const query = `
      INSERT INTO ${DB_SCHEMA}.USER(username, firstname, lastname) VALUES 
      ($1, $2, $3);
    `;
  const values = [SYSTEM_DB_USER, SYSTEM_DB_USER, SYSTEM_DB_USER];
  try {
    await dbConnection.query(query, values);
    console.log("insertUserTable - query executed");
  }
  catch (err) {
    console.log("Error in executing", err);
    throw (err);
  }
}
async function insertExpenseUserTable(dbConnection) {
  let query = `
      INSERT INTO ${DB_SCHEMA}.EXPENSE_TYPE(name, createdBy, updatedBy) VALUES      
    `;
  let values = [];
  
  try {
    await dbConnection.query(query, values);
    console.log("insertUserTable - query executed");
  }
  catch (err) {
    console.log("Error in executing", err);
    throw (err);
  }
}


module.exports = {
  executeDDL,
  executeDML
}