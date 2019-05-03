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
    let results = await conn.execute('SHOW TABLES')[0];
    return results;
}

async function getAllItems() {
    let query = 
    `SELECT item.id, item.item_name, item.item_description, item.category, sells.price, sells.stock
    FROM item 
    RIGHT JOIN sells ON item.id = sells.item_id;`;
    let [rows, fields] = await conn.execute(query);
    return rows;
}

async function getItemTypes() {
    let query = 'SELECT * FROM item_type';
    let [rows, fields] = await conn.execute(query);
    return rows;
}

async function getItemsFromSeller(sellerId) {
    let query = 
    `SELECT item.id, item.item_name, item.item_description, item.category, sells.price, sells.stock
    FROM item
    RIGHT JOIN sells ON item.id = sells.item_id
    WHERE sells.seller_id = ?`;
    let [rows, fields] = await conn.execute(query, [sellerId]);
    return rows;
}

async function getAllSellers() {
    let [rows, fields] = await conn.execute('SELECT * FROM `seller`');
    return rows;
}

async function getCustomer(email) {
    let query = 
    `SELECT id, first_name, last_name
    FROM customer 
    WHERE email=?`;
    let [rows, fields] = await conn.execute(query, [email]);
    return rows;
}

async function getSeller(name) {
    let query = 
    `SELECT id 
    FROM seller 
    WHERE seller_name=?`;
    let [rows, fields] = await conn.execute(query, [name]);
    return rows;
}

async function addCustomer(first_name, last_name, email, phone) {
    let results = await getCustomer(email);
    if(results[0]) { // Customer exists
        return -1;
    }

    let query = 'SELECT MAX(id) FROM customer';
    let [rows, fields] = await conn.execute(query);
    let id;
    if(rows[0]) {
        id = rows[0]['MAX(id)'] + 1;
    } else {
        id = 1;
    }
    
    query = 'INSERT INTO customer (id, first_name, last_name, email, phone) VALUES (?,?,?,?,?)';
    [rows, fields] = await conn.execute(query, [id, first_name, last_name, email, phone]);
    return id;
}

async function addSeller(name, desc) {
    let results = await getSeller(name);
    if(results[0]) { // Seller exists
        return -1;
    }

    let query = 'SELECT MAX(id) FROM seller';
    let [rows, fields] = await conn.execute(query);
    let id;
    if(rows[0]) {
        id = rows[0]['MAX(id)'] + 1;
    } else {
        id = 1;
    }
    
    query = 'INSERT INTO seller (id, seller_name, seller_description) VALUES (?,?,?)';
    [rows, fields] = await conn.execute(query, [id, name, desc]);
    return id;
}

async function addItem(seller_id, name, desc, price, stock, type) { // Adds if doesn't exist, otherwise updates existing item
    let query = 
    `SELECT id
    FROM item
    WHERE item_name=?`;
    let [rows, fields] = await conn.execute(query, [name]);
    if(rows[0]) { // Item exists
        let id = rows[0].id;
        console.log(id);
        let updateItemQuery = 
        `UPDATE item
        SET item_description=?, category=?
        WHERE id=?`;
        let updateSellQuery = 
        `UPDATE sells
        SET price=?, stock=?
        WHERE seller_id=? AND item_id=?`;
        await Promise.all([
            conn.execute(updateItemQuery, [desc, type, id]), 
            conn.execute(updateSellQuery, [price, stock, seller_id, id]),
        ]);
        return;
    } 

    query = 'SELECT MAX(id) FROM item';
    [rows, fields] = await conn.execute(query);
    let id;
    if(rows[0]) {
        id = rows[0]['MAX(id)'] + 1;
    } else {
        id = 1;
    }

    let addItemQuery = 'INSERT INTO item (id, item_name, item_description, category) VALUES (?,?,?,?)';
    let addSellQuery = 'INSERT INTO sells (seller_id, item_id, price, stock) VALUES (?,?,?,?)';
    await Promise.all([
        conn.execute(addItemQuery, [id, name, desc, type]), 
        conn.execute(addSellQuery, [seller_id, id, price, stock]),
    ]);
    return;
}

module.exports = {
    getTables: getTables,
    getAllItems: getAllItems,
    getItemTypes: getItemTypes, 
    getAllSellers: getAllSellers,
    getItemsFromSeller: getItemsFromSeller,
    getCustomer: getCustomer,
    getSeller: getSeller,
    addCustomer: addCustomer,
    addSeller: addSeller,
    addItem: addItem,
}