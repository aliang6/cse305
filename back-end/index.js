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

// Return all items on the site
app.get('/items', async(req, res) => {
    let results = await Promise.all([database.getAllItems(), database.getItemTypes()]);
    let items = results[0]
    let item_types = results[1]
    for(let item of items) {
        item.category = item_types[item.category - 1].category;
    }
    res.json({ items: items });
});

// Return all items from the specified seller
app.get('/seller/:id', async(req, res) => {
    let sellerId = req.params.id;
    items = await database.getItemsFromSeller(sellerId);
    res.json({ items: items });
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
    let customerId = await database.addCustomer(first_name, last_name, email, phone); // -1 if err
    let response = { id: customerId, first_name: first_name, last_name: last_name };
    res.json(response);
});

// Add seller to the database if they don't exist
app.post('/sellersignup', async(req, res) => {
    let name = req.body.name;
    let desc = req.body.desc;
    let sellerId = await database.addSeller(name, desc); // -1 if err
    let response = { id: sellerId, seller_name: name };
    res.json(response);
});


let server = app.listen(PORT, '127.0.0.1', () => console.log(`Server running on http://127.0.0.1:${PORT}`));