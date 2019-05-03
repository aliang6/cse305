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
    let items = results[0]
    let item_types = results[1]
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
    items = results[0];
    item_types = results[1];
    for(let item of items) {
        item.category = item_types[item.category - 1].category;
    }
    res.json({ items: items });
});

// Add an item to the database
app.post('/additem', async(req, res) => {
    console.log(req.body);
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

    await database.addItem(seller_id, item_name, item_desc, item_price, item_stock, item_type); // If exists, otherwise updates existing

    res.json({});
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


let server = app.listen(PORT, '127.0.0.1', () => console.log(`Server running on http://127.0.0.1:${PORT}`));