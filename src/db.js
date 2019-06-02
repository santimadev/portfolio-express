const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dateStrings: true,
    charset: 'UTF8_GENERAL_CI'
})

pool.getConnection((err, connection) => {
    if (err) {
        switch (err.code) {
            case 'PROTOCOL_CONNECTION_LOST':
            console.error('Database connection was closed.');
            break;
            case 'ER_CON_COUNT_ERROR':
            console.error('Database has too many connections');
            break;
            case 'ECONNREFUSED':
            console.error('Database connection refused');
            break;
        }
    }

    if (connection) connection.release();

    return
})

// Async / Await
pool.query = util.promisify(pool.query);

module.exports = pool;