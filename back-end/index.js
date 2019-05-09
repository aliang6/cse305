/* external imports */
const express = require('express');
const session = require('express-session');
//const RedisStore = require('connect-redis')(session);

/* internal imports */
const database = require('./database');
const constants = require('./constants');

/* initialize express application */
const app = express();
require('express-async-errors');

/* the port the server will listen on */
const PORT = 8000;

/* redis */
/*const sessionOptions = {
    name: 'soc_login',
    secret: 'KYNxwY2ZeUXo8LKbsbZsMpccLbRewpBr',
    unset: 'destroy',
    resave: false,
    saveUninitialized: true,
    logErrors: true,
    store: new RedisStore(constants.REDIS_OPTIONS)
};
app.use(session(sessionOptions));*/

/* parse incoming requests data as json */
app.use(express.json());

/* enable CORS */
app.use(function(req, res, next) {
    res.set('Access-Control-Allow-Origin', constants.CORS.origin);
    res.set('Access-Control-Allow-Headers', constants.CORS.headers);
    res.set('Access-Control-Allow-Methods', constants.CORS.methods);
    res.set('Access-Control-Allow-Credentials', constants.CORS.credentials); 
    next();
});

app.get('/test', async(req, res) => {
    let results = await database.getTables();
    console.log(results);
    res.json();
});

// Return all items
app.get('/items', async(req, res) => {
    let results = await Promise.all([database.getAllItems(), database.getItemTypes()]);
    let items = results[0];
    let item_types = results[1];
    for(let item of items) {
        item.category = item_types[item.category - 1].category;
    }
    res.json({ items: items });
});

// Return all item types
app.get('/itemtypes', async(req, res) => {
    let item_types = await database.getItemTypes();
    types = [];
    for(let item_type of item_types) {
        types.push(item_type.category);
    }
    res.json({ item_types: types });
});

// Return all items from the specified seller
app.get('/seller/:id', async(req, res) => {
    let seller_id = req.params.id;
    let results = await Promise.all([database.getItemsFromSeller(seller_id), database.getItemTypes()]);
    let items = results[0];
    let item_types = results[1];
    for(let item of items) {
        item.category = item_types[item.category - 1].category;
    }
    res.json({ items: items });
});

// Add a seller listing to the database
app.post('/addlisting', async(req, res) => {
    let seller_id = req.body.seller_id;
    let item_name = req.body.item_name;
    let item_desc =  req.body.item_desc;
    let item_price = req.body.item_price;
    let item_stock = req.body.item_stock;
    let item_type =  req.body.item_type;

    let item_types = await database.getItemTypes();
    for(let row of item_types) {
        if(item_type === row.category) {
            item_type = row.id;
            break;
        }
    }

    let response = await database.addItem(seller_id, item_name, item_desc, item_price, item_stock, item_type);

    res.json({ success: response });
});

// Update a seller's listing in the database if it exists
app.post('/updatelisting', async(req, res) => {
    let seller_id = req.body.seller_id;
    let item_id = req.body.item_id;
    let item_name = req.body.item_name;
    let item_desc =  req.body.item_desc;
    let item_price = req.body.item_price;
    let item_stock = req.body.item_stock;
    let item_type =  req.body.item_type;

    let item_types = await database.getItemTypes();
    for(let row of item_types) {
        if(item_type === row.category) {
            item_type = row.id;
            break;
        }
    }

    let response = await database.updateSellerItem(seller_id, item_id, item_name, item_desc, item_price, item_stock, item_type);

    res.json({ success: response });
});

// Remove a seller's listing on the database if it exists
app.post('/removelisting', async(req, res) => {
    let seller_id = req.body.seller_id;
    let item_id = req.body.item_id;

    let response = await database.removeSellerItem(seller_id, item_id);

    res.json({ success: response });
});

// Return all sellers on the site
app.get('/sellers', async(req, res) => {
    let sellers = await database.getAllSellers();
    res.json({ sellers: sellers });
});

// Return id and name for customer login
app.post('/customerlogin', async(req, res) => {
    let email = (req.body.email).toLowerCase();
    let results = await database.getCustomer(email);
    let response;
    if(results[0]){
        let customer = results[0];
        response = { id: customer.id, first_name: customer.first_name, last_name: customer.last_name };
    } else {
        response = { id: -1 }
    }
    res.json(response);
});

// Return id and name for seller login
app.post('/sellerlogin', async(req, res) => {
    let name = req.body.seller_name;
    let results = await database.getSeller(name);
    let response;
    if(results[0]){
        let seller = results[0];
        response = { id: seller.id, seller_name: name };
    } else {
        response = { id: -1 }
    }
    res.json(response);
});

// Add customer to the database if they don't exist
app.post('/customersignup', async(req, res) => {
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = (req.body.email).toLowerCase();
    let phone = req.body.phone;
    let customer_id = await database.addCustomer(first_name, last_name, email, phone); // -1 if err
    let response = { id: customer_id, first_name: first_name, last_name: last_name };
    res.json(response);
});

// Add seller to the database if they don't exist
app.post('/sellersignup', async(req, res) => {
    let name = req.body.name;
    let desc = req.body.desc;
    let seller_id = await database.addSeller(name, desc); // -1 if err
    let response = { id: seller_id, seller_name: name };
    res.json(response);
});

// Add an item to a customer's cart
app.post('/addtocart', async(req, res) => {
    let customer_id = req.body.customer_id;
    let item_id = req.body.item_id;
    let quantity = req.body.quantity;
    await database.addToCart(customer_id, item_id, quantity);
    res.json({});
});

// Returns items from a customer's cart
app.post('/getcart', async(req, res) => {
    let customer_id = req.body.customer_id;
    let results = await Promise.all([database.getCart(customer_id), database.getItemTypes()]);
    let items = results[0];
    let item_types = results[1];
    for(let item of items) {
        item.category = item_types[item.category - 1].category;
    }

    res.json({ items: items });
});

// Remove specified item from a customer's cart
app.post('/removecartitem', async(req, res) => {
    let customer_id = req.body.customer_id;
    let item_id = req.body.item_id;
    await database.removeCartItem(customer_id, item_id);
    res.json({});
});

app.post('/purchase', async(req, res) => {
    let customer_id = req.body.customer_id;
    let address_id = req.body.address_id;
    let card_number = req.body.card_number;
    let card_expiry_date = req.body.card_expiry_date;
    await database.purchase(customer_id, address_id, card_number, card_expiry_date);
    res.json({});
});

app.post('/getpurchases', async(req, res) => {
    let customer_id = req.body.customer_id;
    let results = await database.getCustomerPurchases(customer_id);
    res.json({ purchases: results })
});

app.post('/addaddress', async(req, res) => {
    console.log(req.body);
    let customer_id = req.body.customer_id;
    let address_type = req.body.address_type;
    let address1 = req.body.address1;
    let address2 = req.body.address2 ? req.body.address2 : NULL;
    let apt = req.body.apt ? req.body.apt : NULL;
    let city = req.body.city;
    let zip = req.body.zip;
    await database.addAddress(customer_id, address_type, address1, address2, apt, city, zip);
    return res.json({});
});

app.post('/getaddresses', async(req, res) => {
    let customer_id = req.body.customer_id;
    let results = await database.getAddresses(customer_id);
    res.json({ addresses: results });
});

app.post('/search', async(req, res) => {
   let query = req.body.q;
   let results = await database.searchItems(query);
   console.log(results);
   res.json({ items: results });
});

let server = app.listen(PORT, '127.0.0.1', () => console.log(`Server running on http://127.0.0.1:${PORT}`));