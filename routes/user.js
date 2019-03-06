var request = require('request');
var express = require('express');
var crypto = require('crypto');

var app = express();

var config = require('../config.js');
var api_url = config.api_url;

app.get('/signup', function(req, res) {
    res.render('signup', {page_title: "注册"});
});

app.post('/signup', function(req, res) {
    if(req.body.password_1 !== req.body.password_2) {
        res.redirect('/user/signup')
    } else {
        var md5 = crypto.createHash('md5');
        var form = {
            name: req.body.name,
            password: md5.update(req.body.password_1).digest('hex')
        };
        request.post({url: api_url + '/users/add', form: form}, function (error, response, body) {
            if(body !== 'FAILURE' && body !== 'EXISTED') {
                res.cookie('user', body, {maxAge:2678400000, path:'/', httpOnly:true});
            }
            res.redirect('/');
        });
    }
});

app.get('/signin', function(req, res) {
    res.render('signin', {page_title: "登录"});
});

app.post('/signin', function(req, res) {
    var md5 = crypto.createHash('md5');
    var form = {
        name: req.body.name,
        password: md5.update(req.body.password).digest('hex')
    };
    request.post({url: api_url + '/users/check', form: form}, function (error, response, body) {
        if(body !== 'NOTFOUND') {
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
    if(!req.cookies.user) {
        res.redirect('/user/signin');
        return;
    }
    request.get(api_url + '/sources', function(error, response, body) {
        var all_sources = JSON.parse(body);
        request.get({url: api_url + '/users/following', headers: {'user_id': JSON.parse(req.cookies.user).id}}, function(error, response, body) {
            var user_sources = JSON.parse(body);
            all_sources.forEach(all => {
                all.following = 0;
                user_sources.forEach(user => {
                    if(all.id === user.id) {
                        all.following = 1;
                        return;
                    }
                });
            });
            res.render('subscriptions', {page_title: "订阅", all_sources});
        });
    });
});

app.post('/search', function(req, res) {
    feed_url = req.body.feed_url;
    link_url = 
    request.get(api_url + '/sources/search?link=' + req.body.feed_url, function(error, response, body) {
        if(body==='NOTFOUND') {
            //
        } else {
            //
        }
    });
});

app.get('/follow/:sourceid', function(req, res) {
    if(!req.cookies.user) {
        res.redirect('/user/signin');
        return;
    }
    headers = {
        'user_id': JSON.parse(req.cookies.user).id,
        'source_id': req.params.sourceid
    }
    request.get({url: api_url + '/users/follow', headers: headers}, function(error, response, body) {
        res.redirect('/user/subscriptions');
    });
});

app.get('/unfollow/:sourceid', function(req, res) {
    if(!req.cookies.user) {
        res.redirect('/user/signin');
        return;
    }
    headers = {
        'user_id': JSON.parse(req.cookies.user).id,
        'source_id': req.params.sourceid
    }
    request.get({url: api_url + '/users/unfollow', headers: headers}, function(error, response, body) {
        res.redirect('/user/subscriptions');
    });
});

module.exports = app;