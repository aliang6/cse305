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
    res.set('Access-Control-Allow-Origin', constants.CORS.hostname);
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

let server = app.listen(PORT, '127.0.0.1', () => console.log(`Server running on http://127.0.0.1:${PORT}`));