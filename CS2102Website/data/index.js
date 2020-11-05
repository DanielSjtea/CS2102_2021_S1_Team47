// use Pool to connect to database
// as we need to connect to database many times
const { Pool } = require('pg')

// credentials to be changed
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: 5432,
});

pool.db = function(sql, params) {
    pool.query(sql, params, (err, res) => {
        if (err) {
            console.log("SQL Error: " + err);
        }
    })
};

pool.db_get_promise = function(sql, params) {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (err, res) => {
            if (err) {
                console.log("SQL Error: " + err);
                return reject(err);
            } else {
                console.log(res.rows);
                resolve(res.rows);
            }
        })
    })
};

pool.db_get_promise_rows = function(sql, params) {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (err, res) => {
            if (err) {
                console.log("SQL Error: " + err);
                return reject(err);
            } else {
                resolve(res.rowCount);
            }
        })
    })
};

module.exports = pool;
