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

async function getCart(customer_id) {
    let query =
    `SELECT id, quantity, item_name, item_description, category, price
    FROM shoppingcart 
    JOIN item ON shoppingcart.item_id = item.id 
    JOIN sells on shoppingcart.item_id = sells.item_id 
    WHERE customer_id=?`;
    let [rows, fields] = await conn.execute(query, [customer_id]);
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
    /*let query = 
    `SELECT id
    FROM item
    WHERE item_name=?`;
    let [rows, fields] = await conn.execute(query, [name]);
    if(rows[0]) { // Item exists
        return false;
    } */

    let query = 'SELECT MAX(id) FROM item';
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
    return true;
}

async function updateSellerItem(seller_id, item_id, name, desc, price, stock, type) { // Update item's price and stock if exists
    let query = 
    `SELECT *
    FROM sells
    WHERE seller_id=? AND item_id=?`;
    let [rows, fields] = await conn.execute(query, [seller_id, item_id]);
    if(!rows[0]){
        return false;
    }

    let updateItemQuery = 
    `UPDATE item
    SET item_name=?, item_description=?, category=?
    WHERE id=?`;

    let updateSellQuery = 
    `UPDATE sells
    SET price=?, stock=?
    WHERE seller_id=? AND item_id=?`;

    await Promise.all([
        conn.execute(updateItemQuery, [name, desc, type, item_id]), 
        conn.execute(updateSellQuery, [price, stock, seller_id, item_id]),
    ]);
    return true;
}

async function removeSellerItem(seller_id, item_id) { 
    let removeQuery =
    `DELETE FROM sells
    where seller_id=? AND item_id=?`;

    await conn.execute(removeQuery, [seller_id, item_id]);
    return;
}

async function addToCart(customer_id, item_id, quantity) {
    let query = 'SELECT * FROM shoppingcart WHERE customer_id=? AND item_id=?';
    let [row, fields] = await conn.execute(query, [customer_id, item_id]);
    if(row[0]) { // Row exists
        let updateCartQuery = 
        `UPDATE shoppingcart
        SET quantity=?
        WHERE customer_id=? AND item_id=?`;
        await conn.execute(updateCartQuery, [quantity, customer_id, item_id]);
        return;
    }
    let addCartQuery = 'INSERT INTO shoppingcart (customer_id, item_id, quantity) VALUES (?,?,?)';
    await conn.execute(addCartQuery, [customer_id, item_id, quantity]);
    return;
}

async function removeCartItem(customer_id, item_id) {
    let query = 'DELETE FROM shoppingcart WHERE customer_id=? AND item_id=?';
    await conn.execute(query, [customer_id, item_id]);
    return;
}

async function purchase(customer_id) {
    let query = 
    `SELECT sells.seller_id, sells.item_id, sells.stock, shoppingcart.quantity
    FROM shoppingcart 
    JOIN sells ON shoppingcart.item_id = sells.item_id
    WHERE customer_id=?`;
    let [rows, fields] = await conn.execute(query, [customer_id]);
    let promises = []
    for(let row of rows) {
        let updateQuery = 
        `UPDATE sells
        SET stock=?
        WHERE item_id=? AND seller_id=?`;
        promises.push(conn.execute(updateQuery, [row.stock - row.quantity, row.item_id, row.seller_id]));
    }
    await Promise.all(promises);
    let deleteQuery = 'DELETE FROM shoppingcart WHERE customer_id=?';
    await conn.execute(deleteQuery, [customer_id]);
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
    getCart: getCart,
    addCustomer: addCustomer,
    addSeller: addSeller,
    addItem: addItem,
    updateSellerItem: updateSellerItem,
    removeSellerItem: removeSellerItem,
    addToCart: addToCart,
    removeCartItem: removeCartItem,
    purchase: purchase,
}