const { DB_SCHEMA } = require("../config");
const { SYSTEM_DB_USER, EXPENSE_TYPE, EXPENSE_SUB_TYPE, FIRST_DB_USER } = require("../constants");
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
    await createExpenseTagTable(dbConnection);
    await createExpenseTable(dbConnection);
    await createExpenseTagJunctionTable(dbConnection);
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
      username VARCHAR(50) NOT NULL,
      firstname VARCHAR(50),
      lastname VARCHAR(50),
      email text UNIQUE,
      activeFlag CHAR(1) NOT NULL DEFAULT 'Y',
      createdTs TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedTs TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
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
      name VARCHAR(50) UNIQUE NOT NULL,
      activeFlag CHAR(1) NOT NULL DEFAULT 'Y',
      createdTs TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedTs TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      createdBy INT NOT NULL REFERENCES ${DB_SCHEMA}.USER(id),
      updatedBy INT NOT NULL REFERENCES ${DB_SCHEMA}.USER(id)
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
      name VARCHAR(50) UNIQUE NOT NULL,
      typeId INT NOT NULL REFERENCES ${DB_SCHEMA}.EXPENSE_TYPE(id),
      activeFlag CHAR(1) NOT NULL DEFAULT 'Y',
      createdTs TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedTs TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      createdBy INT NOT NULL REFERENCES ${DB_SCHEMA}.USER(id),
      updatedBy INT NOT NULL REFERENCES ${DB_SCHEMA}.USER(id)
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
async function createExpenseTagTable(dbConnection) {
  const query = `
    CREATE TABLE ${DB_SCHEMA}.EXPENSE_TAG (
      id serial PRIMARY KEY,
      name VARCHAR(50) UNIQUE NOT NULL,
      activeFlag CHAR(1) NOT NULL DEFAULT 'Y',
      createdTs TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,      
      updatedTs TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      createdBy INT NOT NULL REFERENCES ${DB_SCHEMA}.USER(id),
      updatedBy INT NOT NULL REFERENCES ${DB_SCHEMA}.USER(id)
    );
  `;
  try {
    await dbConnection.query(query);
    console.log("createExpenseTagTable - query executed");
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
      subTypeId INT NOT NULL REFERENCES ${DB_SCHEMA}.EXPENSE_SUB_TYPE(id),
      amount DECIMAL(12,2),
      description VARCHAR(500),
      activeFlag CHAR(1) NOT NULL DEFAULT 'Y',
      archiveFlag CHAR(1) NOT NULL DEFAULT 'N',
      createdTs TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedTs TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      createdBy INT NOT NULL REFERENCES ${DB_SCHEMA}.USER(id),
      updatedBy INT NOT NULL REFERENCES ${DB_SCHEMA}.USER(id)
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
async function createExpenseTagJunctionTable(dbConnection) {
  const query = `
  CREATE TABLE ${DB_SCHEMA}.EXPENSE_TAG_JUNCTION (
    id serial PRIMARY KEY,
    tagId INT NOT NULL REFERENCES ${DB_SCHEMA}.EXPENSE_TAG(id),
    expenseId INT NOT NULL REFERENCES ${DB_SCHEMA}.EXPENSE(id),
    activeFlag CHAR(1) NOT NULL DEFAULT 'Y',
    createdTs TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedTs TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    createdBy INT NOT NULL REFERENCES ${DB_SCHEMA}.USER(id),
    updatedBy INT NOT NULL REFERENCES ${DB_SCHEMA}.USER(id)
  );
`;
try {
  await dbConnection.query(query);
  console.log("createExpenseTagJunctionTable - query executed");
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
    await insertExpenseTypeTable(dbConnection);
    await insertExpenseSubTypeTable(dbConnection);
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
      INSERT INTO ${DB_SCHEMA}.USER(username, firstname, lastname, email) VALUES 
      ($1, $2, $3, $4), ($5, $6, $7, $8);
    `;
  const values = [SYSTEM_DB_USER, SYSTEM_DB_USER, SYSTEM_DB_USER, null, FIRST_DB_USER.username, FIRST_DB_USER.firstname, FIRST_DB_USER.lastname, null];
  try {
    await dbConnection.query(query, values);
    console.log("insertUserTable - query executed");
  }
  catch (err) {
    console.log("Error in executing", err);
    throw (err);
  }
}
async function insertExpenseTypeTable(dbConnection) {
  let query = `
      INSERT INTO ${DB_SCHEMA}.EXPENSE_TYPE(name, createdBy, updatedBy) VALUES
    `;
  let values = [];
  const keys = Object.keys(EXPENSE_TYPE);
  keys.forEach((key, keyInd) => {
    query += "($" + (keyInd+1) + ", 1, 1)" + ((keyInd + 1 === keys.length) ? ";": ", ");
    values.push(EXPENSE_TYPE[key]); 
  })
  try {
    await dbConnection.query(query, values);
    console.log("insertExpenseTypeTable - query executed");
  }
  catch (err) {
    console.log("Error in executing", err);
    throw (err);
  }
}
async function insertExpenseSubTypeTable(dbConnection) {
  let query = `
      INSERT INTO ${DB_SCHEMA}.EXPENSE_SUB_TYPE(name, typeId, createdBy, updatedBy) VALUES
    `;
  let values = [];
  const keys = Object.keys(EXPENSE_SUB_TYPE);
  let count = 0;
  keys.forEach((key, keyInd) => {
    EXPENSE_SUB_TYPE[key].forEach((val, valInd) => {
      query += "($" + (++count) + ", $" + (++count) + ", 1, 1)" + ((valInd + 1 === EXPENSE_SUB_TYPE[key].length && keyInd + 1 === keys.length) ? ";": ", ");
      values.push(val); 
      values.push(keyInd+1);
    });    
  });
  try {
    await dbConnection.query(query, values);
    console.log("insertExpenseSubTypeTable - query executed");
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