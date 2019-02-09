var express = require("express");
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var port = 3000;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

let routesV1_0 = require('./api');

require('./mongoose');//initializing mongoose

app.use('/users', routesV1_0);

app.listen(port);

console.log("Server listening on port " + port);
module.exports = app;