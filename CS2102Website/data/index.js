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
})

pool.db = function(sql, params) {
    pool.query(sql, params, (err, res) => {
        if (err) {
            console.log("SQL Error: " + err);
        }
    })
}

module.exports = pool;