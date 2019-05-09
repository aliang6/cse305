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


// Create
async function addCustomer(first_name, last_name, email, phone, pwd) {
    let query = `SELECT id, first_name, last_name
                FROM customer 
                WHERE email=?`;
    let [rows, fields] = await conn.execute(query, [email]);
    if (rows[0]) { // Customer exists
        return -1;
    }
    
    query = 'INSERT INTO customer (id, first_name, last_name, email, phone, pwd) VALUES (?,?,?,?,?,?)';
    [rows, fields] = await conn.execute(query, [0, first_name, last_name, email, phone, pwd]);
    return rows.insertId;
}

async function addSeller(name, desc, pwd) {
    let query = `SELECT id 
                FROM seller 
                WHERE seller_name=?`;
    let [rows, fields] = await conn.execute(query, [name]);
    if (rows[0]) { // Seller exists
        return -1;
    }
    
    query = 'INSERT INTO seller (id, seller_name, seller_description, pwd) VALUES (?,?,?,?)';
    [rows, fields] = await conn.execute(query, [0, name, desc, pwd]);
    return rows.insertId;
}

async function addItem(seller_id, name, desc, price, stock, type) { // Adds if doesn't exist, otherwise updates existing item
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

async function addToCart(customer_id, item_id, quantity) {
    let query = 'SELECT * FROM shoppingcart WHERE customer_id=? AND item_id=?';
    let [row, fields] = await conn.execute(query, [customer_id, item_id]);
    if(row[0]) { // Row exists
        let updateCartQuery = `UPDATE shoppingcart
                                SET quantity=?
                                WHERE customer_id=? AND item_id=?`;
        await conn.execute(updateCartQuery, [quantity, customer_id, item_id]);
        return;
    }
    let addCartQuery = 'INSERT INTO shoppingcart (customer_id, item_id, quantity) VALUES (?,?,?)';
    await conn.execute(addCartQuery, [customer_id, item_id, quantity]);
    return;
}

async function addAddress(customer_id, address_type, address1, address2, apt, city, zip) {
    let insertQuery = 'INSERT INTO address (customer_id, id, address_type, address1, address2, apt, city, zip) VALUES (?,?,?,?,?,?,?,?)';
    await conn.execute(insertQuery, [customer_id, 0, address_type, address1, address2, apt, city, zip]);
    return;
}


// Retrieve 
async function getTables() {
    let results = await conn.execute('SHOW TABLES')[0];
    return results;
}

async function getAllItems() {
    let query = `SELECT item.id, item.item_name, item.item_description, item.category, sells.price, sells.stock
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
    let query = `SELECT item.id, item.item_name, item.item_description, item.category, sells.price, sells.stock
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

async function getCustomer(email, pwd) {
    let query = `SELECT id, first_name, last_name
                FROM customer 
                WHERE email=? AND pwd=?`;
    let [rows, fields] = await conn.execute(query, [email, pwd]);
    return rows;
}

async function getSeller(name, pwd) {
    let query = `SELECT id 
                FROM seller 
                WHERE seller_name=? AND pwd=?`;
    let [rows, fields] = await conn.execute(query, [name, pwd]);
    return rows;
}

async function getCart(customer_id) {
    let query = `SELECT id, quantity, item_name, item_description, category, price
                FROM shoppingcart 
                JOIN item ON shoppingcart.item_id = item.id 
                JOIN sells ON shoppingcart.item_id = sells.item_id 
                WHERE customer_id=?`;
    let [rows, fields] = await conn.execute(query, [customer_id]);
    return rows; 
}

async function getCustomerPurchases(customer_id) {
    let query = `SELECT purchase.purchase_id, purchase.purchase_date, purchase.card_number, purchase.quantity, 
                    address.address1, address.address2, seller.seller_name, item.item_name, sells.price
                FROM purchase 
                JOIN item ON purchase.item_id = item.id 
                JOIN sells ON sells.item_id = item.id 
                JOIN seller ON sells.seller_id = seller.id
                JOIN address ON 
                    purchase.customer_id = address.customer_id AND 
                    purchase.address_id = address.id
                WHERE purchase.customer_id=?`;
    let [rows, fields] = await conn.execute(query, [customer_id]);
    return rows;
}

async function getCustomerShipments(customer_id) {
    let query = `SELECT shippedto.shipment_id, shippedto.tracking_number, shippedto.process_date, shippedto.arrival_date, 
                    shippedto.shipping_fee, item.item_name, carrier.carrier_name, address.address1, address.address2 
                FROM shippedto
                JOIN item ON shippedto.item_id = item.id 
                JOIN carrier ON shippedto.carrier_id = carrier.id
                JOIN address ON 
                    shippedto.customer_id = address.customer_id AND 
                    shippedto.address_id = address.id
                WHERE shippedto.customer_id=?`;
    let [rows, fields] = await conn.execute(query, [customer_id]);
    return rows;
}

async function getAddresses(customer_id) {
    let query = `SELECT * FROM address WHERE customer_id=? AND address_type=0`;
    let [rows, fields] = await conn.execute(query, [customer_id]);
    return rows;
}

async function searchItems(search_query) {
    let query = `SELECT item.id, item.item_name, item.item_description, item_type.category, sells.price, sells.stock
                FROM item 
                RIGHT JOIN sells ON item.id = sells.item_id
                JOIN item_type ON item.category = item_type.id
                WHERE item_name OR item_description LIKE ?`;
    let [rows, fields] = await conn.execute(query, ['%' + search_query + '%']);
    return rows;
}

async function getCarriers(customer_id) {
    let query = `SELECT * FROM carrier`;
    let [rows, fields] = await conn.execute(query);
    return rows;
}

// Update
async function updateSellerItem(seller_id, item_id, name, desc, price, stock, type) { // Update item's price and stock if exists
    let query = `SELECT *
                FROM sells
                WHERE seller_id=? AND item_id=?`;
    let [rows, fields] = await conn.execute(query, [seller_id, item_id]);
    if(!rows[0]){
        return false;
    }

    let updateItemQuery = `UPDATE item
                            SET item_name=?, item_description=?, category=?
                            WHERE id=?`;
    let updateSellQuery = `UPDATE sells
                            SET price=?, stock=?
                            WHERE seller_id=? AND item_id=?`;

    await Promise.all([
        conn.execute(updateItemQuery, [name, desc, type, item_id]), 
        conn.execute(updateSellQuery, [price, stock, seller_id, item_id]),
    ]);
    return true;
}

async function purchase(customer_id, address_id, carrier_id, card_number, card_expiry_date) {    
    let query = `SELECT *
                FROM shoppingcart 
                JOIN sells ON 
                    shoppingcart.item_id = sells.item_id
                WHERE customer_id=?`;
    [rows, fields] = await conn.execute(query, [customer_id]);
    let promises = []

    

    // Create purchase date string
    const date = new Date();
    const purchase_date = date.getFullYear() + "-" + String(date.getMonth()).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0');

    for(let row of rows) {
        let updateQuery = `UPDATE sells
                            SET stock=?
                            WHERE item_id=? AND seller_id=?`;
        promises.push(conn.execute(updateQuery, [row.stock - row.quantity, row.item_id, row.seller_id]));
        let addPurchaseQuery = `INSERT INTO purchase
                                (purchase_id, customer_id, item_id, quantity, total_cost, seller_id, 
                                    purchase_date, address_id, card_number, card_expiry_date)
                                VALUES (?,?,?,?,?,?,?,?,?,?)`;
        [rows, fields] = await conn.execute(addPurchaseQuery, 
                                        [0, customer_id, row.item_id, row.quantity, row.quantity*row.price, 
                                            row.seller_id, purchase_date, address_id, card_number, card_expiry_date]
        )
        let addShippedtoQuery = `INSERT INTO shippedto
                                    (shipment_id, item_id, customer_id, purchase_id, address_id, carrier_id, 
                                        tracking_number, process_date, arrival_date, shipping_fee)
                                    VALUES (?,?,?,?,?,?,?,?,?,?)`;

        let tracking_num = Math.floor(1000 + Math.random() * 9000);
        promises.push(
            conn.execute(addShippedtoQuery, 
                [0, row.item_id, customer_id, rows.insertId, address_id, carrier_id,
                    tracking_num, purchase_date, purchase_date, '0.00']
            )
        );
        
    }
    await Promise.all(promises);
    let deleteQuery = 'DELETE FROM shoppingcart WHERE customer_id=?';
    await conn.execute(deleteQuery, [customer_id]);
    return;
}

// Delete
async function removeSellerItem(seller_id,item_id) { 
    let removeQuery = `DELETE FROM sells
                        WHERE seller_id=? AND item_id=?`;
    let [row, fields] = await conn.execute(removeQuery, [seller_id, item_id]);
    if (row.affectedRows == 0){
        return;
    }

    removeQuery = `DELETE FROM item
                    WHERE id=?`;
    await conn.execute(removeQuery, [item_id]);

    return;
}

async function removeCartItem(customer_id, item_id) {
    let query = 'DELETE FROM shoppingcart WHERE customer_id=? AND item_id=?';
    await conn.execute(query, [customer_id, item_id]);
    return;
}

module.exports = {
    // Create
    addToCart: addToCart,
    addCustomer: addCustomer,
    addSeller: addSeller,
    addItem: addItem, 
    addAddress: addAddress,

    // Retrieve
    getTables: getTables,
    getAllItems: getAllItems,
    getItemTypes: getItemTypes, 
    getAllSellers: getAllSellers,
    getItemsFromSeller: getItemsFromSeller,
    getCustomer: getCustomer,
    getSeller: getSeller,
    getCart: getCart,
    getCustomerPurchases: getCustomerPurchases,
    getCustomerShipments: getCustomerShipments,
    getAddresses: getAddresses,
    getCarriers: getCarriers,
    searchItems: searchItems,

    // Update
    updateSellerItem: updateSellerItem,
    purchase: purchase,

    // Delete
    removeSellerItem: removeSellerItem,
    removeCartItem: removeCartItem,
    
}