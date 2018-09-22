var config = require('./config.js');

var server_url = config.server_url;
var server_port = config.server_port;

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ type: 'application/x-www-form-urlencoded', extended: false }));
app.use('/static', express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set("view engine", "html");
app.engine('html', require('ejs').renderFile);

var home = require('./routes/home.js');
var user = require('./routes/user.js');

app.use('/', home);
app.use('/user', user);

var server = app.listen(server_port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Successfully booted on http://%s:%s", host, port);
    console.log("URL: " + server_url);
});