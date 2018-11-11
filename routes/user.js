var request = require('request');
var express = require('express');

var app = express();

var config = require('../config.js');
var api_url = config.api_url;

app.get('/signup', function(req, res) {
    res.render('signup');
});

app.post('/signup', function(req, res) {
    if (req.body.password_1 !== req.body.password_2) {
        res.redirect('/user/signup')
    } else {
        var form = {
            name: req.body.name,
            password: req.body.password_1,
        };
        request.post({url: api_url + '/users/add', form: form}, function (error, response, body) {
            if (body !== 'FAILURE') {
                res.cookie('user', body, {maxAge:2678400000, path:'/', httpOnly:true})
            }
            res.redirect('/');
        });
    }
});

app.get('/signin', function(req, res) {
    res.render('signin');
});

app.post('/signin', function(req, res) {
    var form = {
        name: req.body.name,
        password: req.body.password,
    };
    request.post({url: api_url + '/users/check', form: form}, function (error, response, body) {
        if (body !== 'NOTFOUND') {
            res.cookie('user', body, {maxAge:2678400000, path:'/', httpOnly:true})
        }
        res.redirect('/');
    });
});

app.get('/signout', function(req, res) {
    res.clearCookie('user');
    res.redirect('/user/signin');
});

app.get('/subscriptions', function(req, res) {
    request.get(api_url + '/sources', function(error, response, body) {
        var all_sources = JSON.parse(body);
        request.get({url: api_url + '/users/following', headers: {'user_id': JSON.parse(req.cookies.user).id}}, function(error, response, body) {
            var user_sources = JSON.parse(body);
            all_sources.forEach(all => {
                user_sources.forEach(user => {
                    if(all.id === user.id) {
                        all.following = 1;
                    } else {
                        all.following = 0;
                    }
                });
            });
            res.render('subscriptions', {all_sources});
        });
    });
});

module.exports = app;