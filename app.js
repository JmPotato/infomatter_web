var config = require('./config.js');

var server_url = config.server_url;
var server_port = config.server_port;

var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();
app.use(cookieParser());
app.use('/static', express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set("view engine", "html");
app.engine('html', require('ejs').renderFile);

var home = require('./routes/home.js');

app.use('/', home.index);

var server = app.listen(server_port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Successfully booted on http://%s:%s", host, port);
    console.log("URL: " + server_url);
});