/* external imports */
const mysql = require('mysql2/promise');

var conn;

(async () => {
    conn = await mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'cse305project',
        database : 'ecommerce'
    });
    console.log("Successfully connected to ecommerce database")
})().catch(e => {
    console.log("Failed to connect to database")
});

async function getTables() {
    let results = await conn.execute('SHOW TABLES');
    return results;
}

module.exports = {
    getTables: getTables,
}