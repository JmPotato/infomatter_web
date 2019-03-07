var request = require('request');
var express = require('express');
var app = express();

var config = require('../config.js');
var api_url = config.api_url;

app.get('/', function(req, res) {
    if (req.cookies.user) {
        request.get({url: api_url + '/users/timeline', headers: {'user_id': JSON.parse(req.cookies.user).id}}, function(error, response, body) {
            if (body === '[]') {
                res.redirect('/user/subscriptions');
                return;
            }
            var entries = JSON.parse(body);
            res.render('timeline', {page_title: "首页", entries});
        });
    } else {
        res.redirect('/user/signin');
    }
});

module.exports = app;